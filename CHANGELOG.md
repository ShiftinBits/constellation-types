# Changelog

All notable changes to `@constellationdev/types` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `callSiteDefinitionSchema` / `CallSiteDefinition`: one record per call site whose callee
  the language server resolved to a definition inside the project. `fileEnrichmentSchema`
  gains an optional `callSites` array (max 10,000) with a three-state contract: omitted
  leaves existing call edges untouched, `[]` clears stale LSP-sourced `CALLS` edges for the
  file, non-empty is the complete set of resolved sites. The CLI must omit `callSites` for a
  file with more than 10,000 resolved sites.
- **Rollout order**: `fileEnrichmentSchema` is `.strict()`, so Core must be bumped to this
  version and deployed before any CLI emits `callSites`; otherwise Core rejects the whole
  NDJSON request.

### Changed
- `getCallGraphParamsSchema.direction` canonical enum is now `['incoming', 'outgoing', 'both']`.
  `incoming` replaces `callers` and `outgoing` replaces `callees`. The deprecated values
  are still accepted via Zod `preprocess` and mapped to the canonical values; consumers
  should migrate to the new values during this release cycle. Response field keys
  (`callers`, `callees`) are unchanged.
- **Breaking**: `filterByKind` (`searchSymbols`, `findOrphanedCode`), `filterByUsageType`
  (`traceSymbolUsage`), and `filterByRelationshipType` (`traceSymbolUsage`) are now
  validated against closed enums instead of accepting arbitrary strings. Unknown values
  produce a Zod validation error rather than a silently empty result. Kind filters
  validate against `symbolKindCategorySchema`; `filterByRelationshipType` validates
  against `traceRelationshipTypeSchema` (`REFERENCES`, `CALLS`, `IMPORTS`, `INHERITS` —
  the edge types the trace traversal actually joins on).
- `symbolKindCategorySchema` now covers every kind Core's extractors write to the graph:
  added `type_alias`, `enum_member`, `mixin`, `union`, `object`, `annotation`, `package`,
  `protocol`, `generator`, and the canonical `decorator_def`. Previously listed values
  are retained for wire compatibility.
- `symbolEnrichmentSchema.implementations` semantics narrowed: Core consumes it only on
  concrete Go structs and writes `symbol IMPLEMENTS interface`; it is ignored for any
  other symbol kind. A concrete Go struct with no interfaces must send `[]` so stale edges
  are cleared.

### Deprecated
- `symbolEnrichmentSchema.typeInfo`, `references`, and `callHierarchy` are deprecated and
  ignored by Core. They remain optional so payloads from older CLIs still validate.
- `getCallGraph` direction values `'callers'` and `'callees'` — use `'incoming'` and `'outgoing'`
  instead. The aliases will be removed in a future release.
- Symbol kind value `'decorator'` — use `'decorator_def'` (the value Core stores in the
  graph). The alias is still accepted via Zod `preprocess` and mapped to `decorator_def`;
  it will be removed in a future release.
