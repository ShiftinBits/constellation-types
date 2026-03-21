/**
 * Trace Symbol Usage Tool Schemas
 *
 * Zod schemas for the trace_symbol_usage MCP tool.
 * Follows where and how a symbol is used across the codebase.
 */

import { z } from 'zod';

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

	/** File where symbol is defined */
	filePath: z.string(),
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
 * Trace symbol usage result schema
 */
export const traceSymbolUsageResultSchema = z.object({
	/** Symbol being traced */
	symbol: tracedSymbolSchema,

	/** Direct usages of the symbol */
	directUsages: z.array(directUsageSchema),

	/** Transitive usages (if includeTransitive=true) */
	transitiveUsages: z.array(transitiveUsageSchema).optional(),
});

export type TraceSymbolUsageResult = z.infer<
	typeof traceSymbolUsageResultSchema
>;
