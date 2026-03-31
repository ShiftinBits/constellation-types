import { z } from 'zod';
import { riskLevelSchema } from '../common.schema';

// Node type enum matching constellation-web's graphTheme node types
export const graphNodeTypeSchema = z.enum([
	'function', 'class', 'variable', 'import', 'module',
	'interface', 'type', 'constant', 'export',
]);
export type GraphNodeType = z.infer<typeof graphNodeTypeSchema>;

// Edge type enum matching Neo4j relationship types
export const graphEdgeTypeSchema = z.enum([
	'calls', 'imports', 'extends', 'inherits', 'implements',
	'uses', 'references', 'exports', 'contains',
]);
export type GraphEdgeType = z.infer<typeof graphEdgeTypeSchema>;

export const graphNodeSchema = z.object({
	id: z.string(),
	label: z.string(),
	type: graphNodeTypeSchema,
	data: z.object({
		filePath: z.string(),
		lineNumber: z.number().int().nonnegative(),
		module: z.string(),
		visibility: z.string(),
		isExported: z.boolean(),
	}),
});
export type GraphNode = z.infer<typeof graphNodeSchema>;

export const graphEdgeSchema = z.object({
	id: z.string(),
	source: z.string(),
	target: z.string(),
	type: graphEdgeTypeSchema,
	label: z.string().optional(),
});
export type GraphEdge = z.infer<typeof graphEdgeSchema>;

export const graphSummarySchema = z.object({
	totalNodes: z.number().int().nonnegative(),
	totalEdges: z.number().int().nonnegative(),
	toolName: z.string(),
	query: z.string(),
	riskLevel: riskLevelSchema.optional(),
});
export type GraphSummary = z.infer<typeof graphSummarySchema>;

export const graphMetadataSchema = z.object({
	projectName: z.string(),
	branch: z.string(),
	asOfCommit: z.string(),
	lastIndexedAt: z.string(),
});
export type GraphMetadata = z.infer<typeof graphMetadataSchema>;

export const graphToolResultSchema = z.object({
	nodes: z.array(graphNodeSchema),
	edges: z.array(graphEdgeSchema),
	summary: graphSummarySchema,
	metadata: graphMetadataSchema,
});
export type GraphToolResult = z.infer<typeof graphToolResultSchema>;
