export { A as ApiResponse, B as BreakingChangeRisk, C as CallGraphRoot, a as CalleeNode, b as CallerNode, c as CircularDependencyCycle, d as ConfidenceScore, D as DataQualityMetadata, e as DependencyMetrics, f as DependencyOverview, g as DependentMetrics, h as DirectDependency, i as DirectDependent, j as DirectUsage, E as ENTRY_POINT_PATTERNS, F as FileLocation, k as FindCircularDependenciesParams, l as FindCircularDependenciesResult, m as FindOrphanedCodeParams, n as FindOrphanedCodeResult, o as FrameworkInfo, G as GetArchitectureOverviewParams, p as GetArchitectureOverviewResult, q as GetCallGraphParams, r as GetCallGraphResult, s as GetDependenciesParams, t as GetDependenciesResult, u as GetDependentsParams, v as GetDependentsResult, w as GetSymbolDetailsParams, x as GraphRepresentation, I as ImpactAnalysisParams, y as ImpactAnalysisResult, z as ImpactScore, H as ImpactedFile, J as ImpactedSymbol, L as LanguageInfo, K as LanguageMetadata, M as ModuleGraph, N as ModuleGraphEdge, O as ModuleGraphNode, P as OrphanedFile, Q as OrphanedSymbol, R as PYTHON_STDLIB_MODULES, S as PackageDependency, T as PaginationMetadata, U as PingParams, V as PingResult, W as ProjectMetadata, X as QualityMetrics, Y as RelationshipDirections, Z as RiskLevel, _ as SearchSymbolsParams, $ as SearchSymbolsResult, a0 as StandardGraphEdge, a1 as StandardGraphNode, a2 as StructureStatistics, a3 as SymbolDetails, a4 as SymbolDetailsResult, a5 as SymbolInfo, a6 as SymbolKindCategory, a7 as SymbolReference, a8 as SymbolRelationships, a9 as SymbolUsageReference, aa as TEST_PATTERNS, ab as TraceSymbolUsageParams, ac as TraceSymbolUsageResult, ad as TracedSymbol, ae as TransitiveDependency, af as TransitiveDependent, ag as TransitiveUsage, ah as apiErrorResponseSchema, ai as apiResponseSchema, aj as breakingChangeRiskSchema, ak as callGraphRootSchema, al as calleeNodeSchema, am as callerNodeSchema, an as circularDependencyCycleSchema, ao as confidenceScoreSchema, ap as dataQualityMetadataSchema, aq as dependencyMetricsSchema, ar as dependencyOverviewSchema, as as dependentMetricsSchema, at as directDependencySchema, au as directDependentSchema, av as directUsageSchema, aw as fileLocationSchema, ax as findCircularDependenciesParamsSchema, ay as findCircularDependenciesResultSchema, az as findOrphanedCodeParamsSchema, aA as findOrphanedCodeResultSchema, aB as frameworkInfoSchema, aC as getArchitectureOverviewParamsSchema, aD as getArchitectureOverviewResultSchema, aE as getCallGraphParamsSchema, aF as getCallGraphResultSchema, aG as getDependenciesParamsSchema, aH as getDependenciesResultSchema, aI as getDependentsParamsSchema, aJ as getDependentsResultSchema, aK as getSymbolDetailsParamsSchema, aL as graphRepresentationSchema, aM as impactAnalysisParamsSchema, aN as impactAnalysisResultSchema, aO as impactScoreSchema, aP as impactedFileSchema, aQ as impactedSymbolSchema, aR as isErrorResponse, aS as isSuccessResponse, aT as languageInfoSchema, aU as languageMetadataSchema, aV as moduleGraphEdgeSchema, aW as moduleGraphNodeSchema, aX as moduleGraphSchema, aY as orphanedFileSchema, aZ as orphanedSymbolSchema, a_ as packageDependencySchema, a$ as paginationMetadataSchema, b0 as pingParamsSchema, b1 as pingResultSchema, b2 as projectMetadataSchema, b3 as qualityMetricsSchema, b4 as relationshipDirectionsSchema, b5 as riskLevelSchema, b6 as searchSymbolsParamsSchema, b7 as searchSymbolsResultSchema, b8 as standardGraphEdgeSchema, b9 as standardGraphNodeSchema, ba as stringRelationshipDirectionsSchema, bb as structureStatisticsSchema, bc as symbolDetailsResultSchema, bd as symbolDetailsSchema, be as symbolInfoSchema, bf as symbolKindCategorySchema, bg as symbolReferenceSchema, bh as symbolRelationshipsSchema, bi as symbolUsageReferenceSchema, bj as traceSymbolUsageParamsSchema, bk as traceSymbolUsageResultSchema, bl as tracedSymbolSchema, bm as transitiveDependencySchema, bn as transitiveDependentSchema, bo as transitiveUsageSchema } from './mcp-api-MKcN2LEX.js';
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
    ast: string;
    file: string;
    commit: string;
    timestamp: string;
    importResolutions?: Record<string, {
        source: string;
        isExternal: boolean;
        importType: "external" | "relative" | "workspace" | "alias" | "builtin";
        resolvedPath?: string | undefined;
    }> | undefined;
}, {
    language: string;
    ast: string;
    file: string;
    commit: string;
    timestamp: string;
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
 * Tree-sitter AST Type Definitions
 *
 * Minimal interfaces mirroring tree-sitter's SyntaxNode, Tree, and Point types.
 * Allows consumers (Core, CLI) to reference these types without depending on the
 * native tree-sitter package.
 */
interface SyntaxNode {
    tree: Tree;
    id: number;
    typeId: number;
    grammarId: number;
    type: string;
    grammarType: string;
    isNamed: boolean;
    isMissing: boolean;
    isExtra: boolean;
    hasChanges: boolean;
    hasError: boolean;
    isError: boolean;
    text: string;
    parseState: number;
    nextParseState: number;
    startPosition: Point;
    endPosition: Point;
    startIndex: number;
    endIndex: number;
    parent: SyntaxNode | null;
    children: Array<SyntaxNode>;
    namedChildren: Array<SyntaxNode>;
    childCount: number;
    namedChildCount: number;
    firstChild: SyntaxNode | null;
    firstNamedChild: SyntaxNode | null;
    lastChild: SyntaxNode | null;
    lastNamedChild: SyntaxNode | null;
    nextSibling: SyntaxNode | null;
    nextNamedSibling: SyntaxNode | null;
    previousSibling: SyntaxNode | null;
    previousNamedSibling: SyntaxNode | null;
    descendantCount: number;
    child(index: number): SyntaxNode | null;
    childForFieldName(fieldName: string): SyntaxNode | null;
    descendantsOfType(types: string | string[], startPosition?: Point, endPosition?: Point): Array<SyntaxNode>;
}
interface Tree {
    readonly rootNode: SyntaxNode;
}
interface Point {
    row: number;
    column: number;
}

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

export { type FileFailure, type ImportResolution, type ImportResolutionMetadata, type ImportType, type IndexingResponse, type Point, type ProjectState, type RelationshipFailure, type RelationshipSummary, type SerializedAST, type SyntaxNode, type Tree, fileFailureSchema, importResolutionMetadataSchema, importResolutionSchema, importTypeSchema, indexingResponseSchema, projectStateSchema, relationshipFailureSchema, relationshipSummarySchema, serializedAstSchema };
