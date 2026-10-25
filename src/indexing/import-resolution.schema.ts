/**
 * Import Resolution Schemas
 *
 * Zod schemas for import resolution metadata.
 * CLI provides this because only it has access to tsconfig/jsconfig path mappings.
 */

import { z } from 'zod';

/**
 * Type of import for debugging/analytics
 */
export const importTypeSchema = z.enum([
	'relative',
	'workspace',
	'alias',
	'external',
	'builtin',
]);

export type ImportType = z.infer<typeof importTypeSchema>;

/**
 * Import resolution metadata for a single import statement.
 * CLI provides this because only it has access to tsconfig/jsconfig path mappings.
 */
export const importResolutionSchema = z.object({
	/** Original import specifier from source code */
	source: z.string(),

	/** Resolved project-relative path (e.g., './libs/database/src/index.ts') */
	/** Only present for internal project files */
	resolvedPath: z.string().optional(),

	/** Whether this is an external package (npm, etc.) */
	isExternal: z.boolean(),

	/** Type of import for debugging/analytics */
	importType: importTypeSchema,
});

export type ImportResolution = z.infer<typeof importResolutionSchema>;

/**
 * Map of import positions to import resolutions.
 * CLI has access to tsconfig/jsconfig and can properly resolve path aliases.
 *
 * The key is `"<row>:<column>"` (both 0-based, non-negative integers) of the
 * import source node (the module specifier node), or the legacy `"<row>"` form.
 * Keys that do not match one of these forms are rejected. The `source` field of
 * each value carries the original import specifier.
 */
export const importResolutionMetadataSchema = z.record(
	z.string().regex(/^\d+(:\d+)?$/),
	importResolutionSchema,
);

export type ImportResolutionMetadata = z.infer<
	typeof importResolutionMetadataSchema
>;
