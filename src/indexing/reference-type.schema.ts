/**
 * Reference Type Schemas
 *
 * Zod schemas for the types of references emitted in the code graph's :REFERENCES edges.
 */

import { z } from 'zod';

/**
 * Reference types emitted in the code graph's :REFERENCES edges.
 *
 * Extractor emits: call | read | write | type | instantiate
 * Cross-file resolver stamps: import-use (when reference resolves through an import)
 * Classification map + LSP enrichment stamps: declaration (at declaration
 *   sites where LSP's find-all-references returns structural cross-refs —
 *   import specifiers, method/property declarations, class/interface names,
 *   function and variable declarators, parameters, etc. The classifier
 *   emits `declaration` at these positions so LSP-written edges carry a
 *   meaningful kind rather than null. The extractor never writes
 *   `declaration` directly: declaration sites emit DEFINES/DECLARES, not
 *   REFERENCES, in the extractor path.)
 */
export const referenceTypeSchema = z.enum([
	'call', // function call: f() or obj.f()
	'read', // identifier read in expression
	'write', // assignment target
	'type', // used in type position
	'instantiate', // new Foo()
	'import-use', // reference resolved through an import; set by resolver, not extractor
	'declaration', // declaration-site cross-reference (LSP structural typing)
]);

export type ReferenceType = z.infer<typeof referenceTypeSchema>;

/**
 * Subset of ReferenceType that extractors may emit directly.
 * `import-use` is excluded because it can only be determined at resolution time.
 * `declaration` is excluded because declaration sites emit DEFINES/DECLARES
 *   not REFERENCES in the extractor path; only the classificationMap +
 *   LSP enrichment path writes this kind.
 */
export const extractorReferenceTypeSchema = referenceTypeSchema.exclude([
	'import-use',
	'declaration',
]);

export type ExtractorReferenceType = z.infer<
	typeof extractorReferenceTypeSchema
>;
