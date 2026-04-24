/**
 * Constellation MCP API Type Definitions
 *
 * This file exports ONLY the types relevant to MCP API consumers (AI assistants).
 * It excludes CLI-to-Core indexing types (SerializedAST, ImportResolution, etc.)
 * that are not used by the MCP code_intel tool.
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

// NOTE: The following CLI-to-Core module categories are intentionally NOT
// exported from this MCP-facing entry point. They define data contracts
// between the CLI, the Core server, and operator-facing tools — MCP
// consumers (AI assistants) have no need for these shapes:
//   - indexing      SerializedAST, ImportResolution, IndexingResponse, ...
//   - index-status  IndexStatusResponse, PhaseMetrics, throughputPerSec, ...
//   - enrichment    enrichment lifecycle + upload shapes
//   - mcp-app       project listing + graph-visualization schemas
//   - error-reports CLI error telemetry
// Additions to those modules should extend `src/index.ts`, not this file.
