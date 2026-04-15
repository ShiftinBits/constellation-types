export { A as ApiResponse, B as BreakingChangeRisk, C as CallGraphRoot, a as CalleeNode, b as CallerNode, c as CircularDependencyCycle, d as ComplexityMetrics, e as ComplexityRisk, f as ConfidenceScore, D as DataQualityMetadata, g as DependencyMetrics, h as DependencyOverview, i as DependentMetrics, j as DirectDependency, k as DirectDependent, l as DirectUsage, E as ENTRY_POINT_PATTERNS, F as FileLocation, m as FindCircularDependenciesParams, n as FindCircularDependenciesResult, o as FindOrphanedCodeParams, p as FindOrphanedCodeResult, q as FrameworkInfo, G as GetArchitectureOverviewParams, r as GetArchitectureOverviewResult, s as GetCallGraphParams, t as GetCallGraphResult, u as GetDependenciesParams, v as GetDependenciesResult, w as GetDependentsParams, x as GetDependentsResult, y as GetSymbolDetailsParams, z as GraphRepresentation, I as ImpactAnalysisParams, H as ImpactAnalysisResult, J as ImpactScore, K as ImpactedFile, L as ImpactedSymbol, M as LanguageInfo, N as LanguageMetadata, O as ModuleGraph, P as ModuleGraphEdge, Q as ModuleGraphNode, R as OrphanedFile, S as OrphanedSymbol, T as PYTHON_STDLIB_MODULES, U as PackageDependency, V as PaginationMetadata, W as PingParams, X as PingResult, Y as ProjectMetadata, Z as QualityMetrics, _ as RelationshipDirections, $ as RiskLevel, a0 as SearchSymbolsParams, a1 as SearchSymbolsResult, a2 as StandardGraphEdge, a3 as StandardGraphNode, a4 as StructureStatistics, a5 as SymbolDetails, a6 as SymbolDetailsResult, a7 as SymbolInfo, a8 as SymbolKindCategory, a9 as SymbolReference, aa as SymbolRelationships, ab as SymbolUsageReference, ac as TEST_PATTERNS, ad as TraceSymbolUsageParams, ae as TraceSymbolUsageResult, af as TracedSymbol, ag as TransitiveDependency, ah as TransitiveDependent, ai as TransitiveUsage, aj as apiErrorResponseSchema, ak as apiResponseSchema, al as breakingChangeRiskSchema, am as callGraphRootSchema, an as calleeNodeSchema, ao as callerNodeSchema, ap as circularDependencyCycleSchema, aq as complexityMetricsSchema, ar as complexityRiskSchema, as as confidenceScoreSchema, at as dataQualityMetadataSchema, au as dependencyMetricsSchema, av as dependencyOverviewSchema, aw as dependentMetricsSchema, ax as directDependencySchema, ay as directDependentSchema, az as directUsageSchema, aA as fileLocationSchema, aB as findCircularDependenciesParamsSchema, aC as findCircularDependenciesResultSchema, aD as findOrphanedCodeParamsSchema, aE as findOrphanedCodeResultSchema, aF as frameworkInfoSchema, aG as getArchitectureOverviewParamsSchema, aH as getArchitectureOverviewResultSchema, aI as getCallGraphParamsSchema, aJ as getCallGraphResultSchema, aK as getDependenciesParamsSchema, aL as getDependenciesResultSchema, aM as getDependentsParamsSchema, aN as getDependentsResultSchema, aO as getSymbolDetailsParamsSchema, aP as graphRepresentationSchema, aQ as impactAnalysisParamsSchema, aR as impactAnalysisResultSchema, aS as impactScoreSchema, aT as impactedFileSchema, aU as impactedSymbolSchema, aV as isErrorResponse, aW as isSuccessResponse, aX as languageInfoSchema, aY as languageMetadataSchema, aZ as moduleGraphEdgeSchema, a_ as moduleGraphNodeSchema, a$ as moduleGraphSchema, b0 as orphanedFileSchema, b1 as orphanedSymbolSchema, b2 as packageDependencySchema, b3 as paginationMetadataSchema, b4 as pingParamsSchema, b5 as pingResultSchema, b6 as projectMetadataSchema, b7 as qualityMetricsSchema, b8 as relationshipDirectionsSchema, b9 as riskLevelSchema, ba as searchSymbolsParamsSchema, bb as searchSymbolsResultSchema, bc as standardGraphEdgeSchema, bd as standardGraphNodeSchema, be as stringRelationshipDirectionsSchema, bf as structureStatisticsSchema, bg as symbolDetailsResultSchema, bh as symbolDetailsSchema, bi as symbolInfoSchema, bj as symbolKindCategorySchema, bk as symbolReferenceSchema, bl as symbolRelationshipsSchema, bm as symbolUsageReferenceSchema, bn as traceSymbolUsageParamsSchema, bo as traceSymbolUsageResultSchema, bp as tracedSymbolSchema, bq as transitiveDependencySchema, br as transitiveDependentSchema, bs as transitiveUsageSchema } from './mcp-api-B2LUhhW7.mjs';
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

/**
 * Enrichment Schemas
 *
 * Zod schemas for LSP enrichment data sent from CLI to Core.
 * Defines the contract for type info, references, call hierarchy,
 * and definition locations gathered via LSP during indexing.
 */

/**
 * A reference location pointing to where a symbol is used.
 */
declare const referenceLocationSchema: z.ZodObject<{
    /** POSIX relative path to the file containing the reference */
    filePath: z.ZodString;
    /** 1-based line number of the reference */
    line: z.ZodNumber;
    /** 0-based column offset of the reference */
    column: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    line: number;
    column: number;
}, {
    filePath: string;
    line: number;
    column: number;
}>;
type ReferenceLocation = z.infer<typeof referenceLocationSchema>;
/**
 * A call hierarchy entry representing an incoming or outgoing call.
 * Extends referenceLocationSchema with a symbol name.
 */
