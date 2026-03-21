/**
 * Executor Schemas Barrel Export
 *
 * Re-exports all executor schemas for convenient importing.
 */

// Search Symbols
export {
	searchSymbolsParamsSchema,
	symbolInfoSchema,
	searchSymbolsResultSchema,
	type SearchSymbolsParams,
	type SymbolInfo,
	type SearchSymbolsResult,
} from './search-symbols.schema';

// Get Symbol Details
export {
	getSymbolDetailsParamsSchema,
	symbolDetailsSchema,
	symbolUsageReferenceSchema,
	symbolRelationshipsSchema,
	impactScoreSchema,
	symbolDetailsResultSchema,
	type GetSymbolDetailsParams,
	type SymbolDetails,
	type SymbolUsageReference,
	type SymbolRelationships,
	type ImpactScore,
	type SymbolDetailsResult,
} from './get-symbol-details.schema';

// Get Dependencies
export {
	getDependenciesParamsSchema,
	directDependencySchema,
	transitiveDependencySchema,
	packageDependencySchema,
	dependencyMetricsSchema,
	getDependenciesResultSchema,
	type GetDependenciesParams,
	type DirectDependency,
	type TransitiveDependency,
	type PackageDependency,
	type DependencyMetrics,
	type GetDependenciesResult,
} from './get-dependencies.schema';

// Get Dependents
export {
	getDependentsParamsSchema,
	directDependentSchema,
	transitiveDependentSchema,
	dependentMetricsSchema,
	getDependentsResultSchema,
	type GetDependentsParams,
	type DirectDependent,
	type TransitiveDependent,
	type DependentMetrics,
	type GetDependentsResult,
} from './get-dependents.schema';

// Find Circular Dependencies
export {
	findCircularDependenciesParamsSchema,
	circularDependencyCycleSchema,
	findCircularDependenciesResultSchema,
	type FindCircularDependenciesParams,
	type CircularDependencyCycle,
	type FindCircularDependenciesResult,
} from './find-circular-dependencies.schema';

// Trace Symbol Usage
export {
	traceSymbolUsageParamsSchema,
	tracedSymbolSchema,
	directUsageSchema,
	transitiveUsageSchema,
	traceSymbolUsageResultSchema,
	type TraceSymbolUsageParams,
	type TracedSymbol,
	type DirectUsage,
	type TransitiveUsage,
	type TraceSymbolUsageResult,
} from './trace-symbol-usage.schema';

// Get Call Graph
export {
	getCallGraphParamsSchema,
	callGraphRootSchema,
	callerNodeSchema,
	calleeNodeSchema,
	getCallGraphResultSchema,
	type GetCallGraphParams,
	type CallGraphRoot,
	type CallerNode,
	type CalleeNode,
	type GetCallGraphResult,
} from './get-call-graph.schema';

// Impact Analysis
export {
	impactAnalysisParamsSchema,
	impactedSymbolSchema,
	impactedFileSchema,
	breakingChangeRiskSchema,
	impactAnalysisResultSchema,
	type ImpactAnalysisParams,
	type ImpactedSymbol,
	type ImpactedFile,
	type BreakingChangeRisk,
	type ImpactAnalysisResult,
} from './impact-analysis.schema';

// Find Orphaned Code
export {
	findOrphanedCodeParamsSchema,
	orphanedSymbolSchema,
	orphanedFileSchema,
	findOrphanedCodeResultSchema,
	type FindOrphanedCodeParams,
	type OrphanedSymbol,
	type OrphanedFile,
	type FindOrphanedCodeResult,
} from './find-orphaned-code.schema';

// Get Architecture Overview
export {
	getArchitectureOverviewParamsSchema,
	languageInfoSchema,
	frameworkInfoSchema,
	projectMetadataSchema,
	structureStatisticsSchema,
	dependencyOverviewSchema,
	qualityMetricsSchema,
	moduleGraphNodeSchema,
	moduleGraphEdgeSchema,
	moduleGraphSchema,
	getArchitectureOverviewResultSchema,
	type GetArchitectureOverviewParams,
	type LanguageInfo,
	type FrameworkInfo,
	type ProjectMetadata,
	type StructureStatistics,
	type DependencyOverview,
	type QualityMetrics,
	type ModuleGraphNode,
	type ModuleGraphEdge,
	type ModuleGraph,
	type GetArchitectureOverviewResult,
} from './get-architecture-overview.schema';

// Ping
export {
	pingParamsSchema,
	pingResultSchema,
	type PingParams,
	type PingResult,
} from './ping.schema';
