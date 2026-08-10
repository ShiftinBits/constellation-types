/**
 * AST Upload Payload Schema
 *
 * Envelope for the batch of ASTs (and incremental-indexing metadata) sent
 * from CLI to Core in a single upload request.
 */

import { z } from 'zod';
import { serializedAstSchema } from './serialized-ast.schema';

/**
 * A file rename detected by the CLI between the previous and current commit.
 */
export const astUploadRenameSchema = z.object({
	from: z.string(),
	to: z.string(),
});

export type AstUploadRename = z.infer<typeof astUploadRenameSchema>;

/**
 * Envelope for an AST upload request: serialized ASTs plus incremental
 * indexing metadata (deletions, renames, and the full file manifest).
 */
export const astUploadPayloadSchema = z.object({
	/** Serialized ASTs for added/modified files in this upload */
	asts: z.array(serializedAstSchema),

	/** Relative paths of files deleted since the previous indexed commit */
	deletedFiles: z.array(z.string()),

	/** Files renamed since the previous indexed commit */
	renames: z.array(astUploadRenameSchema),

	/** Full list of relative file paths present at the current commit */
	fileManifest: z.array(z.string()),
});

export type AstUploadPayload = z.infer<typeof astUploadPayloadSchema>;