declare const callReferenceSchema: z.ZodObject<{
    /** POSIX relative path to the file containing the reference */
    filePath: z.ZodString;
    /** 1-based line number of the reference */
    line: z.ZodNumber;
    /** 0-based column offset of the reference */
    column: z.ZodNumber;
} & {
    /** Name of the calling/called symbol */
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    line: number;
    column: number;
    name: string;
}, {
    filePath: string;
    line: number;
    column: number;
    name: string;
}>;
type CallReference = z.infer<typeof callReferenceSchema>;
/**
 * Type information resolved from LSP hover results.
 */
declare const typeInfoSchema: z.ZodObject<{
    /** The fully resolved type string from LSP */
    resolvedType: z.ZodString;
    /** Return type for function/method symbols */
    returnType: z.ZodOptional<z.ZodString>;
    /** Extracted documentation comment */
    documentation: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    resolvedType: string;
    documentation?: string | undefined;
    returnType?: string | undefined;
}, {
    resolvedType: string;
    documentation?: string | undefined;
    returnType?: string | undefined;
}>;
type TypeInfo = z.infer<typeof typeInfoSchema>;
/**
 * Go-to-definition result pointing to a symbol's declaration.
 */
declare const definitionLocationSchema: z.ZodObject<{
    /** POSIX relative path to the definition file */
    filePath: z.ZodString;
    /** 1-based line number of the definition */
    line: z.ZodNumber;
    /** 0-based column offset of the definition */
    column: z.ZodNumber;
    /** True if the definition is outside the project root (e.g., node_modules) */
    isExternal: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    line: number;
    column: number;
    isExternal: boolean;
}, {
    filePath: string;
    line: number;
    column: number;
    isExternal: boolean;
}>;
type DefinitionLocation = z.infer<typeof definitionLocationSchema>;
/**
 * Per-symbol LSP enrichment data aggregating type info, definition,
 * references, and call hierarchy for a single symbol.
 */
