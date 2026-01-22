/**
 * Get Call Graph Tool Schemas
 *
 * Zod schemas for the get_call_graph MCP tool.
 * Understands the call chain for a function (callers and callees).
 */

import { z } from 'zod';
import { graphRepresentationSchema } from '../common.schema';

/**
 * Input parameters schema for getting call graph
 */
export const getCallGraphParamsSchema = z.object({
	/** Symbol ID to analyze (if known) */
	symbolId: z.string().optional(),

	/** Symbol name (requires filePath if symbolId not provided) */
	symbolName: z.string().optional(),

	/** File path where function is defined */
	filePath: z.string().optional(),

	/** Direction of call graph to retrieve (default: 'both') */
	direction: z.enum(['callers', 'callees', 'both']).default('both'),

	/** Maximum depth to traverse */
	depth: z.number().int().positive().max(10).default(3),

	/** Exclude external/package calls */
	excludeExternal: z.boolean().optional(),

	/** Include graph representation */
	includeGraph: z.boolean().optional(),

	/** Maximum number of call relationships to return per page (default: 25, max: 100) */
	limit: z.number().int().positive().max(100).default(25),

	/** Offset for pagination (default: 0) */
	offset: z.number().int().nonnegative().default(0),
});

export type GetCallGraphParams = z.infer<typeof getCallGraphParamsSchema>;

/**
 * Root symbol of call graph schema
 */
export const callGraphRootSchema = z.object({
	/** Symbol ID */
	symbolId: z.string(),

	/** Symbol name */
	name: z.string(),

	/** File path */
	filePath: z.string(),

	/** Line number */
	line: z.number().int().positive(),

	/** Column number */
	column: z.number().int().nonnegative(),
});

export type CallGraphRoot = z.infer<typeof callGraphRootSchema>;

/**
 * Caller node in call graph schema
 */
export const callerNodeSchema = z.object({
	/** Symbol ID */
	symbolId: z.string(),

	/** Symbol name */
	name: z.string(),

	/** File path */
	filePath: z.string(),

	/** Line number */
	line: z.number().int().positive(),

	/** Column number */
	column: z.number().int().nonnegative(),

	/** Depth from root */
	depth: z.number().int().nonnegative(),
});

export type CallerNode = z.infer<typeof callerNodeSchema>;

/**
 * Callee node in call graph schema
 */
export const calleeNodeSchema = z.object({
	/** Symbol ID */
	symbolId: z.string(),

	/** Symbol name */
	name: z.string(),

	/** File path */
	filePath: z.string(),

	/** Line number */
	line: z.number().int().positive(),

	/** Column number */
	column: z.number().int().nonnegative(),

	/** Whether call is async */
	isAsync: z.boolean(),

	/** Depth from root */
	depth: z.number().int().nonnegative(),
});

export type CalleeNode = z.infer<typeof calleeNodeSchema>;

/**
 * Get call graph result schema
 */
export const getCallGraphResultSchema = z.object({
	/** Root symbol */
	root: callGraphRootSchema,

	/** Functions that call this symbol (if direction includes 'callers') */
	callers: z.array(callerNodeSchema).optional(),

	/** Functions this symbol calls (if direction includes 'callees') */
	callees: z.array(calleeNodeSchema).optional(),

	/** Graph representation (if includeGraph=true) */
	graph: graphRepresentationSchema.optional(),
});

export type GetCallGraphResult = z.infer<typeof getCallGraphResultSchema>;
