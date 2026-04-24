/**
 * @constellation/types
 *
 * Shared Zod schemas and TypeScript types for Constellation MCP tools.
 * Single source of truth for all MCP executor DTOs.
 */

// Common schemas
export {
	// Pagination
	paginationMetadataSchema,
	type PaginationMetadata,

	// Confidence & Quality
	confidenceScoreSchema,
	dataQualityMetadataSchema,
	type ConfidenceScore,
	type DataQualityMetadata,

	// Language Metadata
	languageMetadataSchema,
	type LanguageMetadata,

	// Symbol Kinds
	symbolKindCategorySchema,
	type SymbolKindCategory,

	// Risk Levels
	riskLevelSchema,
	type RiskLevel,

	// Complexity Metrics
	complexityRiskSchema,
	complexityMetricsSchema,
	type ComplexityRisk,
	type ComplexityMetrics,

	// File Location
	fileLocationSchema,
	symbolReferenceSchema,
	type FileLocation,
	type SymbolReference,

	// Relationships
	relationshipDirectionsSchema,
	stringRelationshipDirectionsSchema,
	type RelationshipDirections,

	// Graph Structures
	standardGraphNodeSchema,
	standardGraphEdgeSchema,
	graphRepresentationSchema,
	type StandardGraphNode,
	type StandardGraphEdge,
	type GraphRepresentation,

	// Constants
	TEST_PATTERNS,
	ENTRY_POINT_PATTERNS,
	PYTHON_STDLIB_MODULES,
} from './common.schema';

// API Response
export {
	apiResponseSchema,
	apiErrorResponseSchema,
	isSuccessResponse,
	isErrorResponse,
	type ApiResponse,
} from './api-response.schema';

// All executor schemas
export * from './executors';

// All indexing schemas (CLI <-> Core)
export * from './indexing';

// Index-status schemas (CLI <-> Core phase metrics + poll response)
export * from './index-status';

// Enrichment schemas (CLI <-> Core LSP enrichment data)
export * from './enrichment';

// MCP App types (graph visualization + project listing)
export * from './mcp-app';

// Error reporting schemas (CLI error reports)
export * from './error-reports';
