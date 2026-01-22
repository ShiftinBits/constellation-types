export { ApiResponse, BreakingChangeRisk, CallGraphRoot, CalleeNode, CallerNode, CircularDependencyCycle, ConfidenceScore, DataQualityMetadata, DependencyMetrics, DependencyOverview, DependentMetrics, DirectDependency, DirectDependent, DirectUsage, ENTRY_POINT_PATTERNS, FileLocation, FindCircularDependenciesParams, FindCircularDependenciesResult, FindOrphanedCodeParams, FindOrphanedCodeResult, FrameworkInfo, GetArchitectureOverviewParams, GetArchitectureOverviewResult, GetCallGraphParams, GetCallGraphResult, GetDependenciesParams, GetDependenciesResult, GetDependentsParams, GetDependentsResult, GetSymbolDetailsParams, GraphRepresentation, ImpactAnalysisParams, ImpactAnalysisResult, ImpactScore, ImpactedFile, ImpactedSymbol, LanguageInfo, LanguageMetadata, ModuleGraph, ModuleGraphEdge, ModuleGraphNode, OrphanedFile, OrphanedSymbol, PackageDependency, PaginationMetadata, PingParams, PingResult, ProjectMetadata, QualityMetrics, RelationshipDirections, RiskLevel, SearchSymbolsParams, SearchSymbolsResult, StandardGraphEdge, StandardGraphNode, StructureStatistics, SymbolDetails, SymbolDetailsResult, SymbolInfo, SymbolKindCategory, SymbolReference, SymbolRelationships, SymbolUsageReference, TEST_PATTERNS, TraceSymbolUsageParams, TraceSymbolUsageResult, TracedSymbol, TransitiveDependency, TransitiveDependent, TransitiveUsage, apiErrorResponseSchema, apiResponseSchema, breakingChangeRiskSchema, callGraphRootSchema, calleeNodeSchema, callerNodeSchema, circularDependencyCycleSchema, confidenceScoreSchema, dataQualityMetadataSchema, dependencyMetricsSchema, dependencyOverviewSchema, dependentMetricsSchema, directDependencySchema, directDependentSchema, directUsageSchema, fileLocationSchema, findCircularDependenciesParamsSchema, findCircularDependenciesResultSchema, findOrphanedCodeParamsSchema, findOrphanedCodeResultSchema, frameworkInfoSchema, getArchitectureOverviewParamsSchema, getArchitectureOverviewResultSchema, getCallGraphParamsSchema, getCallGraphResultSchema, getDependenciesParamsSchema, getDependenciesResultSchema, getDependentsParamsSchema, getDependentsResultSchema, getSymbolDetailsParamsSchema, graphRepresentationSchema, impactAnalysisParamsSchema, impactAnalysisResultSchema, impactScoreSchema, impactedFileSchema, impactedSymbolSchema, isErrorResponse, isSuccessResponse, languageInfoSchema, languageMetadataSchema, moduleGraphEdgeSchema, moduleGraphNodeSchema, moduleGraphSchema, orphanedFileSchema, orphanedSymbolSchema, packageDependencySchema, paginationMetadataSchema, pingParamsSchema, pingResultSchema, projectMetadataSchema, qualityMetricsSchema, relationshipDirectionsSchema, riskLevelSchema, searchSymbolsParamsSchema, searchSymbolsResultSchema, standardGraphEdgeSchema, standardGraphNodeSchema, stringRelationshipDirectionsSchema, structureStatisticsSchema, symbolDetailsResultSchema, symbolDetailsSchema, symbolInfoSchema, symbolKindCategorySchema, symbolReferenceSchema, symbolRelationshipsSchema, symbolUsageReferenceSchema, traceSymbolUsageParamsSchema, traceSymbolUsageResultSchema, tracedSymbolSchema, transitiveDependencySchema, transitiveDependentSchema, transitiveUsageSchema } from './mcp-api.mjs';
import { z } from 'zod';

/**
 * Import Resolution Schemas
 *
 * Zod schemas for import resolution metadata.
 * CLI provides this because only it has access to tsconfig/jsconfig path mappings.
 */

/**
 * Type of import for debugging/analytics
 */
