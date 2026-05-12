/**
 * Trace Symbol Usage Tool Schemas
 *
 * Zod schemas for the trace_symbol_usage MCP tool.
 * Follows where and how a symbol is used across the codebase.
 */

import { z } from 'zod';
import {
	complexityMetricsSchema,
	languageMetadataSchema,
} from '../common.schema';

/**
 * Input parameters schema for tracing symbol usage
 */
export const traceSymbolUsageParamsSchema = z.object({
	/** Symbol ID if known */
	symbolId: z.string().optional(),

	/** Symbol name (requires filePath) */
	symbolName: z.string().optional(),

	/** File path where symbol is defined */
	filePath: z.string().optional(),

	/** Filter by specific usage types */
	filterByUsageType: z.array(z.string()).optional(),

	/** Filter by relationship type (CALLS, REFERENCES, IMPORTS, etc.) */
	filterByRelationshipType: z.array(z.string()).optional(),

	/** Include indirect (transitive) usage */
	includeTransitive: z.boolean().optional(),

	/** Include usage context (code snippets) */
	includeContext: z.boolean().optional(),

	/** Exclude test files from results */
	excludeTests: z.boolean().optional(),

	/** Exclude generated files from results */
	excludeGenerated: z.boolean().optional(),

	/** Include importance weighting in results */
	includeImportanceWeight: z.boolean().optional(),

	/** Maximum results to return */
	limit: z.number().int().positive().max(100).default(50),

	/** Pagination offset */
	offset: z.number().int().nonnegative().default(0),
});

export type TraceSymbolUsageParams = z.infer<
	typeof traceSymbolUsageParamsSchema
>;

/**
 * Symbol reference for tracing schema
 */
export const tracedSymbolSchema = z.object({
	/** Symbol being traced */
	name: z.string(),

	/** Symbol kind */
	kind: z.string(),

	/** Access modifier (public/private/protected) for class members. Omitted for module-level symbols and interface members. */
	visibility: z.string().optional(),

	/** File where symbol is defined */
	filePath: z.string(),

	/** Optional line range end. Persisted as `endLine` on Neo4j `:Symbol`. */
	lineEnd: z.number().int().positive().optional(),

	/** Cyclomatic complexity metrics (present on function/method symbols) */
	complexity: complexityMetricsSchema.optional(),

	/** Language-specific metadata (e.g., language identifier) */
	languageMetadata: languageMetadataSchema.optional(),
});

export type TracedSymbol = z.infer<typeof tracedSymbolSchema>;

/**
 * Direct usage of a symbol schema
 */
export const directUsageSchema = z.object({
	/** File path where symbol is used */
	filePath: z.string(),

	/** Type of usage */
	usageType: z.string(), // import, call, type, inherit, reference

	/** Relationship type (CALLS, REFERENCES, IMPORTS, etc.) */
	relationshipType: z.string(),

	/** Line number where usage occurs */
	line: z.number().int().positive().optional(),

	/** Column number where usage occurs */
	column: z.number().int().nonnegative().optional(),

	/** Enclosing symbol (function/class containing this usage) */
	enclosingSymbol: z
		.object({
			name: z.string(),
			kind: z.string(),
		})
		.optional(),

	/** Surrounding code context (if includeContext=true) */
	context: z.string().optional(),

	/** Alias if symbol was renamed on import */
	aliasName: z.string().optional(),

	/** Whether this is a test file */
	isTest: z.boolean().optional(),

	/** Whether this is a generated file */
	isGenerated: z.boolean().optional(),

	/** Importance weight (0.0-1.0, if includeImportanceWeight=true) */
	importanceWeight: z.number().min(0).max(1).optional(),
});

export type DirectUsage = z.infer<typeof directUsageSchema>;

/**
 * Transitive usage (indirect) schema
 */
export const transitiveUsageSchema = z.object({
	/** File path */
	filePath: z.string(),

	/** Number of hops from source symbol */
	distance: z.number().int().positive(),

	/** Chain showing how it's reached */
	chain: z.array(z.string()),
});

export type TransitiveUsage = z.infer<typeof transitiveUsageSchema>;

/**
 * Pagination state for a single page of `directUsages`.
 *
 * `directUsages` is capped at `limit` (default 50). When `hasMore` is true,
 * call again with `offset += limit` to fetch the next page. Results are
 * ordered by (filePath, line), so alphabetically-earlier files fill the
 * page first — this is the reason later files can appear "missing" on a
 * partial page.
 */
export const tracePageInfoSchema = z.object({
	/** Maximum rows requested for this page (echoes the input `limit`). */
	limit: z.number().int().positive(),

	/** Offset of this page into the full result set (echoes input `offset`). */
	offset: z.number().int().nonnegative(),

	/** Number of rows actually returned in `directUsages` for this page. */
	returned: z.number().int().nonnegative(),

	/** True when more rows are available beyond this page. */
	hasMore: z.boolean(),
});

export type TracePageInfo = z.infer<typeof tracePageInfoSchema>;

/**
 * Population-level summary of the full (unpaginated) result set, plus
 * `pageInfo` describing the slice surfaced in `directUsages`.
 *
 * `totalUsages`, `usagesByType`, and `filesAffected` are computed from the
 * deduped pre-pagination row set, not from the page — consumers can trust
 * them to describe the full result regardless of `limit`/`offset`.
 */
export const traceSummarySchema = z.object({
	/** Total deduped usage rows across the entire result set. */
	totalUsages: z.number().int().nonnegative(),

	/** Counts per winning relationship type across the full result set. */
	usagesByType: z.record(z.string(), z.number().int().nonnegative()),

	/** Number of distinct files containing at least one usage. */
	filesAffected: z.number().int().nonnegative(),

	/** Count of transitive usages when `includeTransitive=true`, else 0. */
	transitiveImpact: z.number().int().nonnegative(),

	/** Pagination state for the `directUsages` slice. */
	pageInfo: tracePageInfoSchema,
});

export type TraceSummary = z.infer<typeof traceSummarySchema>;

/**
 * Trace symbol usage result schema
 */
export const traceSymbolUsageResultSchema = z.object({
	/** Symbol being traced */
	symbol: tracedSymbolSchema,

	/** Direct usages of the symbol (paginated — see `summary.pageInfo`) */
	directUsages: z.array(directUsageSchema),

	/** Transitive usages (if includeTransitive=true) */
	transitiveUsages: z.array(transitiveUsageSchema).optional(),

	/** Population-level totals + pagination state */
	summary: traceSummarySchema,
});

export type TraceSymbolUsageResult = z.infer<
	typeof traceSymbolUsageResultSchema
>;
