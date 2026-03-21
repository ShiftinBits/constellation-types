/**
 * Get Dependents Tool Schemas
 *
 * Zod schemas for the get_dependents MCP tool.
 * Understands what depends on a file (impact analysis).
 */

import { z } from 'zod';
import { riskLevelSchema } from '../common.schema';

/**
 * Input parameters schema for get dependents
 */
export const getDependentsParamsSchema = z.object({
	/** File path to analyze */
	filePath: z.string().min(1),

	/** Dependency depth for transitive dependents (max: 10) */
	depth: z.number().int().nonnegative().max(10).optional(),

	/** Show which symbols are used by each dependent */
	includeSymbols: z.boolean().optional(),

	/** Include impact metrics and risk assessment */
	includeImpactMetrics: z.boolean().optional(),

	/** Maximum number of dependents to return per page (default: 20, max: 100) */
	limit: z.number().int().positive().max(100).default(20),

	/** Offset for pagination (default: 0) */
	offset: z.number().int().nonnegative().default(0),
});

export type GetDependentsParams = z.infer<typeof getDependentsParamsSchema>;

/**
 * Direct dependent (file that directly imports this one) schema
 */
export const directDependentSchema = z.object({
	/** Dependent file path */
	filePath: z.string(),

	/** Symbols used from the source file */
	usedSymbols: z.array(z.string()).optional(),
});

export type DirectDependent = z.infer<typeof directDependentSchema>;

/**
 * Transitive dependent (indirect impact) schema
 */
export const transitiveDependentSchema = z.object({
	/** File path */
	filePath: z.string(),

	/** Number of hops from source file */
	distance: z.number().int().positive(),

	/** Impact chain showing how it's reached */
	path: z.array(z.string()),
});

export type TransitiveDependent = z.infer<typeof transitiveDependentSchema>;

/**
 * Dependent metrics schema
 */
export const dependentMetricsSchema = z.object({
	/** Total number of dependent files */
	totalFiles: z.number().int().nonnegative(),

	/** Maximum dependent depth */
	maxDepth: z.number().int().nonnegative(),

	/** Risk level based on dependent count */
	riskLevel: riskLevelSchema,
});

export type DependentMetrics = z.infer<typeof dependentMetricsSchema>;

/**
 * Get dependents result schema
 */
export const getDependentsResultSchema = z.object({
	/** Source file being analyzed */
	file: z.string(),

	/** Direct (immediate) dependents */
	directDependents: z.array(directDependentSchema),

	/** Transitive (indirect) dependents */
	transitiveDependents: z.array(transitiveDependentSchema).optional(),

	/** Detailed metrics (if includeImpactMetrics=true) */
	detailedMetrics: z
		.object({
			byDepth: z.record(z.string(), z.number()),
			criticalPaths: z.array(z.array(z.string())),
			mostImpactedFiles: z.array(z.string()),
		})
		.optional(),
});

export type GetDependentsResult = z.infer<typeof getDependentsResultSchema>;