declare const importTypeSchema: z.ZodEnum<["relative", "workspace", "alias", "external", "builtin"]>;
type ImportType = z.infer<typeof importTypeSchema>;
/**
 * Import resolution metadata for a single import statement.
 * CLI provides this because only it has access to tsconfig/jsconfig path mappings.
 */
declare const importResolutionSchema: z.ZodObject<{
    /** Original import specifier from source code */
    source: z.ZodString;
    /** Resolved project-relative path (e.g., './libs/database/src/index.ts') */
    /** Only present for internal project files */
    resolvedPath: z.ZodOptional<z.ZodString>;
    /** Whether this is an external package (npm, etc.) */
    isExternal: z.ZodBoolean;
    /** Type of import for debugging/analytics */
    importType: z.ZodEnum<["relative", "workspace", "alias", "external", "builtin"]>;
}, "strip", z.ZodTypeAny, {
    source: string;
    isExternal: boolean;
    importType: "external" | "relative" | "workspace" | "alias" | "builtin";
    resolvedPath?: string | undefined;
}, {
    source: string;
    isExternal: boolean;
    importType: "external" | "relative" | "workspace" | "alias" | "builtin";
    resolvedPath?: string | undefined;
}>;
type ImportResolution = z.infer<typeof importResolutionSchema>;
/**
 * Map of line numbers to import resolutions.
 * CLI has access to tsconfig/jsconfig and can properly resolve path aliases.
 */
declare const importResolutionMetadataSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    /** Original import specifier from source code */
    source: z.ZodString;
    /** Resolved project-relative path (e.g., './libs/database/src/index.ts') */
    /** Only present for internal project files */
    resolvedPath: z.ZodOptional<z.ZodString>;
    /** Whether this is an external package (npm, etc.) */
    isExternal: z.ZodBoolean;
    /** Type of import for debugging/analytics */
    importType: z.ZodEnum<["relative", "workspace", "alias", "external", "builtin"]>;
}, "strip", z.ZodTypeAny, {
    source: string;
    isExternal: boolean;
    importType: "external" | "relative" | "workspace" | "alias" | "builtin";
    resolvedPath?: string | undefined;
}, {
    source: string;
    isExternal: boolean;
    importType: "external" | "relative" | "workspace" | "alias" | "builtin";
    resolvedPath?: string | undefined;
}>>;
type ImportResolutionMetadata = z.infer<typeof importResolutionMetadataSchema>;

/**
 * Serialized AST Schema
 *
 * Zod schema for the AST payload sent from CLI to Core.
 * Contains compressed AST data without source code to maintain privacy.
 */

/**
 * Represents a serialized Abstract Syntax Tree ready for transmission to the API.
 * Contains compressed AST data without source code to maintain privacy.
 */
declare const serializedAstSchema: z.ZodObject<{
    /** Relative path to the source file from project root */
    file: z.ZodString;
    /** Programming language identifier (e.g., 'typescript', 'javascript') */
    language: z.ZodString;
    /** Git commit hash when this AST was generated */
    commit: z.ZodString;
    /** ISO timestamp when the AST was created */
    timestamp: z.ZodString;
    /** Base64-encoded, gzip-compressed AST structure (no source code) */
    ast: z.ZodString;
    /** CLI-resolved import paths (only CLI has tsconfig/jsconfig access) */
    importResolutions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        source: z.ZodString;
        resolvedPath: z.ZodOptional<z.ZodString>;
        isExternal: z.ZodBoolean;
        importType: z.ZodEnum<["relative", "workspace", "alias", "external", "builtin"]>;
    }, "strip", z.ZodTypeAny, {
        source: string;
        isExternal: boolean;
        importType: "external" | "relative" | "workspace" | "alias" | "builtin";
        resolvedPath?: string | undefined;
    }, {
        source: string;
        isExternal: boolean;
        importType: "external" | "relative" | "workspace" | "alias" | "builtin";
        resolvedPath?: string | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    language: string;
    file: string;
    commit: string;
    timestamp: string;
    ast: string;
    importResolutions?: Record<string, {
        source: string;
        isExternal: boolean;
        importType: "external" | "relative" | "workspace" | "alias" | "builtin";
        resolvedPath?: string | undefined;
    }> | undefined;
}, {
    language: string;
    file: string;
    commit: string;
    timestamp: string;
    ast: string;
    importResolutions?: Record<string, {
        source: string;
        isExternal: boolean;
        importType: "external" | "relative" | "workspace" | "alias" | "builtin";
        resolvedPath?: string | undefined;
    }> | undefined;
}>;
type SerializedAST = z.infer<typeof serializedAstSchema>;

