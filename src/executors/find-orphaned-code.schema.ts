/**
 * Find Orphaned Code Tool Schemas
 *
 * Zod schemas for the find_orphaned_code MCP tool.
 * Identifies unused exports and dead code.
 */

import { z } from 'zod';
import {
	languageMetadataSchema,
	paginationMetadataSchema,
} from '../common.schema';

/**
 * Input parameters schema for finding orphaned code
 */
export const findOrphanedCodeParamsSchema = z.object({
	/** File pattern to search */
	filePattern: z.string().optional(),

	/** Filter by symbol kinds */
	filterByKind: z.array(z.string()).optional(),

	/** Only check exported symbols */
	exportedOnly: z.boolean().optional(),

	/** Exclude test files from orphan analysis @default true */
	excludeTests: z.boolean().default(true),

	/** Maximum results to return */
	limit: z.number().int().positive().max(100).default(50),

	/** Pagination offset */
	offset: z.number().int().nonnegative().default(0),

	/** Include confidence scoring */
	includeConfidence: z.boolean().optional(),
});

export type FindOrphanedCodeParams = z.infer<
	typeof findOrphanedCodeParamsSchema
>;

/**
 * Orphaned symbol schema
 */
export const orphanedSymbolSchema = z.object({
	/** Symbol ID */
	symbolId: z.string(),

	/** Symbol name */
	name: z.string(),

	/** Symbol kind */
	kind: z.string(),

	/** Access modifier (public/private/protected) for class members. Omitted for module-level symbols and interface members. */
	visibility: z.string().optional(),

	/** File path */
	filePath: z.string(),

	/** Optional line range end. Persisted as `endLine` on Neo4j `:Symbol`. */
	lineEnd: z.number().int().positive().optional(),

	/** Whether symbol is exported */
	isExported: z.boolean(),

	/** Reason for being orphaned */
	reason: z.string(),

	/** Confidence (0-1) */
	confidence: z.number().min(0).max(1),

	/** Language-specific metadata (e.g., language identifier) */
	languageMetadata: languageMetadataSchema.optional(),
});

export type OrphanedSymbol = z.infer<typeof orphanedSymbolSchema>;

/**
 * Orphaned file schema
 */
export const orphanedFileSchema = z.object({
	/** File path */
	filePath: z.string(),

	/** Reason for being orphaned */
	reason: z.string(),

	/** Last updated timestamp. Optional: the orphaned-files cypher does not currently project this. */
	lastUpdated: z.string().optional(),

	/** Confidence (0-1) */
	confidence: z.number().min(0).max(1),
});

export type OrphanedFile = z.infer<typeof orphanedFileSchema>;

/**
 * Summary block describing the totals behind a find_orphaned_code response.
 */
export const findOrphanedCodeSummarySchema = z.object({
	/** Total orphaned symbols on the active branch (pre-pagination) */
	totalOrphanedSymbols: z.number().int().nonnegative(),

	/** Total orphaned files returned (file results are capped server-side) */
	totalOrphanedFiles: z.number().int().nonnegative(),

	/** Convenience sum: totalOrphanedSymbols + totalOrphanedFiles */
	potentialDeletions: z.number().int().nonnegative(),
});

export type FindOrphanedCodeSummary = z.infer<
	typeof findOrphanedCodeSummarySchema
>;

/**
 * Find orphaned code result schema.
 *
 * Pagination applies to `orphanedSymbols` (controlled by `limit`/`offset`).
 * `orphanedFiles` is capped server-side and is not user-paginated.
 */
export const findOrphanedCodeResultSchema = z.object({
	/** Orphaned symbols (paginated by `limit`/`offset`) */
	orphanedSymbols: z.array(orphanedSymbolSchema),

	/** Orphaned files (server-capped, not paginated) */
	orphanedFiles: z.array(orphanedFileSchema),

	/** Totals for the active branch */
	summary: findOrphanedCodeSummarySchema.optional(),

	/** Pagination metadata for `orphanedSymbols` */
	pagination: paginationMetadataSchema.optional(),
});

export type FindOrphanedCodeResult = z.infer<
	typeof findOrphanedCodeResultSchema
>;
