/**
 * Serialized AST Schema
 *
 * Zod schema for the AST payload sent from CLI to Core.
 * Contains compressed AST data without source code to maintain privacy.
 */

import { z } from 'zod';
import { importResolutionMetadataSchema } from './import-resolution.schema';
import { classificationMapSchema } from './classification-map.schema';

/**
 * Represents a serialized Abstract Syntax Tree ready for transmission to the API.
 * Contains compressed AST data without source code to maintain privacy.
 */
export const serializedAstSchema = z.object({
	/** Relative path to the source file from project root */
	file: z.string().min(1),

	/** Programming language identifier (e.g., 'typescript', 'javascript') */
	language: z.string().min(1),

	/** Git commit hash when this AST was generated */
	commit: z.string().min(1),

	/** ISO timestamp when the AST was created */
	timestamp: z.string().datetime(),

	/** Base64-encoded, gzip-compressed AST structure (no source code) */
	ast: z.string().min(1),

	/** CLI-resolved import paths (only CLI has tsconfig/jsconfig access) */
	importResolutions: importResolutionMetadataSchema.optional(),

	/** Per-position reference classifications computed by CLI during parse */
	classificationMap: classificationMapSchema.optional(),
});

export type SerializedAST = z.infer<typeof serializedAstSchema>;
