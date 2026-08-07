# Changelog

All notable changes to `@constellationdev/types` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

### Deprecated
- `getCallGraph` direction values `'callers'` and `'callees'` — use `'incoming'` and `'outgoing'`
  instead. The aliases will be removed in a future release.
- Symbol kind value `'decorator'` — use `'decorator_def'` (the value Core stores in the
  graph). The alias is still accepted via Zod `preprocess` and mapped to `decorator_def`;
  it will be removed in a future release.
