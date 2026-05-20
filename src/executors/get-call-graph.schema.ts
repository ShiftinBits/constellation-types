/**
 * Get Call Graph Tool Schemas
 *
 * Zod schemas for the get_call_graph MCP tool.
 * Understands the call chain for a function (incoming and outgoing calls).
 *
 * Direction enum: `'incoming' | 'outgoing' | 'both'`.
 *   - `'incoming'`  → functions that call this symbol
 *   - `'outgoing'`  → functions this symbol calls
 *   - `'both'`      → both directions (default)
 *
 * Deprecated aliases `'callers'` and `'callees'` are still accepted for one
 * release and mapped via Zod `preprocess` to `'incoming'` and `'outgoing'`
 * respectively. The server logs a one-line deprecation warning when these
 * are seen. These aliases will be removed in a future release.
 *
 * Note: the response shape continues to use `callers` and `callees` array
 * fields — only the input `direction` enum is renamed.
 */

import { z } from 'zod';
import {
	graphRepresentationSchema,
	complexityMetricsSchema,
	languageMetadataSchema,
} from '../common.schema';

/**
 * Canonical direction values for `getCallGraph`.
 *
 * `incoming` and `outgoing` align with the rest of the graph traversal
 * vocabulary. `callers`/`callees` are still accepted via `preprocess` for
 * backward compatibility for one release.
 */
export const callGraphDirectionSchema = z.preprocess(
	(val) => {
		if (val === 'callers') return 'incoming';
		if (val === 'callees') return 'outgoing';
		return val;
	},
	z.enum(['incoming', 'outgoing', 'both']),
);

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

	/**
	 * Direction of call graph to retrieve (default: 'both').
	 * Accepts `'incoming' | 'outgoing' | 'both'`. Deprecated aliases
	 * `'callers'` (→ `'incoming'`) and `'callees'` (→ `'outgoing'`) still
	 * work for one release and emit a server-side deprecation warning.
	 */
	direction: callGraphDirectionSchema.default('both'),

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

	/** Access modifier (public/private/protected) for class members. Omitted for module-level symbols and interface members. */
	visibility: z.string().optional(),

	/** File path */
	filePath: z.string(),

	/** Line number */
	line: z.number().int().positive(),

	/** Optional line range end. Persisted as `endLine` on Neo4j `:Symbol`. */
	lineEnd: z.number().int().positive().optional(),

	/** Column number */
	column: z.number().int().nonnegative(),

	/** Cyclomatic complexity metrics (present on function/method symbols) */
	complexity: complexityMetricsSchema.optional(),

	/** Language-specific metadata (e.g., language identifier) */
	languageMetadata: languageMetadataSchema.optional(),
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

	/** Access modifier (public/private/protected) for class members. Omitted for module-level symbols and interface members. */
	visibility: z.string().optional(),

	/** File path */
	filePath: z.string(),

	/** Line number */
	line: z.number().int().positive(),

	/** Optional line range end. Persisted as `endLine` on Neo4j `:Symbol`. */
	lineEnd: z.number().int().positive().optional(),

	/** Column number */
	column: z.number().int().nonnegative(),

	/** Depth from root */
	depth: z.number().int().nonnegative(),

	/** Cyclomatic complexity metrics (present on function/method symbols) */
	complexity: complexityMetricsSchema.optional(),

	/** Language-specific metadata (e.g., language identifier) */
	languageMetadata: languageMetadataSchema.optional(),
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

	/** Access modifier (public/private/protected) for class members. Omitted for module-level symbols and interface members. */
	visibility: z.string().optional(),

	/** File path */
	filePath: z.string(),

	/** Line number */
	line: z.number().int().positive(),

	/** Optional line range end. Persisted as `endLine` on Neo4j `:Symbol`. */
	lineEnd: z.number().int().positive().optional(),

	/** Column number */
	column: z.number().int().nonnegative(),

	/** Whether call is async */
	isAsync: z.boolean(),

	/** Depth from root */
	depth: z.number().int().nonnegative(),

	/** Cyclomatic complexity metrics (present on function/method symbols) */
	complexity: complexityMetricsSchema.optional(),

	/** Language-specific metadata (e.g., language identifier) */
	languageMetadata: languageMetadataSchema.optional(),
});

export type CalleeNode = z.infer<typeof calleeNodeSchema>;

/**
 * Get call graph result schema
 */
export const getCallGraphResultSchema = z.object({
	/** Root symbol */
	root: callGraphRootSchema,

	/** Functions that call this symbol (populated when direction is 'incoming' or 'both'). */
	callers: z.array(callerNodeSchema).optional(),

	/** Functions this symbol calls (populated when direction is 'outgoing' or 'both'). */
	callees: z.array(calleeNodeSchema).optional(),

	/** Graph representation (if includeGraph=true) */
	graph: graphRepresentationSchema.optional(),
});

export type GetCallGraphResult = z.infer<typeof getCallGraphResultSchema>;