/**
 * Indexing Response Schemas
 *
 * Zod schemas for AST indexing operation responses.
 *
 * ## Three-Pass Indexing Architecture
 *
 * The AST indexing pipeline operates in three sequential passes:
 *
 * **Pass 1 (Synchronous)**: Node Creation
 * - Creates File and Symbol nodes in Neo4j
 * - Establishes CONTAINS relationships (File -> Symbol)
 * - Failures tracked in `failedFiles` array
 *
 * **Pass 2 (Synchronous)**: Relationship Creation
 * - Creates inter-symbol relationships (IMPORTS, CALLS, INHERITS, IMPLEMENTS, etc.)
 * - Uses UnresolvedSymbol/UnresolvedCall nodes for forward references
 * - Failures tracked in `relationships.filesWithFailures`
 *
 * **Pass 3 (Synchronous)**: Cross-File Symbol Resolution
 * - Resolves UnresolvedSymbol/UnresolvedCall nodes to actual targets
 * - Creates cross-file CALLS, REFERENCES, and USES_SYMBOL relationships
 * - Failures are logged but don't fail the overall operation
 *
 * All three passes complete before the API response is sent.
 */

/**
 * Represents a file that failed to index during processing.
 */
declare const fileFailureSchema: z.ZodObject<{
    /** Relative file path */
    file: z.ZodString;
    /** Error message describing the failure */
    error: z.ZodString;
}, "strip", z.ZodTypeAny, {
    error: string;
    file: string;
}, {
    error: string;
    file: string;
}>;
type FileFailure = z.infer<typeof fileFailureSchema>;
/**
 * Represents a file with relationship creation failures.
 * Tracks which files had issues creating graph relationships.
 */
declare const relationshipFailureSchema: z.ZodObject<{
    /** Relative file path */
    file: z.ZodString;
    /** Number of relationships that failed to create */
    failedCount: z.ZodNumber;
    /** Number of relationships that were successfully created */
    createdCount: z.ZodNumber;
    /** Whether failures were due to transient errors (retryable) */
    isTransient: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    file: string;
    failedCount: number;
    createdCount: number;
    isTransient: boolean;
}, {
    file: string;
    failedCount: number;
    createdCount: number;
    isTransient: boolean;
}>;
type RelationshipFailure = z.infer<typeof relationshipFailureSchema>;
/**
 * Summary of relationship creation results.
 */
