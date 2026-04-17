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
 */
export const referenceTypeSchema = z.enum([
	'call', // function call: f() or obj.f()
	'read', // identifier read in expression
	'write', // assignment target
	'type', // used in type position
	'instantiate', // new Foo()
	'import-use', // reference resolved through an import; set by resolver, not extractor
]);

export type ReferenceType = z.infer<typeof referenceTypeSchema>;

/**
 * Subset of ReferenceType that extractors may emit directly.
 * `import-use` is excluded because it can only be determined at resolution time.
 */
export const extractorReferenceTypeSchema = referenceTypeSchema.exclude([
	'import-use',
]);

export type ExtractorReferenceType = z.infer<
	typeof extractorReferenceTypeSchema
>;
