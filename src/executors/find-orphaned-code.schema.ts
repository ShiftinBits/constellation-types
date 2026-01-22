/**
 * Find Orphaned Code Tool Schemas
 *
 * Zod schemas for the find_orphaned_code MCP tool.
 * Identifies unused exports and dead code.
 */

import { z } from 'zod';

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

	/** File path */
	filePath: z.string(),

	/** Whether symbol is exported */
	isExported: z.boolean(),

	/** Reason for being orphaned */
	reason: z.string(),

	/** Confidence (0-1) */
	confidence: z.number().min(0).max(1),
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

	/** Last updated timestamp */
	lastUpdated: z.string(),

	/** Confidence (0-1) */
	confidence: z.number().min(0).max(1),
});

export type OrphanedFile = z.infer<typeof orphanedFileSchema>;

/**
 * Find orphaned code result schema
 */
export const findOrphanedCodeResultSchema = z.object({
	/** Orphaned symbols */
	orphanedSymbols: z.array(orphanedSymbolSchema),

	/** Orphaned files */
	orphanedFiles: z.array(orphanedFileSchema),
});

export type FindOrphanedCodeResult = z.infer<
	typeof findOrphanedCodeResultSchema
>;