declare const symbolEnrichmentSchema: z.ZodObject<{
    /** Symbol name (must match the corresponding graph node) */
    name: z.ZodString;
    /** 1-based line number (must match the corresponding graph node) */
    line: z.ZodNumber;
    /** 0-based column offset */
    column: z.ZodNumber;
    /** Symbol kind (e.g., function, class, variable, interface) */
    kind: z.ZodString;
    /** Resolved type information from LSP hover */
    typeInfo: z.ZodOptional<z.ZodObject<{
        /** The fully resolved type string from LSP */
        resolvedType: z.ZodString;
        /** Return type for function/method symbols */
        returnType: z.ZodOptional<z.ZodString>;
        /** Extracted documentation comment */
        documentation: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        resolvedType: string;
        documentation?: string | undefined;
        returnType?: string | undefined;
    }, {
        resolvedType: string;
        documentation?: string | undefined;
        returnType?: string | undefined;
    }>>;
    /** Go-to-definition result */
    definition: z.ZodOptional<z.ZodObject<{
        /** POSIX relative path to the definition file */
        filePath: z.ZodString;
        /** 1-based line number of the definition */
        line: z.ZodNumber;
        /** 0-based column offset of the definition */
        column: z.ZodNumber;
        /** True if the definition is outside the project root (e.g., node_modules) */
        isExternal: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        filePath: string;
        line: number;
        column: number;
        isExternal: boolean;
    }, {
        filePath: string;
        line: number;
        column: number;
        isExternal: boolean;
    }>>;
    /** Reference locations where this symbol is used */
    references: z.ZodOptional<z.ZodObject<{
        /** Total number of references found */
        count: z.ZodNumber;
        /** Reference locations (capped at 100) */
        locations: z.ZodArray<z.ZodObject<{
            /** POSIX relative path to the file containing the reference */
            filePath: z.ZodString;
            /** 1-based line number of the reference */
            line: z.ZodNumber;
            /** 0-based column offset of the reference */
            column: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            filePath: string;
            line: number;
            column: number;
        }, {
            filePath: string;
            line: number;
            column: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        count: number;
        locations: {
            filePath: string;
            line: number;
            column: number;
        }[];
    }, {
        count: number;
        locations: {
            filePath: string;
            line: number;
            column: number;
        }[];
    }>>;
    /** Incoming and outgoing call hierarchy */
    callHierarchy: z.ZodOptional<z.ZodObject<{
        /** Functions/methods that call this symbol (capped at 200) */
        incomingCalls: z.ZodArray<z.ZodObject<{
            /** POSIX relative path to the file containing the reference */
            filePath: z.ZodString;
            /** 1-based line number of the reference */
            line: z.ZodNumber;
            /** 0-based column offset of the reference */
            column: z.ZodNumber;
        } & {
            /** Name of the calling/called symbol */
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            filePath: string;
            line: number;
            column: number;
            name: string;
        }, {
            filePath: string;
            line: number;
            column: number;
            name: string;
        }>, "many">;
        /** Functions/methods called by this symbol (capped at 200) */
        outgoingCalls: z.ZodArray<z.ZodObject<{
            /** POSIX relative path to the file containing the reference */
            filePath: z.ZodString;
            /** 1-based line number of the reference */
            line: z.ZodNumber;
            /** 0-based column offset of the reference */
            column: z.ZodNumber;
        } & {
            /** Name of the calling/called symbol */
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            filePath: string;
            line: number;
            column: number;
            name: string;
        }, {
            filePath: string;
            line: number;
            column: number;
            name: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        incomingCalls: {
            filePath: string;
            line: number;
            column: number;
            name: string;
        }[];
        outgoingCalls: {
            filePath: string;
            line: number;
            column: number;
            name: string;
        }[];
    }, {
        incomingCalls: {
            filePath: string;
            line: number;
            column: number;
            name: string;
        }[];
        outgoingCalls: {
            filePath: string;
            line: number;
            column: number;
            name: string;
        }[];
    }>>;
}, "strip", z.ZodTypeAny, {
    line: number;
    column: number;
    name: string;
    kind: string;
    typeInfo?: {
        resolvedType: string;
        documentation?: string | undefined;
        returnType?: string | undefined;
    } | undefined;
    references?: {
        count: number;
        locations: {
            filePath: string;
            line: number;
            column: number;
        }[];
    } | undefined;
    definition?: {
        filePath: string;
        line: number;
        column: number;
        isExternal: boolean;
    } | undefined;
    callHierarchy?: {
        incomingCalls: {
            filePath: string;
            line: number;
            column: number;
            name: string;
        }[];
        outgoingCalls: {
            filePath: string;
            line: number;
            column: number;
            name: string;
        }[];
    } | undefined;
}, {
    line: number;
    column: number;
    name: string;
    kind: string;
    typeInfo?: {
        resolvedType: string;
        documentation?: string | undefined;
        returnType?: string | undefined;
    } | undefined;
    references?: {
        count: number;
        locations: {
            filePath: string;
            line: number;
            column: number;
        }[];
    } | undefined;
    definition?: {
        filePath: string;
        line: number;
        column: number;
        isExternal: boolean;
    } | undefined;
    callHierarchy?: {
        incomingCalls: {
            filePath: string;
            line: number;
            column: number;
            name: string;
        }[];
        outgoingCalls: {
            filePath: string;
            line: number;
            column: number;
            name: string;
        }[];
    } | undefined;
}>;
type SymbolEnrichment = z.infer<typeof symbolEnrichmentSchema>;
/**
 * File-level enrichment data containing all enriched symbols for a single file.
 * Each instance represents one NDJSON line in the enrichment payload.
 */
declare const fileEnrichmentSchema: z.ZodObject<{
    /** POSIX relative path to the source file */
    filePath: z.ZodString;
    /** Programming language identifier (e.g., 'typescript', 'python') */
    language: z.ZodString;
    /** Enriched symbols found in this file */
    symbols: z.ZodArray<z.ZodObject<{
        /** Symbol name (must match the corresponding graph node) */
        name: z.ZodString;
        /** 1-based line number (must match the corresponding graph node) */
        line: z.ZodNumber;
        /** 0-based column offset */
        column: z.ZodNumber;
        /** Symbol kind (e.g., function, class, variable, interface) */
        kind: z.ZodString;
        /** Resolved type information from LSP hover */
        typeInfo: z.ZodOptional<z.ZodObject<{
            /** The fully resolved type string from LSP */
            resolvedType: z.ZodString;
            /** Return type for function/method symbols */
            returnType: z.ZodOptional<z.ZodString>;
            /** Extracted documentation comment */
            documentation: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            resolvedType: string;
            documentation?: string | undefined;
            returnType?: string | undefined;
        }, {
            resolvedType: string;
            documentation?: string | undefined;
            returnType?: string | undefined;
        }>>;
        /** Go-to-definition result */
        definition: z.ZodOptional<z.ZodObject<{
            /** POSIX relative path to the definition file */
            filePath: z.ZodString;
            /** 1-based line number of the definition */
            line: z.ZodNumber;
            /** 0-based column offset of the definition */
            column: z.ZodNumber;
            /** True if the definition is outside the project root (e.g., node_modules) */
            isExternal: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            filePath: string;
            line: number;
            column: number;
            isExternal: boolean;
        }, {
            filePath: string;
            line: number;
            column: number;
            isExternal: boolean;
        }>>;
        /** Reference locations where this symbol is used */
        references: z.ZodOptional<z.ZodObject<{
            /** Total number of references found */
            count: z.ZodNumber;
            /** Reference locations (capped at 100) */
            locations: z.ZodArray<z.ZodObject<{
                /** POSIX relative path to the file containing the reference */
                filePath: z.ZodString;
                /** 1-based line number of the reference */
                line: z.ZodNumber;
                /** 0-based column offset of the reference */
                column: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                filePath: string;
                line: number;
                column: number;
            }, {
                filePath: string;
                line: number;
                column: number;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            count: number;
            locations: {
                filePath: string;
                line: number;
                column: number;
            }[];
        }, {
            count: number;
            locations: {
                filePath: string;
                line: number;
                column: number;
            }[];
        }>>;
        /** Incoming and outgoing call hierarchy */
        callHierarchy: z.ZodOptional<z.ZodObject<{
            /** Functions/methods that call this symbol (capped at 200) */
            incomingCalls: z.ZodArray<z.ZodObject<{
                /** POSIX relative path to the file containing the reference */
                filePath: z.ZodString;
                /** 1-based line number of the reference */
                line: z.ZodNumber;
                /** 0-based column offset of the reference */
                column: z.ZodNumber;
            } & {
                /** Name of the calling/called symbol */
                name: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                filePath: string;
                line: number;
                column: number;
                name: string;
            }, {
                filePath: string;
                line: number;
                column: number;
                name: string;
            }>, "many">;
            /** Functions/methods called by this symbol (capped at 200) */
            outgoingCalls: z.ZodArray<z.ZodObject<{
                /** POSIX relative path to the file containing the reference */
                filePath: z.ZodString;
                /** 1-based line number of the reference */
                line: z.ZodNumber;
                /** 0-based column offset of the reference */
                column: z.ZodNumber;
            } & {
                /** Name of the calling/called symbol */
                name: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                filePath: string;
                line: number;
                column: number;
                name: string;
            }, {
                filePath: string;
                line: number;
                column: number;
                name: string;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            incomingCalls: {
                filePath: string;
                line: number;
                column: number;
                name: string;
            }[];
            outgoingCalls: {
                filePath: string;
                line: number;
                column: number;
                name: string;
            }[];
        }, {
            incomingCalls: {
                filePath: string;
                line: number;
                column: number;
                name: string;
            }[];
            outgoingCalls: {
                filePath: string;
                line: number;
                column: number;
                name: string;
            }[];
        }>>;
    }, "strip", z.ZodTypeAny, {
        line: number;
        column: number;
        name: string;
        kind: string;
        typeInfo?: {
            resolvedType: string;
            documentation?: string | undefined;
            returnType?: string | undefined;
        } | undefined;
        references?: {
            count: number;
            locations: {
                filePath: string;
                line: number;
                column: number;
            }[];
        } | undefined;
        definition?: {
            filePath: string;
            line: number;
            column: number;
            isExternal: boolean;
        } | undefined;
        callHierarchy?: {
            incomingCalls: {
                filePath: string;
                line: number;
                column: number;
                name: string;
            }[];
            outgoingCalls: {
                filePath: string;
                line: number;
                column: number;
                name: string;
            }[];
        } | undefined;
    }, {
        line: number;
        column: number;
        name: string;
        kind: string;
        typeInfo?: {
            resolvedType: string;
            documentation?: string | undefined;
            returnType?: string | undefined;
        } | undefined;
        references?: {
            count: number;
            locations: {
                filePath: string;
                line: number;
                column: number;
            }[];
        } | undefined;
        definition?: {
            filePath: string;
            line: number;
            column: number;
            isExternal: boolean;
        } | undefined;
        callHierarchy?: {
            incomingCalls: {
                filePath: string;
                line: number;
                column: number;
                name: string;
            }[];
            outgoingCalls: {
                filePath: string;
                line: number;
                column: number;
                name: string;
            }[];
        } | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    language: string;
    filePath: string;
    symbols: {
        line: number;
        column: number;
        name: string;
        kind: string;
        typeInfo?: {
            resolvedType: string;
            documentation?: string | undefined;
            returnType?: string | undefined;
        } | undefined;
        references?: {
            count: number;
            locations: {
                filePath: string;
                line: number;
                column: number;
            }[];
        } | undefined;
        definition?: {
            filePath: string;
            line: number;
            column: number;
            isExternal: boolean;
        } | undefined;
        callHierarchy?: {
            incomingCalls: {
                filePath: string;
                line: number;
                column: number;
                name: string;
            }[];
            outgoingCalls: {
                filePath: string;
                line: number;
                column: number;
                name: string;
            }[];
        } | undefined;
    }[];
}, {
    language: string;
    filePath: string;
    symbols: {
        line: number;
        column: number;
        name: string;
        kind: string;
        typeInfo?: {
            resolvedType: string;
            documentation?: string | undefined;
            returnType?: string | undefined;
        } | undefined;
        references?: {
            count: number;
            locations: {
                filePath: string;
                line: number;
                column: number;
            }[];
        } | undefined;
        definition?: {
            filePath: string;
            line: number;
            column: number;
            isExternal: boolean;
        } | undefined;
        callHierarchy?: {
            incomingCalls: {
                filePath: string;
                line: number;
                column: number;
                name: string;
            }[];
            outgoingCalls: {
                filePath: string;
                line: number;
                column: number;
                name: string;
            }[];
        } | undefined;
    }[];
}>;
type FileEnrichment = z.infer<typeof fileEnrichmentSchema>;
/**
 * Metadata describing the context of an enrichment run.
 */
declare const enrichmentMetadataSchema: z.ZodObject<{
    /** Project identifier */
    projectId: z.ZodString;
    /** Git branch name */
    branch: z.ZodString;
    /** Full 40-character SHA-1 commit hash */
    commit: z.ZodString;
    /** ISO 8601 timestamp of the enrichment run */
    timestamp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    commit: string;
    timestamp: string;
    projectId: string;
    branch: string;
}, {
    commit: string;
    timestamp: string;
    projectId: string;
    branch: string;
}>;
type EnrichmentMetadata = z.infer<typeof enrichmentMetadataSchema>;
/**
 * Status of an enrichment operation.
 */
declare const enrichmentStatusSchema: z.ZodEnum<["pending", "processing", "completed", "failed", "skipped"]>;
type EnrichmentStatus = z.infer<typeof enrichmentStatusSchema>;

declare const graphNodeTypeSchema: z.ZodEnum<["function", "class", "variable", "import", "module", "interface", "type", "constant", "export"]>;
type GraphNodeType = z.infer<typeof graphNodeTypeSchema>;
declare const graphEdgeTypeSchema: z.ZodEnum<["calls", "imports", "extends", "inherits", "implements", "uses", "references", "exports", "contains"]>;
type GraphEdgeType = z.infer<typeof graphEdgeTypeSchema>;
declare const graphNodeSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    type: z.ZodEnum<["function", "class", "variable", "import", "module", "interface", "type", "constant", "export"]>;
    data: z.ZodObject<{
        filePath: z.ZodString;
        lineNumber: z.ZodNumber;
        module: z.ZodString;
        visibility: z.ZodString;
        isExported: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        visibility: string;
        module: string;
        filePath: string;
        isExported: boolean;
        lineNumber: number;
    }, {
        visibility: string;
        module: string;
        filePath: string;
        isExported: boolean;
        lineNumber: number;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "function" | "type" | "class" | "interface" | "variable" | "constant" | "module" | "import" | "export";
    id: string;
    data: {
        visibility: string;
        module: string;
        filePath: string;
        isExported: boolean;
        lineNumber: number;
    };
    label: string;
}, {
    type: "function" | "type" | "class" | "interface" | "variable" | "constant" | "module" | "import" | "export";
    id: string;
    data: {
        visibility: string;
        module: string;
        filePath: string;
        isExported: boolean;
        lineNumber: number;
    };
    label: string;
}>;
type GraphNode = z.infer<typeof graphNodeSchema>;
declare const graphEdgeSchema: z.ZodObject<{
    id: z.ZodString;
    source: z.ZodString;
    target: z.ZodString;
    type: z.ZodEnum<["calls", "imports", "extends", "inherits", "implements", "uses", "references", "exports", "contains"]>;
    label: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "calls" | "references" | "imports" | "extends" | "inherits" | "implements" | "uses" | "exports" | "contains";
    id: string;
    source: string;
    target: string;
    label?: string | undefined;
}, {
    type: "calls" | "references" | "imports" | "extends" | "inherits" | "implements" | "uses" | "exports" | "contains";
    id: string;
    source: string;
    target: string;
    label?: string | undefined;
}>;
type GraphEdge = z.infer<typeof graphEdgeSchema>;
declare const graphSummarySchema: z.ZodObject<{
    totalNodes: z.ZodNumber;
    totalEdges: z.ZodNumber;
    toolName: z.ZodString;
    query: z.ZodString;
    riskLevel: z.ZodOptional<z.ZodEnum<["low", "medium", "high", "critical"]>>;
}, "strip", z.ZodTypeAny, {
    query: string;
    totalNodes: number;
    totalEdges: number;
    toolName: string;
    riskLevel?: "low" | "medium" | "high" | "critical" | undefined;
}, {
    query: string;
    totalNodes: number;
    totalEdges: number;
    toolName: string;
    riskLevel?: "low" | "medium" | "high" | "critical" | undefined;
}>;
type GraphSummary = z.infer<typeof graphSummarySchema>;
declare const graphMetadataSchema: z.ZodObject<{
    projectName: z.ZodString;
    branch: z.ZodString;
    asOfCommit: z.ZodString;
    lastIndexedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectName: string;
    branch: string;
    lastIndexedAt: string;
    asOfCommit: string;
}, {
    projectName: string;
    branch: string;
    lastIndexedAt: string;
    asOfCommit: string;
}>;
type GraphMetadata = z.infer<typeof graphMetadataSchema>;
declare const graphToolResultSchema: z.ZodObject<{
    nodes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        type: z.ZodEnum<["function", "class", "variable", "import", "module", "interface", "type", "constant", "export"]>;
        data: z.ZodObject<{
            filePath: z.ZodString;
            lineNumber: z.ZodNumber;
            module: z.ZodString;
            visibility: z.ZodString;
            isExported: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            visibility: string;
            module: string;
            filePath: string;
            isExported: boolean;
            lineNumber: number;
        }, {
            visibility: string;
            module: string;
            filePath: string;
            isExported: boolean;
            lineNumber: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        type: "function" | "type" | "class" | "interface" | "variable" | "constant" | "module" | "import" | "export";
        id: string;
        data: {
            visibility: string;
            module: string;
            filePath: string;
            isExported: boolean;
            lineNumber: number;
        };
        label: string;
    }, {
        type: "function" | "type" | "class" | "interface" | "variable" | "constant" | "module" | "import" | "export";
        id: string;
        data: {
            visibility: string;
            module: string;
            filePath: string;
            isExported: boolean;
            lineNumber: number;
        };
        label: string;
    }>, "many">;
    edges: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        source: z.ZodString;
        target: z.ZodString;
        type: z.ZodEnum<["calls", "imports", "extends", "inherits", "implements", "uses", "references", "exports", "contains"]>;
        label: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "calls" | "references" | "imports" | "extends" | "inherits" | "implements" | "uses" | "exports" | "contains";
        id: string;
        source: string;
        target: string;
        label?: string | undefined;
    }, {
        type: "calls" | "references" | "imports" | "extends" | "inherits" | "implements" | "uses" | "exports" | "contains";
        id: string;
        source: string;
        target: string;
        label?: string | undefined;
    }>, "many">;
    summary: z.ZodObject<{
        totalNodes: z.ZodNumber;
        totalEdges: z.ZodNumber;
        toolName: z.ZodString;
        query: z.ZodString;
        riskLevel: z.ZodOptional<z.ZodEnum<["low", "medium", "high", "critical"]>>;
    }, "strip", z.ZodTypeAny, {
        query: string;
        totalNodes: number;
        totalEdges: number;
        toolName: string;
        riskLevel?: "low" | "medium" | "high" | "critical" | undefined;
    }, {
        query: string;
        totalNodes: number;
        totalEdges: number;
        toolName: string;
        riskLevel?: "low" | "medium" | "high" | "critical" | undefined;
    }>;
    metadata: z.ZodObject<{
        projectName: z.ZodString;
        branch: z.ZodString;
        asOfCommit: z.ZodString;
        lastIndexedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        projectName: string;
        branch: string;
        lastIndexedAt: string;
        asOfCommit: string;
    }, {
        projectName: string;
        branch: string;
        lastIndexedAt: string;
        asOfCommit: string;
    }>;
    features: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    nodes: {
        type: "function" | "type" | "class" | "interface" | "variable" | "constant" | "module" | "import" | "export";
        id: string;
        data: {
            visibility: string;
            module: string;
            filePath: string;
            isExported: boolean;
            lineNumber: number;
        };
        label: string;
    }[];
    edges: {
        type: "calls" | "references" | "imports" | "extends" | "inherits" | "implements" | "uses" | "exports" | "contains";
        id: string;
        source: string;
        target: string;
        label?: string | undefined;
    }[];
    metadata: {
        projectName: string;
        branch: string;
        lastIndexedAt: string;
        asOfCommit: string;
    };
    summary: {
        query: string;
        totalNodes: number;
        totalEdges: number;
        toolName: string;
        riskLevel?: "low" | "medium" | "high" | "critical" | undefined;
    };
    features?: Record<string, boolean> | undefined;
}, {
    nodes: {
        type: "function" | "type" | "class" | "interface" | "variable" | "constant" | "module" | "import" | "export";
        id: string;
        data: {
            visibility: string;
            module: string;
            filePath: string;
            isExported: boolean;
            lineNumber: number;
        };
        label: string;
    }[];
    edges: {
        type: "calls" | "references" | "imports" | "extends" | "inherits" | "implements" | "uses" | "exports" | "contains";
        id: string;
        source: string;
        target: string;
        label?: string | undefined;
    }[];
    metadata: {
        projectName: string;
        branch: string;
        lastIndexedAt: string;
        asOfCommit: string;
    };
    summary: {
        query: string;
        totalNodes: number;
        totalEdges: number;
        toolName: string;
        riskLevel?: "low" | "medium" | "high" | "critical" | undefined;
    };
    features?: Record<string, boolean> | undefined;
}>;
type GraphToolResult = z.infer<typeof graphToolResultSchema>;

declare const projectInfoSchema: z.ZodObject<{
    projectId: z.ZodString;
    projectName: z.ZodString;
    defaultBranch: z.ZodString;
    lastIndexedAt: z.ZodOptional<z.ZodString>;
    fileCount: z.ZodOptional<z.ZodNumber>;
    languages: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    projectName: string;
    defaultBranch: string;
    fileCount?: number | undefined;
    languages?: string[] | undefined;
    lastIndexedAt?: string | undefined;
}, {
    projectId: string;
    projectName: string;
    defaultBranch: string;
    fileCount?: number | undefined;
    languages?: string[] | undefined;
    lastIndexedAt?: string | undefined;
}>;
type ProjectInfo = z.infer<typeof projectInfoSchema>;
declare const projectListResponseSchema: z.ZodObject<{
    projects: z.ZodArray<z.ZodObject<{
        projectId: z.ZodString;
        projectName: z.ZodString;
        defaultBranch: z.ZodString;
        lastIndexedAt: z.ZodOptional<z.ZodString>;
        fileCount: z.ZodOptional<z.ZodNumber>;
        languages: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        projectName: string;
        defaultBranch: string;
        fileCount?: number | undefined;
        languages?: string[] | undefined;
        lastIndexedAt?: string | undefined;
    }, {
        projectId: string;
        projectName: string;
        defaultBranch: string;
        fileCount?: number | undefined;
        languages?: string[] | undefined;
        lastIndexedAt?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    projects: {
        projectId: string;
        projectName: string;
        defaultBranch: string;
        fileCount?: number | undefined;
        languages?: string[] | undefined;
        lastIndexedAt?: string | undefined;
    }[];
}, {
    projects: {
        projectId: string;
        projectName: string;
        defaultBranch: string;
        fileCount?: number | undefined;
        languages?: string[] | undefined;
        lastIndexedAt?: string | undefined;
    }[];
}>;
type ProjectListResponse = z.infer<typeof projectListResponseSchema>;
declare const projectResolveResponseSchema: z.ZodObject<Pick<{
    projectId: z.ZodString;
    projectName: z.ZodString;
    defaultBranch: z.ZodString;
    lastIndexedAt: z.ZodOptional<z.ZodString>;
    fileCount: z.ZodOptional<z.ZodNumber>;
    languages: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "projectId" | "projectName" | "defaultBranch">, "strip", z.ZodTypeAny, {
    projectId: string;
    projectName: string;
    defaultBranch: string;
}, {
    projectId: string;
    projectName: string;
    defaultBranch: string;
}>;
type ProjectResolveResponse = z.infer<typeof projectResolveResponseSchema>;

declare const indexErrorReportStatusSchema: z.ZodEnum<["unresolved", "resolved", "archived"]>;
type IndexErrorReportStatus = z.infer<typeof indexErrorReportStatusSchema>;
declare const indexOutcomeSchema: z.ZodEnum<["succeeded", "failed"]>;
type IndexOutcome = z.infer<typeof indexOutcomeSchema>;
declare const indexTypeSchema: z.ZodEnum<["full", "incremental"]>;
type IndexType = z.infer<typeof indexTypeSchema>;
declare const logLevelSchema: z.ZodEnum<["info", "warn", "error"]>;
type LogLevel = z.infer<typeof logLevelSchema>;
declare const errorEntrySchema: z.ZodObject<{
    type: z.ZodString;
    message: z.ZodString;
    phase: z.ZodString;
    filePath: z.ZodOptional<z.ZodString>;
    stack: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    message: string;
    type: string;
    phase: string;
    filePath?: string | undefined;
    stack?: string | undefined;
}, {
    message: string;
    type: string;
    phase: string;
    filePath?: string | undefined;
    stack?: string | undefined;
}>;
type ErrorEntry = z.infer<typeof errorEntrySchema>;
declare const warningEntrySchema: z.ZodObject<{
    type: z.ZodString;
    message: z.ZodString;
    phase: z.ZodString;
    filePath: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    message: string;
    type: string;
    phase: string;
    filePath?: string | undefined;
}, {
    message: string;
    type: string;
    phase: string;
    filePath?: string | undefined;
}>;
type WarningEntry = z.infer<typeof warningEntrySchema>;
declare const errorDataSchema: z.ZodObject<{
    errors: z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        message: z.ZodString;
        phase: z.ZodString;
        filePath: z.ZodOptional<z.ZodString>;
        stack: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        type: string;
        phase: string;
        filePath?: string | undefined;
        stack?: string | undefined;
    }, {
        message: string;
        type: string;
        phase: string;
        filePath?: string | undefined;
        stack?: string | undefined;
    }>, "many">;
    warnings: z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        message: z.ZodString;
        phase: z.ZodString;
        filePath: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        type: string;
        phase: string;
        filePath?: string | undefined;
    }, {
        message: string;
        type: string;
        phase: string;
        filePath?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    warnings: {
        message: string;
        type: string;
        phase: string;
        filePath?: string | undefined;
    }[];
    errors: {
        message: string;
        type: string;
        phase: string;
        filePath?: string | undefined;
        stack?: string | undefined;
    }[];
}, {
    warnings: {
        message: string;
        type: string;
        phase: string;
        filePath?: string | undefined;
    }[];
    errors: {
        message: string;
        type: string;
        phase: string;
        filePath?: string | undefined;
        stack?: string | undefined;
    }[];
}>;
type ErrorData = z.infer<typeof errorDataSchema>;
declare const logEntrySchema: z.ZodObject<{
    level: z.ZodEnum<["info", "warn", "error"]>;
    message: z.ZodString;
    timestamp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    timestamp: string;
    level: "error" | "info" | "warn";
}, {
    message: string;
    timestamp: string;
    level: "error" | "info" | "warn";
}>;
type LogEntry = z.infer<typeof logEntrySchema>;
declare const createErrorReportSchema: z.ZodObject<{
    errorSummary: z.ZodString;
    errorData: z.ZodObject<{
        errors: z.ZodArray<z.ZodObject<{
            type: z.ZodString;
            message: z.ZodString;
            phase: z.ZodString;
            filePath: z.ZodOptional<z.ZodString>;
            stack: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            message: string;
            type: string;
            phase: string;
            filePath?: string | undefined;
            stack?: string | undefined;
        }, {
            message: string;
            type: string;
            phase: string;
            filePath?: string | undefined;
            stack?: string | undefined;
        }>, "many">;
        warnings: z.ZodArray<z.ZodObject<{
            type: z.ZodString;
            message: z.ZodString;
            phase: z.ZodString;
            filePath: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            message: string;
            type: string;
            phase: string;
            filePath?: string | undefined;
        }, {
            message: string;
            type: string;
            phase: string;
            filePath?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        warnings: {
            message: string;
            type: string;
            phase: string;
            filePath?: string | undefined;
        }[];
        errors: {
            message: string;
            type: string;
            phase: string;
            filePath?: string | undefined;
            stack?: string | undefined;
        }[];
    }, {
        warnings: {
            message: string;
            type: string;
            phase: string;
            filePath?: string | undefined;
        }[];
        errors: {
            message: string;
            type: string;
            phase: string;
            filePath?: string | undefined;
            stack?: string | undefined;
        }[];
    }>;
    logEntries: z.ZodArray<z.ZodObject<{
        level: z.ZodEnum<["info", "warn", "error"]>;
        message: z.ZodString;
        timestamp: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
        timestamp: string;
        level: "error" | "info" | "warn";
    }, {
        message: string;
        timestamp: string;
        level: "error" | "info" | "warn";
    }>, "many">;
    cliVersion: z.ZodString;
    outcome: z.ZodEnum<["succeeded", "failed"]>;
    indexType: z.ZodEnum<["full", "incremental"]>;
}, "strip", z.ZodTypeAny, {
    errorSummary: string;
    errorData: {
        warnings: {
            message: string;
            type: string;
            phase: string;
            filePath?: string | undefined;
        }[];
        errors: {
            message: string;
            type: string;
            phase: string;
            filePath?: string | undefined;
            stack?: string | undefined;
        }[];
    };
    logEntries: {
        message: string;
        timestamp: string;
        level: "error" | "info" | "warn";
    }[];
    cliVersion: string;
    outcome: "failed" | "succeeded";
    indexType: "full" | "incremental";
}, {
    errorSummary: string;
    errorData: {
        warnings: {
            message: string;
            type: string;
            phase: string;
            filePath?: string | undefined;
        }[];
        errors: {
            message: string;
            type: string;
            phase: string;
            filePath?: string | undefined;
            stack?: string | undefined;
        }[];
    };
    logEntries: {
        message: string;
        timestamp: string;
        level: "error" | "info" | "warn";
    }[];
    cliVersion: string;
    outcome: "failed" | "succeeded";
    indexType: "full" | "incremental";
}>;
type CreateErrorReport = z.infer<typeof createErrorReportSchema>;
declare const updateErrorReportSchema: z.ZodObject<{
    status: z.ZodEnum<["unresolved", "resolved"]>;
}, "strip", z.ZodTypeAny, {
    status: "unresolved" | "resolved";
}, {
    status: "unresolved" | "resolved";
}>;
type UpdateErrorReport = z.infer<typeof updateErrorReportSchema>;
declare const errorReportResponseSchema: z.ZodObject<{
    id: z.ZodString;
    organizationId: z.ZodString;
    userId: z.ZodString;
    projectId: z.ZodString;
    branchName: z.ZodString;
    commitHash: z.ZodNullable<z.ZodString>;
    indexType: z.ZodEnum<["full", "incremental"]>;
    status: z.ZodEnum<["unresolved", "resolved", "archived"]>;
    outcome: z.ZodEnum<["succeeded", "failed"]>;
    errorSummary: z.ZodString;
    errorData: z.ZodObject<{
        errors: z.ZodArray<z.ZodObject<{
            type: z.ZodString;
            message: z.ZodString;
            phase: z.ZodString;
            filePath: z.ZodOptional<z.ZodString>;
            stack: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            message: string;
            type: string;
            phase: string;
            filePath?: string | undefined;
            stack?: string | undefined;
        }, {
            message: string;
            type: string;
            phase: string;
            filePath?: string | undefined;
            stack?: string | undefined;
        }>, "many">;
        warnings: z.ZodArray<z.ZodObject<{
            type: z.ZodString;
            message: z.ZodString;
            phase: z.ZodString;
            filePath: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            message: string;
            type: string;
            phase: string;
            filePath?: string | undefined;
        }, {
            message: string;
            type: string;
            phase: string;
            filePath?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        warnings: {
            message: string;
            type: string;
            phase: string;
            filePath?: string | undefined;
        }[];
        errors: {
            message: string;
            type: string;
            phase: string;
            filePath?: string | undefined;
            stack?: string | undefined;
        }[];
    }, {
        warnings: {
            message: string;
            type: string;
            phase: string;
            filePath?: string | undefined;
        }[];
        errors: {
            message: string;
            type: string;
            phase: string;
            filePath?: string | undefined;
            stack?: string | undefined;
        }[];
    }>;
    logEntries: z.ZodArray<z.ZodObject<{
        level: z.ZodEnum<["info", "warn", "error"]>;
        message: z.ZodString;
        timestamp: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
        timestamp: string;
        level: "error" | "info" | "warn";
    }, {
        message: string;
        timestamp: string;
        level: "error" | "info" | "warn";
    }>, "many">;
    cliVersion: z.ZodString;
    resolvedAt: z.ZodNullable<z.ZodString>;
    resolvedBy: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    organizationName: z.ZodOptional<z.ZodString>;
    projectName: z.ZodOptional<z.ZodString>;
    userEmail: z.ZodOptional<z.ZodString>;
    resolvedByEmail: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "unresolved" | "resolved" | "archived";
    id: string;
    projectId: string;
    branchName: string;
    errorSummary: string;
    errorData: {
        warnings: {
            message: string;
            type: string;
            phase: string;
            filePath?: string | undefined;
        }[];
        errors: {
            message: string;
            type: string;
            phase: string;
            filePath?: string | undefined;
            stack?: string | undefined;
        }[];
    };
    logEntries: {
        message: string;
        timestamp: string;
        level: "error" | "info" | "warn";
    }[];
    cliVersion: string;
    outcome: "failed" | "succeeded";
    indexType: "full" | "incremental";
    organizationId: string;
    userId: string;
    commitHash: string | null;
    resolvedAt: string | null;
    resolvedBy: string | null;
    createdAt: string;
    updatedAt: string;
    projectName?: string | undefined;
    organizationName?: string | undefined;
    userEmail?: string | undefined;
    resolvedByEmail?: string | undefined;
}, {
    status: "unresolved" | "resolved" | "archived";
    id: string;
    projectId: string;
    branchName: string;
    errorSummary: string;
    errorData: {
        warnings: {
            message: string;
            type: string;
            phase: string;
            filePath?: string | undefined;
        }[];
        errors: {
            message: string;
            type: string;
            phase: string;
            filePath?: string | undefined;
            stack?: string | undefined;
        }[];
    };
    logEntries: {
        message: string;
        timestamp: string;
        level: "error" | "info" | "warn";
    }[];
    cliVersion: string;
    outcome: "failed" | "succeeded";
    indexType: "full" | "incremental";
    organizationId: string;
    userId: string;
    commitHash: string | null;
    resolvedAt: string | null;
    resolvedBy: string | null;
    createdAt: string;
    updatedAt: string;
    projectName?: string | undefined;
    organizationName?: string | undefined;
    userEmail?: string | undefined;
    resolvedByEmail?: string | undefined;
}>;
type ErrorReportResponse = z.infer<typeof errorReportResponseSchema>;
declare const errorReportMetricsSchema: z.ZodObject<{
    unresolvedCount: z.ZodNumber;
    failedRunCount: z.ZodNumber;
    resolvedLast30d: z.ZodNumber;
    avgResolutionDays: z.ZodNullable<z.ZodNumber>;
    affectedOrgCount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    unresolvedCount: number;
    failedRunCount: number;
    resolvedLast30d: number;
    avgResolutionDays: number | null;
    affectedOrgCount: number;
}, {
    unresolvedCount: number;
    failedRunCount: number;
    resolvedLast30d: number;
    avgResolutionDays: number | null;
    affectedOrgCount: number;
}>;
type ErrorReportMetrics = z.infer<typeof errorReportMetricsSchema>;

export { type CallReference, type CreateErrorReport, type DefinitionLocation, type EnrichmentMetadata, type EnrichmentStatus, type ErrorData, type ErrorEntry, type ErrorReportMetrics, type ErrorReportResponse, type FileEnrichment, type FileFailure, type GraphEdge, type GraphEdgeType, type GraphMetadata, type GraphNode, type GraphNodeType, type GraphSummary, type GraphToolResult, type ImportResolution, type ImportResolutionMetadata, type ImportType, type IndexErrorReportStatus, type IndexOutcome, type IndexType, type IndexingResponse, type LogEntry, type LogLevel, type Point, type ProjectInfo, type ProjectListResponse, type ProjectResolveResponse, type ProjectState, type ReferenceLocation, type RelationshipFailure, type RelationshipSummary, type SerializedAST, type SymbolEnrichment, type SyntaxNode, type Tree, type TypeInfo, type UpdateErrorReport, type WarningEntry, callReferenceSchema, createErrorReportSchema, definitionLocationSchema, enrichmentMetadataSchema, enrichmentStatusSchema, errorDataSchema, errorEntrySchema, errorReportMetricsSchema, errorReportResponseSchema, fileEnrichmentSchema, fileFailureSchema, graphEdgeSchema, graphEdgeTypeSchema, graphMetadataSchema, graphNodeSchema, graphNodeTypeSchema, graphSummarySchema, graphToolResultSchema, importResolutionMetadataSchema, importResolutionSchema, importTypeSchema, indexErrorReportStatusSchema, indexOutcomeSchema, indexTypeSchema, indexingResponseSchema, logEntrySchema, logLevelSchema, projectInfoSchema, projectListResponseSchema, projectResolveResponseSchema, projectStateSchema, referenceLocationSchema, relationshipFailureSchema, relationshipSummarySchema, serializedAstSchema, symbolEnrichmentSchema, typeInfoSchema, updateErrorReportSchema, warningEntrySchema };
