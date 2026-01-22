/**
 * Indexing Response Schemas
 *
 * Zod schemas for AST indexing operation responses.
 *
 * ## Three-Pass Indexing Architecture
 *
 * The AST indexing pipeline operates in three sequential passes:
 *
 * **Pass 1 (Synchronous)**: Node Creation
 * - Creates File and Symbol nodes in Neo4j
 * - Establishes CONTAINS relationships (File -> Symbol)
 * - Failures tracked in `failedFiles` array
 *
 * **Pass 2 (Synchronous)**: Relationship Creation
 * - Creates inter-symbol relationships (IMPORTS, CALLS, INHERITS, IMPLEMENTS, etc.)
 * - Uses UnresolvedSymbol/UnresolvedCall nodes for forward references
 * - Failures tracked in `relationships.filesWithFailures`
 *
 * **Pass 3 (Synchronous)**: Cross-File Symbol Resolution
 * - Resolves UnresolvedSymbol/UnresolvedCall nodes to actual targets
 * - Creates cross-file CALLS, REFERENCES, and USES_SYMBOL relationships
 * - Failures are logged but don't fail the overall operation
 *
 * All three passes complete before the API response is sent.
 */

import { z } from 'zod';

/**
 * Represents a file that failed to index during processing.
 */
export const fileFailureSchema = z.object({
	/** Relative file path */
	file: z.string(),

	/** Error message describing the failure */
	error: z.string(),
});

export type FileFailure = z.infer<typeof fileFailureSchema>;

/**
 * Represents a file with relationship creation failures.
 * Tracks which files had issues creating graph relationships.
 */
export const relationshipFailureSchema = z.object({
	/** Relative file path */
	file: z.string(),

	/** Number of relationships that failed to create */
	failedCount: z.number().int().nonnegative(),

	/** Number of relationships that were successfully created */
	createdCount: z.number().int().nonnegative(),

	/** Whether failures were due to transient errors (retryable) */
	isTransient: z.boolean(),
});

export type RelationshipFailure = z.infer<typeof relationshipFailureSchema>;

/**
 * Summary of relationship creation results.
 */
export const relationshipSummarySchema = z.object({
	/** Total number of relationships created across all files */
	totalCreated: z.number().int().nonnegative(),

	/** Total number of relationships that failed to create */
	totalFailed: z.number().int().nonnegative(),

	/** Files that had at least one relationship failure */
	filesWithFailures: z.array(relationshipFailureSchema),
});

export type RelationshipSummary = z.infer<typeof relationshipSummarySchema>;

/**
 * Response from AST indexing operations.
 *
 * This response reflects the results of all three passes (node creation,
 * relationship creation, and cross-file symbol resolution).
 */
export const indexingResponseSchema = z.object({
	/** Number of files successfully processed in Pass 1 */
	processed: z.number().int().nonnegative(),

	/** Number of files that failed in Pass 1 */
	failed: z.number().int().nonnegative(),

	/** Project identifier */
	projectId: z.string(),

	/** Git branch name */
	branchName: z.string(),

	/** Details of files that failed during Pass 1 (node creation) */
	failedFiles: z.array(fileFailureSchema).optional(),

	/** Summary of relationship creation results from Pass 2 (always present) */
	relationships: relationshipSummarySchema,
});

export type IndexingResponse = z.infer<typeof indexingResponseSchema>;