declare const relationshipSummarySchema: z.ZodObject<{
    /** Total number of relationships created across all files */
    totalCreated: z.ZodNumber;
    /** Total number of relationships that failed to create */
    totalFailed: z.ZodNumber;
    /** Files that had at least one relationship failure */
    filesWithFailures: z.ZodArray<z.ZodObject<{
        /** Relative file path */
        file: z.ZodString;
        /** Number of relationships that failed to create */
        failedCount: z.ZodNumber;
        /** Number of relationships that were successfully created */
        createdCount: z.ZodNumber;
        /** Whether failures were due to transient errors (retryable) */
        isTransient: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        file: string;
        failedCount: number;
        createdCount: number;
        isTransient: boolean;
    }, {
        file: string;
        failedCount: number;
        createdCount: number;
        isTransient: boolean;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    totalCreated: number;
    totalFailed: number;
    filesWithFailures: {
        file: string;
        failedCount: number;
        createdCount: number;
        isTransient: boolean;
    }[];
}, {
    totalCreated: number;
    totalFailed: number;
    filesWithFailures: {
        file: string;
        failedCount: number;
        createdCount: number;
        isTransient: boolean;
    }[];
}>;
type RelationshipSummary = z.infer<typeof relationshipSummarySchema>;
/**
 * Response from AST indexing operations.
 *
 * This response reflects the results of all three passes (node creation,
 * relationship creation, and cross-file symbol resolution).
 */
declare const indexingResponseSchema: z.ZodObject<{
    /** Number of files successfully processed in Pass 1 */
    processed: z.ZodNumber;
    /** Number of files that failed in Pass 1 */
    failed: z.ZodNumber;
    /** Project identifier */
    projectId: z.ZodString;
    /** Git branch name */
    branchName: z.ZodString;
    /** Details of files that failed during Pass 1 (node creation) */
    failedFiles: z.ZodOptional<z.ZodArray<z.ZodObject<{
        /** Relative file path */
        file: z.ZodString;
        /** Error message describing the failure */
        error: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        error: string;
        file: string;
    }, {
        error: string;
        file: string;
    }>, "many">>;
    /** Summary of relationship creation results from Pass 2 (always present) */
    relationships: z.ZodObject<{
        /** Total number of relationships created across all files */
        totalCreated: z.ZodNumber;
        /** Total number of relationships that failed to create */
        totalFailed: z.ZodNumber;
        /** Files that had at least one relationship failure */
        filesWithFailures: z.ZodArray<z.ZodObject<{
            /** Relative file path */
            file: z.ZodString;
            /** Number of relationships that failed to create */
            failedCount: z.ZodNumber;
            /** Number of relationships that were successfully created */
            createdCount: z.ZodNumber;
            /** Whether failures were due to transient errors (retryable) */
            isTransient: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            file: string;
            failedCount: number;
            createdCount: number;
            isTransient: boolean;
        }, {
            file: string;
            failedCount: number;
            createdCount: number;
            isTransient: boolean;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        totalCreated: number;
        totalFailed: number;
        filesWithFailures: {
            file: string;
            failedCount: number;
            createdCount: number;
            isTransient: boolean;
        }[];
    }, {
        totalCreated: number;
        totalFailed: number;
        filesWithFailures: {
            file: string;
            failedCount: number;
            createdCount: number;
            isTransient: boolean;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    relationships: {
        totalCreated: number;
        totalFailed: number;
        filesWithFailures: {
            file: string;
            failedCount: number;
            createdCount: number;
            isTransient: boolean;
        }[];
    };
    processed: number;
    failed: number;
    projectId: string;
    branchName: string;
    failedFiles?: {
        error: string;
        file: string;
    }[] | undefined;
}, {
    relationships: {
        totalCreated: number;
        totalFailed: number;
        filesWithFailures: {
            file: string;
            failedCount: number;
            createdCount: number;
            isTransient: boolean;
        }[];
    };
    processed: number;
    failed: number;
    projectId: string;
    branchName: string;
    failedFiles?: {
        error: string;
        file: string;
    }[] | undefined;
}>;
type IndexingResponse = z.infer<typeof indexingResponseSchema>;

/**
 * Project State Schema
 *
 * Zod schema for project state API response.
 * Contains metadata about the current state of an indexed project.
 */

/**
 * Project state response containing metadata about the current state of the project.
 */
declare const projectStateSchema: z.ZodObject<{
    /** Unique project identifier (normalized git remote URL) */
    projectId: z.ZodString;
    /** Derived project name from the git repository */
    projectName: z.ZodString;
    /** Current branch being queried */
    branch: z.ZodString;
    /** Latest git commit hash that was indexed (null if never indexed) */
    latestCommit: z.ZodNullable<z.ZodString>;
    /** Total number of files indexed in the project */
    fileCount: z.ZodNumber;
    /** Timestamp of the most recently indexed file (null if never indexed) */
    lastIndexedAt: z.ZodNullable<z.ZodString>;
    /** List of programming languages detected in the project */
    languages: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    fileCount: number;
    languages: string[];
    projectId: string;
    projectName: string;
    branch: string;
    latestCommit: string | null;
    lastIndexedAt: string | null;
}, {
    fileCount: number;
    languages: string[];
    projectId: string;
    projectName: string;
    branch: string;
    latestCommit: string | null;
    lastIndexedAt: string | null;
}>;
type ProjectState = z.infer<typeof projectStateSchema>;

export { type FileFailure, type ImportResolution, type ImportResolutionMetadata, type ImportType, type IndexingResponse, type ProjectState, type RelationshipFailure, type RelationshipSummary, type SerializedAST, fileFailureSchema, importResolutionMetadataSchema, importResolutionSchema, importTypeSchema, indexingResponseSchema, projectStateSchema, relationshipFailureSchema, relationshipSummarySchema, serializedAstSchema };
