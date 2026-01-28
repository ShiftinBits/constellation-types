/**
 * Constellation MCP API Type Definitions
 *
 * This file exports ONLY the types relevant to MCP API consumers (AI assistants).
 * It excludes CLI-to-Core indexing types (SerializedAST, ImportResolution, etc.)
 * that are not used by the MCP query_code tool.
 *
 * This file is used to generate the MCP Resource served at constellation://types/api
 *
 * @packageDocumentation
 */

// ============================================================================
// Common Types - Shared across multiple API methods
// ============================================================================

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
} from './common.schema';

// ============================================================================
// API Response Wrapper
// ============================================================================

export {
	apiResponseSchema,
	apiErrorResponseSchema,
	isSuccessResponse,
	isErrorResponse,
	type ApiResponse,
} from './api-response.schema';

// ============================================================================
// MCP Executor Types - All 11 API methods
// ============================================================================

export * from './executors';

// NOTE: Indexing types (SerializedAST, ImportResolution, IndexingResponse, etc.)
// are intentionally NOT exported here. They are CLI-to-Core types that MCP
// consumers (AI assistants) do not need and should not see.
