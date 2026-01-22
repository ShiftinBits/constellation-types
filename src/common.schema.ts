/**
 * Common MCP Tool Schemas
 *
 * Standardized Zod schemas and types used across all MCP tools.
 * These provide consistency, language-agnosticism, and maximum value for AI code intelligence.
 *
 * Design Principles:
 * 1. Summary-First Design: Every result starts with a parseable summary
 * 2. Language Agnostic: Work with TypeScript, Python, Java, Go, Rust, C++, etc.
 * 3. Confidence & Quality: Include data quality indicators where applicable
 * 4. Opt-In Enrichment: Use include* parameters for expensive optional data
 * 5. Bidirectional Relationships: Clear X/XBy naming for relationship direction
 */

import { z } from 'zod';

// =============================================================================
// Pagination
// =============================================================================

/**
 * Standardized pagination information
 * Used by all tools that return lists of items
 */
export const paginationMetadataSchema = z.object({
	/** Total number of matching items (before pagination) */
	total: z.number().int().nonnegative(),

	/** Number of items returned in this response */
	returned: z.number().int().nonnegative(),

	/** Whether more results are available */
	hasMore: z.boolean(),

	/** Offset for the next page (if hasMore is true) */
	nextOffset: z.number().int().nonnegative().optional(),

	/** Current offset (for context) */
	currentOffset: z.number().int().nonnegative().optional(),
});

export type PaginationMetadata = z.infer<typeof paginationMetadataSchema>;

// =============================================================================
// Confidence & Quality
// =============================================================================

/**
 * Confidence scoring for heuristic/inferred analysis
 * Used by tools that perform pattern matching, detection, or inference
 */
export const confidenceScoreSchema = z.object({
	/** Overall confidence level (0-1 scale) */
	overall: z.number().min(0).max(1),

	/** Detailed confidence factors */
	factors: z
		.object({
			/** How recent/fresh is the analyzed data (0-1) */
			dataFreshness: z.number().min(0).max(1).optional(),

			/** How complete is the analysis coverage (0-1) */
			coverageComplete: z.number().min(0).max(1).optional(),

			/** Accuracy of heuristic pattern matching (0-1) */
			heuristicAccuracy: z.number().min(0).max(1).optional(),

			/** Semantic analysis depth (0-1) */
			semanticAnalysisDepth: z.number().min(0).max(1).optional(),

			/** Pattern match quality (0-1) */
			patternMatchQuality: z.number().min(0).max(1).optional(),
		})
		.optional(),

	/** Known limitations or warnings about the analysis */
	warnings: z.array(z.string()).optional(),

	/** Recommendations for improving confidence */
	recommendations: z.array(z.string()).optional(),
});

export type ConfidenceScore = z.infer<typeof confidenceScoreSchema>;

/**
 * Data quality indicators
 * Provides transparency about analysis quality and limitations
 */
export const dataQualityMetadataSchema = z.object({
	/** Overall data quality score (0-100) */
	qualityScore: z.number().min(0).max(100).optional(),

	/** When was this data last updated/analyzed */
	lastUpdated: z.string().optional(),

	/** Whether this data is from cache or fresh analysis */
	cached: z.boolean().optional(),

	/** How long the analysis took (milliseconds) */
	executionTime: z.number().nonnegative().optional(),

	/** Percentage of codebase analyzed (0-100) */
	coveragePercentage: z.number().min(0).max(100).optional(),

	/** Any data quality issues or limitations */
	issues: z.array(z.string()).optional(),
});

export type DataQualityMetadata = z.infer<typeof dataQualityMetadataSchema>;

// =============================================================================
// Language Metadata
// =============================================================================

/**
 * Language-specific metadata container
 * Allows tools to be language-agnostic while still supporting language-specific features
 */
export const languageMetadataSchema = z.object({
	/** Programming language identifier */
	language: z.string(), // 'typescript', 'python', 'java', 'go', 'rust', etc.

	/** Language-specific features/modifiers */
	features: z.array(z.string()).optional(), // ['async', 'static', 'abstract', 'const', 'readonly']

	/** Language-specific visibility rules */
	visibility: z.string().optional(), // Interpreted per language

	/** Decorators, annotations, attributes */
	decorators: z.array(z.string()).optional(),

	/** Language-specific type information (stored as JSON) */
	typeInfo: z.any().optional(),

	/** Additional language-specific metadata */
	custom: z.record(z.string(), z.any()).optional(),
});

export type LanguageMetadata = z.infer<typeof languageMetadataSchema>;

// =============================================================================
// Symbol Kinds
// =============================================================================

/**
 * Language-agnostic symbol kind categories
 * Use strings instead of enums for maximum extensibility
 */
export const symbolKindCategorySchema = z.enum([
	'function',
	'class',
	'interface',
	'type',
	'variable',
	'constant',
	'enum',
	'module',
	'namespace',
	'method',
	'property',
	'parameter',
	'constructor',
	'decorator',
	'trait',
	'struct',
	'macro',
	'unknown',
]);

export type SymbolKindCategory = z.infer<typeof symbolKindCategorySchema>;

// =============================================================================
// Risk Levels
// =============================================================================

/**
 * Risk level enum used across multiple tools
 */
export const riskLevelSchema = z.enum(['low', 'medium', 'high', 'critical']);

export type RiskLevel = z.infer<typeof riskLevelSchema>;

// =============================================================================
// File Location
// =============================================================================

