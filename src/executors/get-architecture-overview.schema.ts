/**
 * Get Architecture Overview Tool Schemas
 *
 * Zod schemas for retrieving high-level architecture information about the codebase.
 */

import { z } from 'zod';

/**
 * Input parameters schema for getting architecture overview
 */
export const getArchitectureOverviewParamsSchema = z.object({
	/** Include detailed metrics @default false */
	includeMetrics: z.boolean().default(false),

	/** Include module-level graph structure @default false */
	includeModuleGraph: z.boolean().default(false),

	/** Include external package dependency details (production/development classification) @default true */
	includePackages: z.boolean().default(true),
});

export type GetArchitectureOverviewParams = z.infer<
	typeof getArchitectureOverviewParamsSchema
>;

/**
 * Language information schema
 */
export const languageInfoSchema = z.object({
	language: z.string(),
	fileCount: z.number().int().nonnegative(),
	percentage: z.number().min(0).max(100),
});

export type LanguageInfo = z.infer<typeof languageInfoSchema>;

/**
 * Framework detection info schema
 */
export const frameworkInfoSchema = z.object({
	name: z.string(),
	version: z.string().optional(),
	confidence: z.enum(['high', 'medium', 'low']),
	evidence: z.array(z.string()),
});

export type FrameworkInfo = z.infer<typeof frameworkInfoSchema>;

/**
 * Project metadata schema
 */
export const projectMetadataSchema = z.object({
	languages: z.array(languageInfoSchema),
	frameworks: z.array(frameworkInfoSchema),
	primaryLanguage: z.string(),
	totalFiles: z.number().int().nonnegative(),
	totalLines: z.number().int().nonnegative().optional(),
});

export type ProjectMetadata = z.infer<typeof projectMetadataSchema>;

/**
 * Structure statistics schema
 */
export const structureStatisticsSchema = z.object({
	files: z.object({
		total: z.number().int().nonnegative(),
		byType: z.record(z.string(), z.number()),
		byParadigm: z.record(z.string(), z.number()),
	}),
	symbols: z.object({
		total: z.number().int().nonnegative(),
		byKind: z.record(z.string(), z.number()),
		exported: z.number().int().nonnegative(),
		public: z.number().int().nonnegative(),
	}),
	modules: z.object({
		total: z.number().int().nonnegative(),
		averageSize: z.number().nonnegative(),
		largest: z.string(),
	}),
});

export type StructureStatistics = z.infer<typeof structureStatisticsSchema>;

/**
 * Dependency overview schema
 */
export const dependencyOverviewSchema = z.object({
	internal: z.object({
		totalConnections: z.number().int().nonnegative(),
		averagePerFile: z.number().nonnegative(),
		mostConnectedFiles: z.array(
			z.object({
				path: z.string(),
				incomingCount: z.number().int().nonnegative(),
				outgoingCount: z.number().int().nonnegative(),
			}),
		),
	}),
	external: z.object({
		totalPackages: z.number().int().nonnegative(),
		directDependencies: z.number().int().nonnegative(),
		topPackages: z.array(
			z.object({
				name: z.string(),
				usageCount: z.number().int().nonnegative(),
			}),
		),
	}),
});

export type DependencyOverview = z.infer<typeof dependencyOverviewSchema>;

/**
 * Code quality metrics (optional) schema
 */
export const qualityMetricsSchema = z.object({
	complexity: z.object({
		average: z.number().nonnegative(),
		high: z.number().int().nonnegative(), // count of high complexity items
	}),
	maintainability: z.object({
		score: z.number().min(0).max(100), // 0-100
		issues: z.array(z.string()),
	}),
	testCoverage: z
		.object({
			percentage: z.number().min(0).max(100),
			testedFiles: z.number().int().nonnegative(),
			totalFiles: z.number().int().nonnegative(),
		})
		.optional(),
});

export type QualityMetrics = z.infer<typeof qualityMetricsSchema>;

/**
 * Module node in graph schema
 */
export const moduleGraphNodeSchema = z.object({
	id: z.string(),
	name: z.string(),
	fileCount: z.number().int().nonnegative(),
	type: z.string(),
});

export type ModuleGraphNode = z.infer<typeof moduleGraphNodeSchema>;

/**
 * Module edge in graph schema
 */
export const moduleGraphEdgeSchema = z.object({
	from: z.string(),
	to: z.string(),
	weight: z.number().int().nonnegative(), // dependency count
});

export type ModuleGraphEdge = z.infer<typeof moduleGraphEdgeSchema>;

/**
 * Module graph structure schema
 */
export const moduleGraphSchema = z.object({
	nodes: z.array(moduleGraphNodeSchema),
	edges: z.array(moduleGraphEdgeSchema),
});

export type ModuleGraph = z.infer<typeof moduleGraphSchema>;

/**
 * Get architecture overview result schema
 */
export const getArchitectureOverviewResultSchema = z.object({
	/** Project metadata */
	metadata: projectMetadataSchema,

	/** Structure statistics */
	structure: structureStatisticsSchema,

	/** Dependency overview */
	dependencies: dependencyOverviewSchema,

	/** Quality metrics (if includeMetrics=true) */
	metrics: qualityMetricsSchema.optional(),

	/** Module graph (if includeModuleGraph=true) */
	moduleGraph: moduleGraphSchema.optional(),
});

export type GetArchitectureOverviewResult = z.infer<
	typeof getArchitectureOverviewResultSchema
>;
