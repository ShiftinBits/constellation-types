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

### Deprecated
- `getCallGraph` direction values `'callers'` and `'callees'` — use `'incoming'` and `'outgoing'`
  instead. The aliases will be removed in a future release.