/**
 * File location reference (language-agnostic)
 */
export const fileLocationSchema = z.object({
	/** File path (relative to project root) */
	filePath: z.string(),

	/** Optional line number */
	line: z.number().int().positive().optional(),

	/** Optional line range start */
	lineStart: z.number().int().positive().optional(),

	/** Optional line range end */
	lineEnd: z.number().int().positive().optional(),

	/** Optional column number */
	column: z.number().int().nonnegative().optional(),
});

export type FileLocation = z.infer<typeof fileLocationSchema>;

/**
 * Symbol reference (language-agnostic)
 */
export const symbolReferenceSchema = fileLocationSchema.extend({
	/** Symbol identifier */
	symbolId: z.string().optional(),

	/** Symbol name */
	symbolName: z.string().optional(),

	/** Symbol kind category */
	symbolKind: z.string().optional(),
});

export type SymbolReference = z.infer<typeof symbolReferenceSchema>;

// =============================================================================
// Relationships
// =============================================================================

/**
 * Standardized relationship direction pattern
 * All relationships use X (outgoing) and XBy (incoming) naming
 */
export const relationshipDirectionsSchema = <T extends z.ZodTypeAny>(
	itemSchema: T,
) =>
	z.object({
		/** Outgoing relationship: this item relates TO these items */
		outgoing: z.array(itemSchema),

		/** Incoming relationship: these items relate TO this item */
		incoming: z.array(itemSchema),
	});

// Simple string version for common use
export const stringRelationshipDirectionsSchema = z.object({
	outgoing: z.array(z.string()),
	incoming: z.array(z.string()),
});

export type RelationshipDirections<T = string> = {
	outgoing: T[];
	incoming: T[];
};

// =============================================================================
// Graph Structures
// =============================================================================

/**
 * Standard graph node
 */
export const standardGraphNodeSchema = z.object({
	/** Unique node identifier */
	id: z.string(),

	/** Display name */
	name: z.string(),

	/** Node type/category */
	type: z.string(),

	/** Additional properties */
	properties: z.record(z.string(), z.any()).optional(),
});

export type StandardGraphNode = z.infer<typeof standardGraphNodeSchema>;

/**
 * Standard graph edge
 */
export const standardGraphEdgeSchema = z.object({
	/** Source node ID */
	from: z.string(),

	/** Target node ID */
	to: z.string(),

	/** Edge type/label */
	type: z.string().optional(),

	/** Edge weight (for weighted graphs) */
	weight: z.number().optional(),

	/** Additional properties */
	properties: z.record(z.string(), z.any()).optional(),
});

export type StandardGraphEdge = z.infer<typeof standardGraphEdgeSchema>;

/**
 * Graph representation structure
 * Used by tools that provide graph visualizations
 */
export const graphRepresentationSchema = z.object({
	/** Graph nodes */
	nodes: z.array(standardGraphNodeSchema),

	/** Graph edges */
	edges: z.array(standardGraphEdgeSchema),

	/** Optional metadata about the graph */
	metadata: z
		.object({
			/** Number of nodes */
			nodeCount: z.number().int().nonnegative(),

			/** Number of edges */
			edgeCount: z.number().int().nonnegative(),

			/** Whether this is a directed graph */
			directed: z.boolean(),

			/** Whether this graph contains cycles */
			hasCycles: z.boolean().optional(),
		})
		.optional(),
});

export type GraphRepresentation = z.infer<typeof graphRepresentationSchema>;

// =============================================================================
// Test Pattern Constants (not Zod schemas, just exported values)
// =============================================================================

/**
 * Multi-language test file detection patterns
 * Extensible pattern matching for identifying test files across languages
 */
export const TEST_PATTERNS: Record<string, RegExp> = {
	javascript: /\.(spec|test)\.(js|jsx|mjs|cjs)$/,
	typescript: /\.(spec|test)\.(ts|tsx)$/,
	python: /_(test|spec)\.py$|^test_.*\.py$/,
	java: /Test\.java$|Tests\.java$/,
	kotlin: /Test\.kt$|Tests\.kt$/,
	go: /_test\.go$/,
	rust: /(tests?\.rs|.*_test\.rs)$/,
	ruby: /_spec\.rb$|_test\.rb$/,
	php: /Test\.php$/,
	csharp: /Test\.cs$|Tests\.cs$/,
	swift: /Test\.swift$|Tests\.swift$/,
	scala: /Test\.scala$|Spec\.scala$/,
	elixir: /_test\.exs$/,
};

/**
 * Multi-language entry point detection patterns
 * Common entry point file names across different languages
 */
export const ENTRY_POINT_PATTERNS: Record<string, RegExp[]> = {
	javascript: [/\/main\.js$/, /\/index\.js$/, /\/server\.js$/, /\/app\.js$/],
	typescript: [/\/main\.ts$/, /\/index\.ts$/, /\/server\.ts$/, /\/app\.ts$/],
	python: [
		/__main__\.py$/,
		/\/main\.py$/,
		/\/app\.py$/,
		/\/manage\.py$/,
		/\/run\.py$/,
	],
	java: [/Main\.java$/, /Application\.java$/],
	go: [/\/main\.go$/],
	rust: [/\/main\.rs$/],
	ruby: [/\/main\.rb$/, /\/application\.rb$/],
	php: [/\/index\.php$/, /\/app\.php$/],
	csharp: [/Program\.cs$/, /Main\.cs$/],
};
