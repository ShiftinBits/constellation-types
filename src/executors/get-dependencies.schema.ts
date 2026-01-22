/**
 * Get Dependencies Tool Schemas
 *
 * Zod schemas for the get_dependencies MCP tool.
 * Understands what a file depends on (direct and transitive dependencies).
 */

import { z } from 'zod';

/**
 * Input parameters schema for get dependencies
 */
export const getDependenciesParamsSchema = z.object({
	/** File path to analyze */
	filePath: z.string().min(1),

	/** Dependency depth: 1=direct, 2+=transitive, 0=all (max: 10) */
	depth: z.number().int().nonnegative().max(10).optional(),

	/** Include external package dependencies */
	includePackages: z.boolean().optional(),

	/** Show which symbols are imported from each dependency */
	includeSymbols: z.boolean().optional(),

	/** Maximum number of dependencies to return per page (default: 20, max: 100) */
	limit: z.number().int().positive().max(100).default(20),

	/** Offset for pagination (default: 0) */
	offset: z.number().int().nonnegative().default(0),
});

export type GetDependenciesParams = z.infer<typeof getDependenciesParamsSchema>;

/**
 * Direct dependency (file or module) schema
 */
export const directDependencySchema = z.object({
	/** Dependency type: 'file' for internal files, 'module' for external packages */
	type: z.enum(['file', 'module']),

	/** File path (null for external modules) */
	filePath: z.string().nullable(),

	/** Module name for external packages (null for internal files) */
	moduleName: z.string().nullable().optional(),

	/** Symbols imported from this dependency */
	importedSymbols: z.array(z.string()).optional(),

	/** Whether this is a default import */
	isDefault: z.boolean(),

	/** Whether this is a namespace import (import * as X) */
	isNamespace: z.boolean(),
});

export type DirectDependency = z.infer<typeof directDependencySchema>;

/**
 * Transitive dependency schema
 */
export const transitiveDependencySchema = z.object({
	/** File path */
	filePath: z.string(),

	/** Number of hops from source file */
	distance: z.number().int().positive(),

	/** Dependency chain showing how it's reached */
	path: z.array(z.string()),
});

export type TransitiveDependency = z.infer<typeof transitiveDependencySchema>;

/**
 * Package dependency schema
 */
export const packageDependencySchema = z.object({
	/** Package name */
	name: z.string(),

	/** Package version if available */
	version: z.string().optional(),

	/** Dependency type */
	type: z.string(), // production, development, peer, optional
});

export type PackageDependency = z.infer<typeof packageDependencySchema>;

/**
 * Dependency metrics schema
 */
export const dependencyMetricsSchema = z.object({
	/** Total number of file dependencies */
	totalFiles: z.number().int().nonnegative(),

	/** Total number of package dependencies */
	totalPackages: z.number().int().nonnegative(),

	/** Maximum dependency depth */
	maxDepth: z.number().int().nonnegative(),
});

export type DependencyMetrics = z.infer<typeof dependencyMetricsSchema>;

/**
 * Get dependencies result schema
 */
export const getDependenciesResultSchema = z.object({
	/** Source file being analyzed */
	file: z.string(),

	/** Direct (immediate) dependencies */
	directDependencies: z.array(directDependencySchema),

	/** Transitive (indirect) dependencies */
	transitiveDependencies: z.array(transitiveDependencySchema).optional(),

	/** External package dependencies */
	packages: z.array(packageDependencySchema).optional(),
});

export type GetDependenciesResult = z.infer<typeof getDependenciesResultSchema>;
