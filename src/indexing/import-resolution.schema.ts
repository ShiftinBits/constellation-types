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
 * The key is `"<row>:<column>"` (both 0-based) of the import source node
 * (the module specifier node). Older clients send the legacy `"<row>"` form.
 * Consumers look up the exact key first, then the legacy row key, and ignore a
 * resolution whose `source` differs from the import being resolved.
 */
export const importResolutionMetadataSchema = z.record(
	z.string(),
	importResolutionSchema,
);

export type ImportResolutionMetadata = z.infer<
	typeof importResolutionMetadataSchema
>;
