/**
 * Find Circular Dependencies Tool Schemas
 *
 * Zod schemas for the find_circular_dependencies MCP tool.
 * Detects circular dependency cycles in the codebase.
 */

import { z } from 'zod';
import { riskLevelSchema } from '../common.schema';

/**
 * Input parameters schema for finding circular dependencies
 */
export const findCircularDependenciesParamsSchema = z.object({
	/** Check if a specific file is involved in any cycles */
	filePath: z.string().min(1).optional(),

	/** Filter cycles by minimum length (min: 2, max: 10) */
	minCycleLength: z.number().int().min(2).max(10).optional(),

	/** Filter cycles by maximum length (min: 2, max: 10) */
	maxCycleLength: z.number().int().min(2).max(10).optional(),

	/** Maximum number of cycles to return */
	limit: z.number().int().positive().max(100).default(50),

	/** Pagination offset */
	offset: z.number().int().nonnegative().default(0),

	/** Include impact scoring for each cycle */
	includeImpactScore: z.boolean().optional(),

	/** Include confidence assessment */
	includeConfidence: z.boolean().optional(),
});

export type FindCircularDependenciesParams = z.infer<
	typeof findCircularDependenciesParamsSchema
>;

/**
 * Circular dependency cycle schema
 */
export const circularDependencyCycleSchema = z.object({
	/** Files involved in the cycle */
	files: z.array(z.string()),

	/** Number of files in the cycle */
	length: z.number().int().positive(),

	/** Impact score based on file importance (if includeImpactScore=true) */
	impactScore: z.number().min(0).max(100).optional(),

	/** Severity level */
	severity: riskLevelSchema,
});

export type CircularDependencyCycle = z.infer<
	typeof circularDependencyCycleSchema
>;

/**
 * Find circular dependencies result schema
 */
export const findCircularDependenciesResultSchema = z.object({
	/** Detected circular dependency cycles */
	cycles: z.array(circularDependencyCycleSchema),
});

export type FindCircularDependenciesResult = z.infer<
	typeof findCircularDependenciesResultSchema
>;
