## What This Is

`@constellationdev/types` — the single source of truth for shared Zod schemas and TypeScript types across the Constellation system (Core, CLI, MCP). Every data contract between services is defined here as a Zod schema with co-located inferred TypeScript types.

## Commands

```bash
npm run build        # Build via tsup (CJS + ESM + .d.ts)
npm run type-check   # tsc --noEmit (no output, just validates)
npm run clean        # Removes dist/
```

There is no test suite in this project. Validation happens via `type-check` and downstream consumer compilation.

## Build System

- **tsup** bundles from one entry point: `src/index.ts` (full export)
- Outputs CJS (`.js`), ESM (`.mjs`), and declarations (`.d.ts`) to `dist/`
- `dist/` is gitignored (published to npmjs via CI, not committed)

## Publishing

Published to **npmjs** as a public npm package on each GitHub release.

- **Workflow**: `.github/workflows/publish.yml` triggers on `release: published`
- **Version**: Driven by the release tag (e.g., tag `v1.2.0` publishes version `1.2.0`)
- **Auth**: npm trusted publishing (OIDC, no stored tokens)


Consumers reference the package via semver (e.g., `"@constellationdev/types": "^1.0.0"`). Version bumps in consumers are manual.

## Architecture

### Top-Level Barrel

- **`src/index.ts`** — Full package export (mapped in `package.json` `exports`). Includes everything: common schemas, API response, all executor schemas, and all indexing schemas. Used by Core and CLI via `import { ... } from '@constellationdev/types'`.

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

Category barrels (`executors/index.ts`, `indexing/index.ts`) use explicit named exports per schema file. The top-level barrel (`src/index.ts`) uses `export *` from category barrels.

## Adding New Types

1. Create schema file in `src/executors/` or `src/indexing/`
2. Export both schema and type from the file
3. Add explicit exports to the category's `index.ts` barrel
4. Run `npm run build`, publish new version, update consumers

## Constraints

- **Node >=24.0.0, npm >=11.0.0** (enforced via `engine-strict` in workspace `.npmrc`)
- **TypeScript ~5.9.3**, strict mode with `noImplicitAny` and `strictNullChecks`
- **Zod ^3.24** is the only runtime dependency
- **Husky** is configured but has no active hooks (pre-commit build hook removed)
- All file paths in schemas use POSIX format (forward slashes)

## Worktrees

Create git worktrees only under this repo's `.claude/worktrees/<branch-slug>` (already gitignored), e.g. `git worktree add .claude/worktrees/feat-x -b feat/x origin/main`. Never create them outside the repo (e.g. sibling `../constellation-<name>-<branch>` folders) or in a `.worktrees/` directory.
