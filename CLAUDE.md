## What This Is

`@constellationdev/types` — the single source of truth for shared Zod schemas and TypeScript types across the Constellation system (Core, CLI, MCP). Every data contract between services is defined here as a Zod schema with co-located inferred TypeScript types.

## Commands

```bash
npm run build        # Build via tsup (CJS + ESM + .d.ts). Auto-runs npm link locally (skipped in CI)
npm run type-check   # tsc --noEmit (no output, just validates)
npm run clean        # Removes dist/
```

There is no test suite in this project. Validation happens via `type-check` and downstream consumer compilation.

## Build System

- **tsup** bundles from two entry points: `src/index.ts` (full export) and `src/mcp-api.ts` (MCP-only subset)
- Outputs CJS (`.js`), ESM (`.mjs`), and declarations (`.d.ts`) to `dist/`
- `dist/` is committed to git (pre-commit hook runs build + `git add dist/`) so GitHub installs include pre-built files
- Post-build auto-runs `npm link` for local development (not in CI)

## Architecture

### Two Build Entry Points

- **`src/index.ts`** — Full package export (mapped in `package.json` `exports`). Includes everything: common schemas, API response, all executor schemas, and all indexing schemas. Used by Core and CLI via `import { ... } from '@constellationdev/types'`.
- **`src/mcp-api.ts`** — MCP-consumer subset. Excludes CLI-to-Core indexing types (`SerializedAST`, `ImportResolution`, etc.) that AI assistants don't need. Built by tsup to `dist/mcp-api.*` but **not** a package subpath export — consumed directly by MCP resource generation at `constellation://types/api`, not importable by package consumers.

### Schema Categories

**`src/common.schema.ts`** — Shared primitives reused across executors:
- `PaginationMetadata`, `ConfidenceScore`, `DataQualityMetadata`
- `FileLocation`, `SymbolReference`, `SymbolKindCategory`, `RiskLevel`
- `GraphRepresentation` (nodes + edges), `RelationshipDirections`
- Constants: `TEST_PATTERNS`, `ENTRY_POINT_PATTERNS` (multi-language regex maps)

**`src/api-response.schema.ts`** — Generic `ApiResponse<T>` wrapper with `isSuccessResponse`/`isErrorResponse` type guards.

**`src/executors/`** — Params + Result schemas for all 11 MCP executors:
`search-symbols`, `get-symbol-details`, `get-dependencies`, `get-dependents`, `find-circular-dependencies`, `trace-symbol-usage`, `get-call-graph`, `impact-analysis`, `find-orphaned-code`, `get-architecture-overview`, `ping`

Each file follows the pattern: `{name}ParamsSchema` + `{name}ResultSchema` with inferred types exported alongside.

**`src/indexing/`** — CLI-to-Core pipeline types:
- `SerializedAST` — Compressed AST payload (no source code, base64+gzip)
- `ImportResolution` — CLI-resolved import paths (only CLI has tsconfig access)
- `IndexingResponse` — Three-pass indexing result (node creation → relationships → cross-file resolution)
- `ProjectState` — Project metadata (branch, commit, file count, languages)
- Tree-sitter interfaces (`SyntaxNode`, `Tree`, `Point`) — Avoids native dependency for consumers

### Convention: Schema + Type Co-location

Every schema exports both the Zod schema and the inferred TS type:
```typescript
export const fooSchema = z.object({ ... });
export type Foo = z.infer<typeof fooSchema>;
```

Category barrels (`executors/index.ts`, `indexing/index.ts`) use explicit named exports per schema file. Top-level barrels (`src/index.ts`, `src/mcp-api.ts`) use `export *` from category barrels.

## Adding New Types

1. Create schema file in `src/executors/` or `src/indexing/`
2. Export both schema and type from the file
3. Add explicit exports to the category's `index.ts` barrel
4. If MCP-relevant, also export from `src/mcp-api.ts`
5. Run `npm run build` — this rebuilds and auto-links locally

## Constraints

- **Node >=24.0.0, npm >=11.0.0** (enforced via `engine-strict` in workspace `.npmrc`)
- **TypeScript ~5.9.3**, strict mode with `noImplicitAny` and `strictNullChecks`
- **Zod ^3.24** is the only runtime dependency
- **Husky pre-commit** hook runs build and stages `dist/` — commits always include built output
- All file paths in schemas use POSIX format (forward slashes)
