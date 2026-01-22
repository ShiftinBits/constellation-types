/**
 * Impact Analysis Tool Schemas
 *
 * Zod schemas for analyzing the impact of changes to symbols across the codebase.
 */

import { z } from 'zod';
import { fileLocationSchema, riskLevelSchema } from '../common.schema';

/**
 * Input parameters schema for impact analysis
 */
export const impactAnalysisParamsSchema = z.object({
	/** Symbol ID to analyze impact for */
	symbolId: z.string().optional(),

	/** Qualified name to analyze impact for (alternative to symbolId) */
	qualifiedName: z.string().optional(),

	/** Symbol name (requires filePath if symbolId/qualifiedName not provided) */
	symbolName: z.string().optional(),

	/** File path where symbol is defined */
	filePath: z.string().optional(),

	/** Include direct dependents (symbols that directly use this symbol) @default true */
	includeDirectDependents: z.boolean().default(true),

	/** Include transitive dependents (symbols that transitively depend on this symbol) @default true */
	includeTransitiveDependents: z.boolean().default(true),

	/** Maximum depth for transitive analysis (1-5) @default 3 */
	depth: z.number().int().min(1).max(5).default(3),

	/** Exclude test files from impact analysis @default true */
	excludeTests: z.boolean().default(true),

	/** Exclude generated files from impact analysis @default true */
	excludeGenerated: z.boolean().default(true),

	/** Analyze breaking change potential @default true */
	analyzeBreakingChanges: z.boolean().default(true),
});

export type ImpactAnalysisParams = z.infer<typeof impactAnalysisParamsSchema>;

/**
 * A symbol that depends on the analyzed symbol schema
 */
export const impactedSymbolSchema = fileLocationSchema.extend({
	/** Symbol ID */
	id: z.string(),

	/** Symbol name */
	name: z.string(),

	/** Fully qualified name */
	qualifiedName: z.string(),

	/** Symbol kind (function, class, variable, etc.) */
	kind: z.string(),

	/** Type of relationship (CALLS, REFERENCES, DEPENDS_ON, etc.) */
	relationshipType: z.string(),

	/** Depth in the dependency chain (1 = direct, 2+ = transitive) */
	depth: z.number().int().positive(),

	/** Whether this symbol is exported (potential breaking change risk) */
	isExported: z.boolean().optional(),

	/** Number of symbols that depend on this impacted symbol */
	transitiveImpactCount: z.number().int().nonnegative().optional(),
});

export type ImpactedSymbol = z.infer<typeof impactedSymbolSchema>;

/**
 * Information about a file impacted by the change schema
 */
export const impactedFileSchema = z.object({
	/** File path */
	filePath: z.string(),

	/** Number of symbols in this file that are impacted */
	symbolCount: z.number().int().positive(),

	/** Whether this is a test file */
	isTest: z.boolean().optional(),

	/** Whether this is a generated file */
	isGenerated: z.boolean().optional(),

	/** List of impacted symbols in this file */
	symbols: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			kind: z.string(),
			line: z.number().int().positive(),
		}),
	),
});

export type ImpactedFile = z.infer<typeof impactedFileSchema>;

/**
 * Breaking change risk assessment schema
 */
export const breakingChangeRiskSchema = z.object({
	/** Overall risk level (low, medium, high, critical) */
	riskLevel: riskLevelSchema,

	/** Risk factors contributing to the assessment */
	factors: z.array(
		z.object({
			/** Factor name */
			factor: z.string(),

			/** Severity of this factor (low, medium, high) */
			severity: z.enum(['low', 'medium', 'high']),

			/** Description of why this is a risk factor */
			description: z.string(),
		}),
	),

	/** Recommendations for mitigating breaking changes */
	recommendations: z.array(z.string()),
});

export type BreakingChangeRisk = z.infer<typeof breakingChangeRiskSchema>;

/**
 * Result of impact analysis schema
 */
export const impactAnalysisResultSchema = z.object({
	/** The symbol being analyzed */
	symbol: z.object({
		id: z.string(),
		name: z.string(),
		qualifiedName: z.string(),
		kind: z.string(),
		filePath: z.string(),
		line: z.number().int().positive(),
		column: z.number().int().nonnegative(),
		isExported: z.boolean().optional(),
	}),

	/** Direct dependents (depth 1) */
	directDependents: z.array(impactedSymbolSchema).optional(),

	/** Transitive dependents (depth 2+) */
	transitiveDependents: z.array(impactedSymbolSchema).optional(),

	/** Files impacted by changes to this symbol */
	impactedFiles: z.array(impactedFileSchema),

	/** Breaking change risk assessment */
	breakingChangeRisk: breakingChangeRiskSchema.optional(),

	/** Summary statistics */
	summary: z.object({
		/** Total number of directly dependent symbols */
		directDependentCount: z.number().int().nonnegative(),

		/** Total number of transitively dependent symbols */
		transitiveDependentCount: z.number().int().nonnegative(),

		/** Total number of impacted files */
		impactedFileCount: z.number().int().nonnegative(),

		/** Number of impacted test files */
		testFileCount: z.number().int().nonnegative(),

		/** Number of impacted production files (non-test, non-generated) */
		productionFileCount: z.number().int().nonnegative(),

		/** Maximum depth of dependency chain analyzed */
		maxDepth: z.number().int().nonnegative(),
	}),
});

export type ImpactAnalysisResult = z.infer<typeof impactAnalysisResultSchema>;
