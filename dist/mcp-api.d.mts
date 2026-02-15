import { z } from 'zod';

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

/**
 * Standardized pagination information
 * Used by all tools that return lists of items
 */
declare const paginationMetadataSchema: z.ZodObject<{
    /** Total number of matching items (before pagination) */
    total: z.ZodNumber;
    /** Number of items returned in this response */
    returned: z.ZodNumber;
    /** Whether more results are available */
    hasMore: z.ZodBoolean;
    /** Offset for the next page (if hasMore is true) */
    nextOffset: z.ZodOptional<z.ZodNumber>;
    /** Current offset (for context) */
    currentOffset: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    total: number;
    returned: number;
    hasMore: boolean;
    nextOffset?: number | undefined;
    currentOffset?: number | undefined;
}, {
    total: number;
    returned: number;
    hasMore: boolean;
    nextOffset?: number | undefined;
    currentOffset?: number | undefined;
}>;
type PaginationMetadata = z.infer<typeof paginationMetadataSchema>;
/**
 * Confidence scoring for heuristic/inferred analysis
 * Used by tools that perform pattern matching, detection, or inference
 */
declare const confidenceScoreSchema: z.ZodObject<{
    /** Overall confidence level (0-1 scale) */
    overall: z.ZodNumber;
    /** Detailed confidence factors */
    factors: z.ZodOptional<z.ZodObject<{
        /** How recent/fresh is the analyzed data (0-1) */
        dataFreshness: z.ZodOptional<z.ZodNumber>;
        /** How complete is the analysis coverage (0-1) */
        coverageComplete: z.ZodOptional<z.ZodNumber>;
        /** Accuracy of heuristic pattern matching (0-1) */
        heuristicAccuracy: z.ZodOptional<z.ZodNumber>;
        /** Semantic analysis depth (0-1) */
        semanticAnalysisDepth: z.ZodOptional<z.ZodNumber>;
        /** Pattern match quality (0-1) */
        patternMatchQuality: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        dataFreshness?: number | undefined;
        coverageComplete?: number | undefined;
        heuristicAccuracy?: number | undefined;
        semanticAnalysisDepth?: number | undefined;
        patternMatchQuality?: number | undefined;
    }, {
        dataFreshness?: number | undefined;
        coverageComplete?: number | undefined;
        heuristicAccuracy?: number | undefined;
        semanticAnalysisDepth?: number | undefined;
        patternMatchQuality?: number | undefined;
    }>>;
    /** Known limitations or warnings about the analysis */
    warnings: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    /** Recommendations for improving confidence */
    recommendations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    overall: number;
    factors?: {
        dataFreshness?: number | undefined;
        coverageComplete?: number | undefined;
        heuristicAccuracy?: number | undefined;
        semanticAnalysisDepth?: number | undefined;
        patternMatchQuality?: number | undefined;
    } | undefined;
    warnings?: string[] | undefined;
    recommendations?: string[] | undefined;
}, {
    overall: number;
    factors?: {
        dataFreshness?: number | undefined;
        coverageComplete?: number | undefined;
        heuristicAccuracy?: number | undefined;
        semanticAnalysisDepth?: number | undefined;
        patternMatchQuality?: number | undefined;
    } | undefined;
    warnings?: string[] | undefined;
    recommendations?: string[] | undefined;
}>;
type ConfidenceScore = z.infer<typeof confidenceScoreSchema>;
/**
 * Data quality indicators
 * Provides transparency about analysis quality and limitations
 */
declare const dataQualityMetadataSchema: z.ZodObject<{
    /** Overall data quality score (0-100) */
    qualityScore: z.ZodOptional<z.ZodNumber>;
    /** When was this data last updated/analyzed */
    lastUpdated: z.ZodOptional<z.ZodString>;
    /** Whether this data is from cache or fresh analysis */
    cached: z.ZodOptional<z.ZodBoolean>;
    /** How long the analysis took (milliseconds) */
    executionTime: z.ZodOptional<z.ZodNumber>;
    /** Percentage of codebase analyzed (0-100) */
    coveragePercentage: z.ZodOptional<z.ZodNumber>;
    /** Any data quality issues or limitations */
    issues: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    issues?: string[] | undefined;
    qualityScore?: number | undefined;
    lastUpdated?: string | undefined;
    cached?: boolean | undefined;
    executionTime?: number | undefined;
    coveragePercentage?: number | undefined;
}, {
    issues?: string[] | undefined;
    qualityScore?: number | undefined;
    lastUpdated?: string | undefined;
    cached?: boolean | undefined;
    executionTime?: number | undefined;
    coveragePercentage?: number | undefined;
}>;
type DataQualityMetadata = z.infer<typeof dataQualityMetadataSchema>;
/**
 * Language-specific metadata container
 * Allows tools to be language-agnostic while still supporting language-specific features
 */
declare const languageMetadataSchema: z.ZodObject<{
    /** Programming language identifier */
    language: z.ZodString;
    /** Language-specific features/modifiers */
    features: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    /** Language-specific visibility rules */
    visibility: z.ZodOptional<z.ZodString>;
    /** Decorators, annotations, attributes */
    decorators: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    /** Language-specific type information (stored as JSON) */
    typeInfo: z.ZodOptional<z.ZodAny>;
    /** Additional language-specific metadata */
    custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    language: string;
    features?: string[] | undefined;
    visibility?: string | undefined;
    decorators?: string[] | undefined;
    typeInfo?: any;
    custom?: Record<string, any> | undefined;
}, {
    language: string;
    features?: string[] | undefined;
    visibility?: string | undefined;
    decorators?: string[] | undefined;
    typeInfo?: any;
    custom?: Record<string, any> | undefined;
}>;
type LanguageMetadata = z.infer<typeof languageMetadataSchema>;
/**
 * Language-agnostic symbol kind categories
 * Use strings instead of enums for maximum extensibility
 */
declare const symbolKindCategorySchema: z.ZodEnum<["function", "class", "interface", "type", "variable", "constant", "enum", "module", "namespace", "method", "property", "parameter", "constructor", "decorator", "trait", "struct", "macro", "unknown"]>;
type SymbolKindCategory = z.infer<typeof symbolKindCategorySchema>;
/**
 * Risk level enum used across multiple tools
 */
declare const riskLevelSchema: z.ZodEnum<["low", "medium", "high", "critical"]>;
type RiskLevel = z.infer<typeof riskLevelSchema>;
/**
 * File location reference (language-agnostic)
 */
declare const fileLocationSchema: z.ZodObject<{
    /** File path (relative to project root) */
    filePath: z.ZodString;
    /** Optional line number */
    line: z.ZodOptional<z.ZodNumber>;
    /** Optional line range start */
    lineStart: z.ZodOptional<z.ZodNumber>;
    /** Optional line range end */
    lineEnd: z.ZodOptional<z.ZodNumber>;
    /** Optional column number */
    column: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    line?: number | undefined;
    lineStart?: number | undefined;
    lineEnd?: number | undefined;
    column?: number | undefined;
}, {
    filePath: string;
    line?: number | undefined;
    lineStart?: number | undefined;
    lineEnd?: number | undefined;
    column?: number | undefined;
}>;
type FileLocation = z.infer<typeof fileLocationSchema>;
/**
 * Symbol reference (language-agnostic)
 */
declare const symbolReferenceSchema: z.ZodObject<{
    /** File path (relative to project root) */
    filePath: z.ZodString;
    /** Optional line number */
    line: z.ZodOptional<z.ZodNumber>;
    /** Optional line range start */
    lineStart: z.ZodOptional<z.ZodNumber>;
    /** Optional line range end */
    lineEnd: z.ZodOptional<z.ZodNumber>;
    /** Optional column number */
    column: z.ZodOptional<z.ZodNumber>;
} & {
    /** Symbol identifier */
    symbolId: z.ZodOptional<z.ZodString>;
    /** Symbol name */
    symbolName: z.ZodOptional<z.ZodString>;
    /** Symbol kind category */
    symbolKind: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    line?: number | undefined;
    lineStart?: number | undefined;
    lineEnd?: number | undefined;
    column?: number | undefined;
    symbolId?: string | undefined;
    symbolName?: string | undefined;
    symbolKind?: string | undefined;
}, {
    filePath: string;
    line?: number | undefined;
    lineStart?: number | undefined;
    lineEnd?: number | undefined;
    column?: number | undefined;
    symbolId?: string | undefined;
    symbolName?: string | undefined;
    symbolKind?: string | undefined;
}>;
type SymbolReference = z.infer<typeof symbolReferenceSchema>;
/**
 * Standardized relationship direction pattern
 * All relationships use X (outgoing) and XBy (incoming) naming
 */
declare const relationshipDirectionsSchema: <T extends z.ZodTypeAny>(itemSchema: T) => z.ZodObject<{
    /** Outgoing relationship: this item relates TO these items */
    outgoing: z.ZodArray<T, "many">;
    /** Incoming relationship: these items relate TO this item */
    incoming: z.ZodArray<T, "many">;
}, "strip", z.ZodTypeAny, {
    outgoing: T["_output"][];
    incoming: T["_output"][];
}, {
    outgoing: T["_input"][];
    incoming: T["_input"][];
}>;
declare const stringRelationshipDirectionsSchema: z.ZodObject<{
    outgoing: z.ZodArray<z.ZodString, "many">;
    incoming: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    outgoing: string[];
    incoming: string[];
}, {
    outgoing: string[];
    incoming: string[];
}>;
type RelationshipDirections<T = string> = {
    outgoing: T[];
    incoming: T[];
};
/**
 * Standard graph node
 */
declare const standardGraphNodeSchema: z.ZodObject<{
    /** Unique node identifier */
    id: z.ZodString;
    /** Display name */
    name: z.ZodString;
    /** Node type/category */
    type: z.ZodString;
    /** Additional properties */
    properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    type: string;
    id: string;
    name: string;
    properties?: Record<string, any> | undefined;
}, {
    type: string;
    id: string;
    name: string;
    properties?: Record<string, any> | undefined;
}>;
type StandardGraphNode = z.infer<typeof standardGraphNodeSchema>;
/**
 * Standard graph edge
 */
declare const standardGraphEdgeSchema: z.ZodObject<{
    /** Source node ID */
    from: z.ZodString;
    /** Target node ID */
    to: z.ZodString;
    /** Edge type/label */
    type: z.ZodOptional<z.ZodString>;
    /** Edge weight (for weighted graphs) */
    weight: z.ZodOptional<z.ZodNumber>;
    /** Additional properties */
    properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    from: string;
    to: string;
    type?: string | undefined;
    properties?: Record<string, any> | undefined;
    weight?: number | undefined;
}, {
    from: string;
    to: string;
    type?: string | undefined;
    properties?: Record<string, any> | undefined;
    weight?: number | undefined;
}>;
type StandardGraphEdge = z.infer<typeof standardGraphEdgeSchema>;
/**
 * Graph representation structure
 * Used by tools that provide graph visualizations
 */
declare const graphRepresentationSchema: z.ZodObject<{
    /** Graph nodes */
    nodes: z.ZodArray<z.ZodObject<{
        /** Unique node identifier */
        id: z.ZodString;
        /** Display name */
        name: z.ZodString;
        /** Node type/category */
        type: z.ZodString;
        /** Additional properties */
        properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        id: string;
        name: string;
        properties?: Record<string, any> | undefined;
    }, {
        type: string;
        id: string;
        name: string;
        properties?: Record<string, any> | undefined;
    }>, "many">;
    /** Graph edges */
    edges: z.ZodArray<z.ZodObject<{
        /** Source node ID */
        from: z.ZodString;
        /** Target node ID */
        to: z.ZodString;
        /** Edge type/label */
        type: z.ZodOptional<z.ZodString>;
        /** Edge weight (for weighted graphs) */
        weight: z.ZodOptional<z.ZodNumber>;
        /** Additional properties */
        properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        from: string;
        to: string;
        type?: string | undefined;
        properties?: Record<string, any> | undefined;
        weight?: number | undefined;
    }, {
        from: string;
        to: string;
        type?: string | undefined;
        properties?: Record<string, any> | undefined;
        weight?: number | undefined;
    }>, "many">;
    /** Optional metadata about the graph */
    metadata: z.ZodOptional<z.ZodObject<{
        /** Number of nodes */
        nodeCount: z.ZodNumber;
        /** Number of edges */
        edgeCount: z.ZodNumber;
        /** Whether this is a directed graph */
        directed: z.ZodBoolean;
        /** Whether this graph contains cycles */
        hasCycles: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        nodeCount: number;
        edgeCount: number;
        directed: boolean;
        hasCycles?: boolean | undefined;
    }, {
        nodeCount: number;
        edgeCount: number;
        directed: boolean;
        hasCycles?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    nodes: {
        type: string;
        id: string;
        name: string;
        properties?: Record<string, any> | undefined;
    }[];
    edges: {
        from: string;
        to: string;
        type?: string | undefined;
        properties?: Record<string, any> | undefined;
        weight?: number | undefined;
    }[];
    metadata?: {
        nodeCount: number;
        edgeCount: number;
        directed: boolean;
        hasCycles?: boolean | undefined;
    } | undefined;
}, {
    nodes: {
        type: string;
        id: string;
        name: string;
        properties?: Record<string, any> | undefined;
    }[];
    edges: {
        from: string;
        to: string;
        type?: string | undefined;
        properties?: Record<string, any> | undefined;
        weight?: number | undefined;
    }[];
    metadata?: {
        nodeCount: number;
        edgeCount: number;
        directed: boolean;
        hasCycles?: boolean | undefined;
    } | undefined;
}>;
type GraphRepresentation = z.infer<typeof graphRepresentationSchema>;
/**
 * Multi-language test file detection patterns
 * Extensible pattern matching for identifying test files across languages
 */
declare const TEST_PATTERNS: Record<string, RegExp>;
/**
 * Multi-language entry point detection patterns
 * Common entry point file names across different languages
 */
declare const ENTRY_POINT_PATTERNS: Record<string, RegExp[]>;

/**
 * API Response Schema
 *
 * Standardized wrapper for all MCP tool responses.
 */

/**
 * Generic API response wrapper schema factory
 */
declare const apiResponseSchema: <T extends z.ZodTypeAny>(dataSchema: T) => z.ZodObject<{
    success: z.ZodLiteral<true>;
    data: T;
}, "strip", z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    success: z.ZodLiteral<true>;
    data: T;
}>, any> extends infer T_1 ? { [k in keyof T_1]: T_1[k]; } : never, z.baseObjectInputType<{
    success: z.ZodLiteral<true>;
    data: T;
}> extends infer T_2 ? { [k_1 in keyof T_2]: T_2[k_1]; } : never>;
/**
 * API error response schema
 */
declare const apiErrorResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<false>;
    error: z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodAny>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        message: string;
        details?: any;
    }, {
        code: string;
        message: string;
        details?: any;
    }>;
}, "strip", z.ZodTypeAny, {
    success: false;
    error: {
        code: string;
        message: string;
        details?: any;
    };
}, {
    success: false;
    error: {
        code: string;
        message: string;
        details?: any;
    };
}>;
/**
 * Generic API response type
 */
type ApiResponse<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: {
        code: string;
        message: string;
        details?: any;
    };
};
/**
 * Type guard to check if response is successful
 */
declare function isSuccessResponse<T>(response: ApiResponse<T>): response is {
    success: true;
    data: T;
};
/**
 * Type guard to check if response is an error
 */
declare function isErrorResponse<T>(response: ApiResponse<T>): response is {
    success: false;
    error: {
        code: string;
        message: string;
        details?: any;
    };
};

/**
 * Search Symbols Tool Schemas
 *
 * Zod schemas for the search_symbols MCP tool.
 * Enables searching for functions, classes, types, etc. across the codebase.
 */

/**
 * Input parameters schema for symbol search
 */
declare const searchSymbolsParamsSchema: z.ZodObject<{
    /** Name or pattern to search for (max: 200 chars) */
    query: z.ZodString;
    /** Filter by symbol type (use strings for language-agnostic extensibility) */
    filterByKind: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    /** Filter by access modifier (public, private, protected) */
    filterByVisibility: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    /** Only return exported symbols */
    isExported: z.ZodOptional<z.ZodBoolean>;
    /** Filter results to file paths matching this pattern (supports glob and regex) */
    filterByFile: z.ZodOptional<z.ZodString>;
    /** Maximum number of results (default: 50, max: 100) */
    limit: z.ZodDefault<z.ZodNumber>;
    /** Offset for pagination (default: 0) */
    offset: z.ZodDefault<z.ZodNumber>;
    /** Include usage count information */
    includeUsageCount: z.ZodOptional<z.ZodBoolean>;
    /** Include full documentation */
    includeDocumentation: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    query: string;
    limit: number;
    offset: number;
    filterByKind?: string[] | undefined;
    filterByVisibility?: string[] | undefined;
    isExported?: boolean | undefined;
    filterByFile?: string | undefined;
    includeUsageCount?: boolean | undefined;
    includeDocumentation?: boolean | undefined;
}, {
    query: string;
    filterByKind?: string[] | undefined;
    filterByVisibility?: string[] | undefined;
    isExported?: boolean | undefined;
    filterByFile?: string | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
    includeUsageCount?: boolean | undefined;
    includeDocumentation?: boolean | undefined;
}>;
type SearchSymbolsParams = z.infer<typeof searchSymbolsParamsSchema>;
/**
 * Individual symbol result schema
 */
declare const symbolInfoSchema: z.ZodObject<{
    filePath: z.ZodString;
    line: z.ZodOptional<z.ZodNumber>;
    lineStart: z.ZodOptional<z.ZodNumber>;
    lineEnd: z.ZodOptional<z.ZodNumber>;
    column: z.ZodOptional<z.ZodNumber>;
} & {
    /** Unique symbol identifier */
    id: z.ZodString;
    /** Symbol name */
    name: z.ZodString;
    /** Fully qualified name (e.g., file.class.method) */
    qualifiedName: z.ZodString;
    /** Type of symbol (language-agnostic string) */
    kind: z.ZodString;
    /** Full function/method signature */
    signature: z.ZodOptional<z.ZodString>;
    /** Documentation/docstring (if includeDocumentation=true) */
    documentation: z.ZodOptional<z.ZodString>;
    /** Access modifier */
    visibility: z.ZodOptional<z.ZodString>;
    /** Whether the symbol is exported */
    isExported: z.ZodBoolean;
    /** Number of places that use this symbol (if includeUsageCount=true) */
    usageCount: z.ZodOptional<z.ZodNumber>;
    /** Language-specific metadata */
    languageMetadata: z.ZodOptional<z.ZodObject<{
        language: z.ZodString;
        features: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        visibility: z.ZodOptional<z.ZodString>;
        decorators: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        typeInfo: z.ZodOptional<z.ZodAny>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        language: string;
        features?: string[] | undefined;
        visibility?: string | undefined;
        decorators?: string[] | undefined;
        typeInfo?: any;
        custom?: Record<string, any> | undefined;
    }, {
        language: string;
        features?: string[] | undefined;
        visibility?: string | undefined;
        decorators?: string[] | undefined;
        typeInfo?: any;
        custom?: Record<string, any> | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    id: string;
    name: string;
    isExported: boolean;
    qualifiedName: string;
    kind: string;
    visibility?: string | undefined;
    line?: number | undefined;
    lineStart?: number | undefined;
    lineEnd?: number | undefined;
    column?: number | undefined;
    signature?: string | undefined;
    documentation?: string | undefined;
    usageCount?: number | undefined;
    languageMetadata?: {
        language: string;
        features?: string[] | undefined;
        visibility?: string | undefined;
        decorators?: string[] | undefined;
        typeInfo?: any;
        custom?: Record<string, any> | undefined;
    } | undefined;
}, {
    filePath: string;
    id: string;
    name: string;
    isExported: boolean;
    qualifiedName: string;
    kind: string;
    visibility?: string | undefined;
    line?: number | undefined;
    lineStart?: number | undefined;
    lineEnd?: number | undefined;
    column?: number | undefined;
    signature?: string | undefined;
    documentation?: string | undefined;
    usageCount?: number | undefined;
    languageMetadata?: {
        language: string;
        features?: string[] | undefined;
        visibility?: string | undefined;
        decorators?: string[] | undefined;
        typeInfo?: any;
        custom?: Record<string, any> | undefined;
    } | undefined;
}>;
type SymbolInfo = z.infer<typeof symbolInfoSchema>;
/**
 * Search symbols result schema
 */
declare const searchSymbolsResultSchema: z.ZodObject<{
    /** Array of matching symbols */
    symbols: z.ZodArray<z.ZodObject<{
        filePath: z.ZodString;
        line: z.ZodOptional<z.ZodNumber>;
        lineStart: z.ZodOptional<z.ZodNumber>;
        lineEnd: z.ZodOptional<z.ZodNumber>;
        column: z.ZodOptional<z.ZodNumber>;
    } & {
        /** Unique symbol identifier */
        id: z.ZodString;
        /** Symbol name */
        name: z.ZodString;
        /** Fully qualified name (e.g., file.class.method) */
        qualifiedName: z.ZodString;
        /** Type of symbol (language-agnostic string) */
        kind: z.ZodString;
        /** Full function/method signature */
        signature: z.ZodOptional<z.ZodString>;
        /** Documentation/docstring (if includeDocumentation=true) */
        documentation: z.ZodOptional<z.ZodString>;
        /** Access modifier */
        visibility: z.ZodOptional<z.ZodString>;
        /** Whether the symbol is exported */
        isExported: z.ZodBoolean;
        /** Number of places that use this symbol (if includeUsageCount=true) */
        usageCount: z.ZodOptional<z.ZodNumber>;
        /** Language-specific metadata */
        languageMetadata: z.ZodOptional<z.ZodObject<{
            language: z.ZodString;
            features: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            visibility: z.ZodOptional<z.ZodString>;
            decorators: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            typeInfo: z.ZodOptional<z.ZodAny>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        }, "strip", z.ZodTypeAny, {
            language: string;
            features?: string[] | undefined;
            visibility?: string | undefined;
            decorators?: string[] | undefined;
            typeInfo?: any;
            custom?: Record<string, any> | undefined;
        }, {
            language: string;
            features?: string[] | undefined;
            visibility?: string | undefined;
            decorators?: string[] | undefined;
            typeInfo?: any;
            custom?: Record<string, any> | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        filePath: string;
        id: string;
        name: string;
        isExported: boolean;
        qualifiedName: string;
        kind: string;
        visibility?: string | undefined;
        line?: number | undefined;
        lineStart?: number | undefined;
        lineEnd?: number | undefined;
        column?: number | undefined;
        signature?: string | undefined;
        documentation?: string | undefined;
        usageCount?: number | undefined;
        languageMetadata?: {
            language: string;
            features?: string[] | undefined;
            visibility?: string | undefined;
            decorators?: string[] | undefined;
            typeInfo?: any;
            custom?: Record<string, any> | undefined;
        } | undefined;
    }, {
        filePath: string;
        id: string;
        name: string;
        isExported: boolean;
        qualifiedName: string;
        kind: string;
        visibility?: string | undefined;
        line?: number | undefined;
        lineStart?: number | undefined;
        lineEnd?: number | undefined;
        column?: number | undefined;
        signature?: string | undefined;
        documentation?: string | undefined;
        usageCount?: number | undefined;
        languageMetadata?: {
            language: string;
            features?: string[] | undefined;
            visibility?: string | undefined;
            decorators?: string[] | undefined;
            typeInfo?: any;
            custom?: Record<string, any> | undefined;
        } | undefined;
    }>, "many">;
    /** Pagination information */
    pagination: z.ZodOptional<z.ZodObject<{
        total: z.ZodNumber;
        returned: z.ZodNumber;
        hasMore: z.ZodBoolean;
        nextOffset: z.ZodOptional<z.ZodNumber>;
        currentOffset: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        total: number;
        returned: number;
        hasMore: boolean;
        nextOffset?: number | undefined;
        currentOffset?: number | undefined;
    }, {
        total: number;
        returned: number;
        hasMore: boolean;
        nextOffset?: number | undefined;
        currentOffset?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    symbols: {
        filePath: string;
        id: string;
        name: string;
        isExported: boolean;
        qualifiedName: string;
        kind: string;
        visibility?: string | undefined;
        line?: number | undefined;
        lineStart?: number | undefined;
        lineEnd?: number | undefined;
        column?: number | undefined;
        signature?: string | undefined;
        documentation?: string | undefined;
        usageCount?: number | undefined;
        languageMetadata?: {
            language: string;
            features?: string[] | undefined;
            visibility?: string | undefined;
            decorators?: string[] | undefined;
            typeInfo?: any;
            custom?: Record<string, any> | undefined;
        } | undefined;
    }[];
    pagination?: {
        total: number;
        returned: number;
        hasMore: boolean;
        nextOffset?: number | undefined;
        currentOffset?: number | undefined;
    } | undefined;
}, {
    symbols: {
        filePath: string;
        id: string;
        name: string;
        isExported: boolean;
        qualifiedName: string;
        kind: string;
        visibility?: string | undefined;
        line?: number | undefined;
        lineStart?: number | undefined;
        lineEnd?: number | undefined;
        column?: number | undefined;
        signature?: string | undefined;
        documentation?: string | undefined;
        usageCount?: number | undefined;
        languageMetadata?: {
            language: string;
            features?: string[] | undefined;
            visibility?: string | undefined;
            decorators?: string[] | undefined;
            typeInfo?: any;
            custom?: Record<string, any> | undefined;
        } | undefined;
    }[];
    pagination?: {
        total: number;
        returned: number;
        hasMore: boolean;
        nextOffset?: number | undefined;
        currentOffset?: number | undefined;
    } | undefined;
}>;
type SearchSymbolsResult = z.infer<typeof searchSymbolsResultSchema>;

/**
 * Get Symbol Details Tool Schemas
 *
 * Zod schemas for the get_symbol_details MCP tool.
 * Provides detailed information about a specific symbol including references and relationships.
 */

/**
 * Input parameters schema for symbol details
 */
declare const getSymbolDetailsParamsSchema: z.ZodObject<{
    /** Symbol ID if known */
    symbolId: z.ZodOptional<z.ZodString>;
    /** Search by symbol name (requires filePath) */
    symbolName: z.ZodOptional<z.ZodString>;
    /** Narrow search to specific file */
    filePath: z.ZodOptional<z.ZodString>;
    /** Include all usage locations */
    includeReferences: z.ZodOptional<z.ZodBoolean>;
    /** Include calls, inheritance, etc. */
    includeRelationships: z.ZodOptional<z.ZodBoolean>;
    /** Include impact scoring */
    includeImpactScore: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    filePath?: string | undefined;
    symbolId?: string | undefined;
    symbolName?: string | undefined;
    includeReferences?: boolean | undefined;
    includeRelationships?: boolean | undefined;
    includeImpactScore?: boolean | undefined;
}, {
    filePath?: string | undefined;
    symbolId?: string | undefined;
    symbolName?: string | undefined;
    includeReferences?: boolean | undefined;
    includeRelationships?: boolean | undefined;
    includeImpactScore?: boolean | undefined;
}>;
type GetSymbolDetailsParams = z.infer<typeof getSymbolDetailsParamsSchema>;
/**
 * Detailed symbol information schema
 */
declare const symbolDetailsSchema: z.ZodObject<{
    filePath: z.ZodString;
    line: z.ZodOptional<z.ZodNumber>;
    lineStart: z.ZodOptional<z.ZodNumber>;
    lineEnd: z.ZodOptional<z.ZodNumber>;
    column: z.ZodOptional<z.ZodNumber>;
} & {
    /** Unique symbol identifier */
    id: z.ZodString;
    /** Symbol name */
    name: z.ZodString;
    /** Fully qualified name */
    qualifiedName: z.ZodString;
    /** Type of symbol (language-agnostic string) */
    kind: z.ZodString;
    /** Full signature (for functions/methods) */
    signature: z.ZodOptional<z.ZodString>;
    /** Documentation/docstring */
    documentation: z.ZodOptional<z.ZodString>;
    /** Access modifier */
    visibility: z.ZodOptional<z.ZodString>;
    /** Symbol modifiers (static, abstract, async, etc.) */
    modifiers: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    /** Type information */
    typeInfo: z.ZodOptional<z.ZodAny>;
    /** Decorators/annotations */
    decorators: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    /** Whether the symbol is exported */
    isExported: z.ZodBoolean;
    /** Whether marked as deprecated */
    isDeprecated: z.ZodBoolean;
    /** Language-specific metadata */
    languageMetadata: z.ZodOptional<z.ZodObject<{
        language: z.ZodString;
        features: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        visibility: z.ZodOptional<z.ZodString>;
        decorators: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        typeInfo: z.ZodOptional<z.ZodAny>;
        custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, "strip", z.ZodTypeAny, {
        language: string;
        features?: string[] | undefined;
        visibility?: string | undefined;
        decorators?: string[] | undefined;
        typeInfo?: any;
        custom?: Record<string, any> | undefined;
    }, {
        language: string;
        features?: string[] | undefined;
        visibility?: string | undefined;
        decorators?: string[] | undefined;
        typeInfo?: any;
        custom?: Record<string, any> | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    id: string;
    name: string;
    isExported: boolean;
    qualifiedName: string;
    kind: string;
    isDeprecated: boolean;
    visibility?: string | undefined;
    decorators?: string[] | undefined;
    typeInfo?: any;
    line?: number | undefined;
    lineStart?: number | undefined;
    lineEnd?: number | undefined;
    column?: number | undefined;
    signature?: string | undefined;
    documentation?: string | undefined;
    languageMetadata?: {
        language: string;
        features?: string[] | undefined;
        visibility?: string | undefined;
        decorators?: string[] | undefined;
        typeInfo?: any;
        custom?: Record<string, any> | undefined;
    } | undefined;
    modifiers?: string[] | undefined;
}, {
    filePath: string;
    id: string;
    name: string;
    isExported: boolean;
    qualifiedName: string;
    kind: string;
    isDeprecated: boolean;
    visibility?: string | undefined;
    decorators?: string[] | undefined;
    typeInfo?: any;
    line?: number | undefined;
    lineStart?: number | undefined;
    lineEnd?: number | undefined;
    column?: number | undefined;
    signature?: string | undefined;
    documentation?: string | undefined;
    languageMetadata?: {
        language: string;
        features?: string[] | undefined;
        visibility?: string | undefined;
        decorators?: string[] | undefined;
        typeInfo?: any;
        custom?: Record<string, any> | undefined;
    } | undefined;
    modifiers?: string[] | undefined;
}>;
type SymbolDetails = z.infer<typeof symbolDetailsSchema>;
/**
 * Symbol reference/usage location schema
 */
declare const symbolUsageReferenceSchema: z.ZodObject<{
    filePath: z.ZodString;
    line: z.ZodOptional<z.ZodNumber>;
    lineStart: z.ZodOptional<z.ZodNumber>;
    lineEnd: z.ZodOptional<z.ZodNumber>;
    column: z.ZodOptional<z.ZodNumber>;
} & {
    /** Type of usage */
    usageType: z.ZodString;
    /** Additional context */
    context: z.ZodOptional<z.ZodString>;
    /** Alias if renamed on import */
    aliasName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    usageType: string;
    line?: number | undefined;
    lineStart?: number | undefined;
    lineEnd?: number | undefined;
    column?: number | undefined;
    context?: string | undefined;
    aliasName?: string | undefined;
}, {
    filePath: string;
    usageType: string;
    line?: number | undefined;
    lineStart?: number | undefined;
    lineEnd?: number | undefined;
    column?: number | undefined;
    context?: string | undefined;
    aliasName?: string | undefined;
}>;
type SymbolUsageReference = z.infer<typeof symbolUsageReferenceSchema>;
/**
 * Symbol relationships (bidirectional) schema
 */
declare const symbolRelationshipsSchema: z.ZodObject<{
    /** Symbols this calls */
    calls: z.ZodArray<z.ZodString, "many">;
    /** Symbols that call this */
    calledBy: z.ZodArray<z.ZodString, "many">;
    /** Parent classes/interfaces */
    inheritsFrom: z.ZodArray<z.ZodString, "many">;
    /** Child classes */
    inheritedBy: z.ZodArray<z.ZodString, "many">;
    /** Nested symbols (methods, properties) */
    children: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    calls: string[];
    calledBy: string[];
    inheritsFrom: string[];
    inheritedBy: string[];
    children: string[];
}, {
    calls: string[];
    calledBy: string[];
    inheritsFrom: string[];
    inheritedBy: string[];
    children: string[];
}>;
type SymbolRelationships = z.infer<typeof symbolRelationshipsSchema>;
/**
 * Impact scoring for understanding change risk schema
 */
declare const impactScoreSchema: z.ZodObject<{
    /** Direct usage count */
    directUsage: z.ZodNumber;
    /** Transitive impact score */
    transitiveImpact: z.ZodNumber;
    /** Risk score for making changes (0-100) */
    riskScore: z.ZodNumber;
    /** Risk level category */
    riskLevel: z.ZodEnum<["low", "medium", "high", "critical"]>;
}, "strip", z.ZodTypeAny, {
    directUsage: number;
    transitiveImpact: number;
    riskScore: number;
    riskLevel: "low" | "medium" | "high" | "critical";
}, {
    directUsage: number;
    transitiveImpact: number;
    riskScore: number;
    riskLevel: "low" | "medium" | "high" | "critical";
}>;
type ImpactScore = z.infer<typeof impactScoreSchema>;
/**
 * Symbol details result schema
 */
declare const symbolDetailsResultSchema: z.ZodObject<{
    /** Symbol information */
    symbol: z.ZodObject<{
        filePath: z.ZodString;
        line: z.ZodOptional<z.ZodNumber>;
        lineStart: z.ZodOptional<z.ZodNumber>;
        lineEnd: z.ZodOptional<z.ZodNumber>;
        column: z.ZodOptional<z.ZodNumber>;
    } & {
        /** Unique symbol identifier */
        id: z.ZodString;
        /** Symbol name */
        name: z.ZodString;
        /** Fully qualified name */
        qualifiedName: z.ZodString;
        /** Type of symbol (language-agnostic string) */
        kind: z.ZodString;
        /** Full signature (for functions/methods) */
        signature: z.ZodOptional<z.ZodString>;
        /** Documentation/docstring */
        documentation: z.ZodOptional<z.ZodString>;
        /** Access modifier */
        visibility: z.ZodOptional<z.ZodString>;
        /** Symbol modifiers (static, abstract, async, etc.) */
        modifiers: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Type information */
        typeInfo: z.ZodOptional<z.ZodAny>;
        /** Decorators/annotations */
        decorators: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Whether the symbol is exported */
        isExported: z.ZodBoolean;
        /** Whether marked as deprecated */
        isDeprecated: z.ZodBoolean;
        /** Language-specific metadata */
        languageMetadata: z.ZodOptional<z.ZodObject<{
            language: z.ZodString;
            features: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            visibility: z.ZodOptional<z.ZodString>;
            decorators: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            typeInfo: z.ZodOptional<z.ZodAny>;
            custom: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        }, "strip", z.ZodTypeAny, {
            language: string;
            features?: string[] | undefined;
            visibility?: string | undefined;
            decorators?: string[] | undefined;
            typeInfo?: any;
            custom?: Record<string, any> | undefined;
        }, {
            language: string;
            features?: string[] | undefined;
            visibility?: string | undefined;
            decorators?: string[] | undefined;
            typeInfo?: any;
            custom?: Record<string, any> | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        filePath: string;
        id: string;
        name: string;
        isExported: boolean;
        qualifiedName: string;
        kind: string;
        isDeprecated: boolean;
        visibility?: string | undefined;
        decorators?: string[] | undefined;
        typeInfo?: any;
        line?: number | undefined;
        lineStart?: number | undefined;
        lineEnd?: number | undefined;
        column?: number | undefined;
        signature?: string | undefined;
        documentation?: string | undefined;
        languageMetadata?: {
            language: string;
            features?: string[] | undefined;
            visibility?: string | undefined;
            decorators?: string[] | undefined;
            typeInfo?: any;
            custom?: Record<string, any> | undefined;
        } | undefined;
        modifiers?: string[] | undefined;
    }, {
        filePath: string;
        id: string;
        name: string;
        isExported: boolean;
        qualifiedName: string;
        kind: string;
        isDeprecated: boolean;
        visibility?: string | undefined;
        decorators?: string[] | undefined;
        typeInfo?: any;
        line?: number | undefined;
        lineStart?: number | undefined;
        lineEnd?: number | undefined;
        column?: number | undefined;
        signature?: string | undefined;
        documentation?: string | undefined;
        languageMetadata?: {
            language: string;
            features?: string[] | undefined;
            visibility?: string | undefined;
            decorators?: string[] | undefined;
            typeInfo?: any;
            custom?: Record<string, any> | undefined;
        } | undefined;
        modifiers?: string[] | undefined;
    }>;
    /** Usage locations (if includeReferences=true) */
    references: z.ZodOptional<z.ZodArray<z.ZodObject<{
        filePath: z.ZodString;
        line: z.ZodOptional<z.ZodNumber>;
        lineStart: z.ZodOptional<z.ZodNumber>;
        lineEnd: z.ZodOptional<z.ZodNumber>;
        column: z.ZodOptional<z.ZodNumber>;
    } & {
        /** Type of usage */
        usageType: z.ZodString;
        /** Additional context */
        context: z.ZodOptional<z.ZodString>;
        /** Alias if renamed on import */
        aliasName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        filePath: string;
        usageType: string;
        line?: number | undefined;
        lineStart?: number | undefined;
        lineEnd?: number | undefined;
        column?: number | undefined;
        context?: string | undefined;
        aliasName?: string | undefined;
    }, {
        filePath: string;
        usageType: string;
        line?: number | undefined;
        lineStart?: number | undefined;
        lineEnd?: number | undefined;
        column?: number | undefined;
        context?: string | undefined;
        aliasName?: string | undefined;
    }>, "many">>;
    /** Relationship information (if includeRelationships=true) */
    relationships: z.ZodOptional<z.ZodObject<{
        /** Symbols this calls */
        calls: z.ZodArray<z.ZodString, "many">;
        /** Symbols that call this */
        calledBy: z.ZodArray<z.ZodString, "many">;
        /** Parent classes/interfaces */
        inheritsFrom: z.ZodArray<z.ZodString, "many">;
        /** Child classes */
        inheritedBy: z.ZodArray<z.ZodString, "many">;
        /** Nested symbols (methods, properties) */
        children: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        calls: string[];
        calledBy: string[];
        inheritsFrom: string[];
        inheritedBy: string[];
        children: string[];
    }, {
        calls: string[];
        calledBy: string[];
        inheritsFrom: string[];
        inheritedBy: string[];
        children: string[];
    }>>;
    /** Impact metrics (if includeImpactScore=true) */
    impactScore: z.ZodOptional<z.ZodObject<{
        /** Direct usage count */
        directUsage: z.ZodNumber;
        /** Transitive impact score */
        transitiveImpact: z.ZodNumber;
        /** Risk score for making changes (0-100) */
        riskScore: z.ZodNumber;
        /** Risk level category */
        riskLevel: z.ZodEnum<["low", "medium", "high", "critical"]>;
    }, "strip", z.ZodTypeAny, {
        directUsage: number;
        transitiveImpact: number;
        riskScore: number;
        riskLevel: "low" | "medium" | "high" | "critical";
    }, {
        directUsage: number;
        transitiveImpact: number;
        riskScore: number;
        riskLevel: "low" | "medium" | "high" | "critical";
    }>>;
}, "strip", z.ZodTypeAny, {
    symbol: {
        filePath: string;
        id: string;
        name: string;
        isExported: boolean;
        qualifiedName: string;
        kind: string;
        isDeprecated: boolean;
        visibility?: string | undefined;
        decorators?: string[] | undefined;
        typeInfo?: any;
        line?: number | undefined;
        lineStart?: number | undefined;
        lineEnd?: number | undefined;
        column?: number | undefined;
        signature?: string | undefined;
        documentation?: string | undefined;
        languageMetadata?: {
            language: string;
            features?: string[] | undefined;
            visibility?: string | undefined;
            decorators?: string[] | undefined;
            typeInfo?: any;
            custom?: Record<string, any> | undefined;
        } | undefined;
        modifiers?: string[] | undefined;
    };
    references?: {
        filePath: string;
        usageType: string;
        line?: number | undefined;
        lineStart?: number | undefined;
        lineEnd?: number | undefined;
        column?: number | undefined;
        context?: string | undefined;
        aliasName?: string | undefined;
    }[] | undefined;
    relationships?: {
        calls: string[];
        calledBy: string[];
        inheritsFrom: string[];
        inheritedBy: string[];
        children: string[];
    } | undefined;
    impactScore?: {
        directUsage: number;
        transitiveImpact: number;
        riskScore: number;
        riskLevel: "low" | "medium" | "high" | "critical";
    } | undefined;
}, {
    symbol: {
        filePath: string;
        id: string;
        name: string;
        isExported: boolean;
        qualifiedName: string;
        kind: string;
        isDeprecated: boolean;
        visibility?: string | undefined;
        decorators?: string[] | undefined;
        typeInfo?: any;
        line?: number | undefined;
        lineStart?: number | undefined;
        lineEnd?: number | undefined;
        column?: number | undefined;
        signature?: string | undefined;
        documentation?: string | undefined;
        languageMetadata?: {
            language: string;
            features?: string[] | undefined;
            visibility?: string | undefined;
            decorators?: string[] | undefined;
            typeInfo?: any;
            custom?: Record<string, any> | undefined;
        } | undefined;
        modifiers?: string[] | undefined;
    };
    references?: {
        filePath: string;
        usageType: string;
        line?: number | undefined;
        lineStart?: number | undefined;
        lineEnd?: number | undefined;
        column?: number | undefined;
        context?: string | undefined;
        aliasName?: string | undefined;
    }[] | undefined;
    relationships?: {
        calls: string[];
        calledBy: string[];
        inheritsFrom: string[];
        inheritedBy: string[];
        children: string[];
    } | undefined;
    impactScore?: {
        directUsage: number;
        transitiveImpact: number;
        riskScore: number;
        riskLevel: "low" | "medium" | "high" | "critical";
    } | undefined;
}>;
type SymbolDetailsResult = z.infer<typeof symbolDetailsResultSchema>;

/**
 * Get Dependencies Tool Schemas
 *
 * Zod schemas for the get_dependencies MCP tool.
 * Understands what a file depends on (direct and transitive dependencies).
 */

/**
 * Input parameters schema for get dependencies
 */
declare const getDependenciesParamsSchema: z.ZodObject<{
    /** File path to analyze */
    filePath: z.ZodString;
    /** Dependency depth: 1=direct, 2+=transitive, 0=all (max: 10) */
    depth: z.ZodOptional<z.ZodNumber>;
    /** Include external package dependencies */
    includePackages: z.ZodOptional<z.ZodBoolean>;
    /** Show which symbols are imported from each dependency */
    includeSymbols: z.ZodOptional<z.ZodBoolean>;
    /** Maximum number of dependencies to return per page (default: 20, max: 100) */
    limit: z.ZodDefault<z.ZodNumber>;
    /** Offset for pagination (default: 0) */
    offset: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    limit: number;
    offset: number;
    depth?: number | undefined;
    includePackages?: boolean | undefined;
    includeSymbols?: boolean | undefined;
}, {
    filePath: string;
    limit?: number | undefined;
    offset?: number | undefined;
    depth?: number | undefined;
    includePackages?: boolean | undefined;
    includeSymbols?: boolean | undefined;
}>;
type GetDependenciesParams = z.infer<typeof getDependenciesParamsSchema>;
/**
 * Direct dependency (file or module) schema
 */
declare const directDependencySchema: z.ZodObject<{
    /** Dependency type: 'file' for internal files, 'module' for external packages */
    type: z.ZodEnum<["file", "module"]>;
    /** File path (null for external modules) */
    filePath: z.ZodNullable<z.ZodString>;
    /** Module name for external packages (null for internal files) */
    moduleName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    /** Symbols imported from this dependency */
    importedSymbols: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    /** Whether this is a default import */
    isDefault: z.ZodBoolean;
    /** Whether this is a namespace import (import * as X) */
    isNamespace: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    type: "module" | "file";
    filePath: string | null;
    isDefault: boolean;
    isNamespace: boolean;
    moduleName?: string | null | undefined;
    importedSymbols?: string[] | undefined;
}, {
    type: "module" | "file";
    filePath: string | null;
    isDefault: boolean;
    isNamespace: boolean;
    moduleName?: string | null | undefined;
    importedSymbols?: string[] | undefined;
}>;
type DirectDependency = z.infer<typeof directDependencySchema>;
/**
 * Transitive dependency schema
 */
declare const transitiveDependencySchema: z.ZodObject<{
    /** File path */
    filePath: z.ZodString;
    /** Number of hops from source file */
    distance: z.ZodNumber;
    /** Dependency chain showing how it's reached */
    path: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    path: string[];
    filePath: string;
    distance: number;
}, {
    path: string[];
    filePath: string;
    distance: number;
}>;
type TransitiveDependency = z.infer<typeof transitiveDependencySchema>;
/**
 * Package dependency schema
 */
declare const packageDependencySchema: z.ZodObject<{
    /** Package name */
    name: z.ZodString;
    /** Package version if available */
    version: z.ZodOptional<z.ZodString>;
    /** Dependency type */
    type: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    name: string;
    version?: string | undefined;
}, {
    type: string;
    name: string;
    version?: string | undefined;
}>;
type PackageDependency = z.infer<typeof packageDependencySchema>;
/**
 * Dependency metrics schema
 */
declare const dependencyMetricsSchema: z.ZodObject<{
    /** Total number of file dependencies */
    totalFiles: z.ZodNumber;
    /** Total number of package dependencies */
    totalPackages: z.ZodNumber;
    /** Maximum dependency depth */
    maxDepth: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    totalFiles: number;
    totalPackages: number;
    maxDepth: number;
}, {
    totalFiles: number;
    totalPackages: number;
    maxDepth: number;
}>;
type DependencyMetrics = z.infer<typeof dependencyMetricsSchema>;
/**
 * Get dependencies result schema
 */
declare const getDependenciesResultSchema: z.ZodObject<{
    /** Source file being analyzed */
    file: z.ZodString;
    /** Direct (immediate) dependencies */
    directDependencies: z.ZodArray<z.ZodObject<{
        /** Dependency type: 'file' for internal files, 'module' for external packages */
        type: z.ZodEnum<["file", "module"]>;
        /** File path (null for external modules) */
        filePath: z.ZodNullable<z.ZodString>;
        /** Module name for external packages (null for internal files) */
        moduleName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        /** Symbols imported from this dependency */
        importedSymbols: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        /** Whether this is a default import */
        isDefault: z.ZodBoolean;
        /** Whether this is a namespace import (import * as X) */
        isNamespace: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        type: "module" | "file";
        filePath: string | null;
        isDefault: boolean;
        isNamespace: boolean;
        moduleName?: string | null | undefined;
        importedSymbols?: string[] | undefined;
    }, {
        type: "module" | "file";
        filePath: string | null;
        isDefault: boolean;
        isNamespace: boolean;
        moduleName?: string | null | undefined;
        importedSymbols?: string[] | undefined;
    }>, "many">;
    /** Transitive (indirect) dependencies */
    transitiveDependencies: z.ZodOptional<z.ZodArray<z.ZodObject<{
        /** File path */
        filePath: z.ZodString;
        /** Number of hops from source file */
        distance: z.ZodNumber;
        /** Dependency chain showing how it's reached */
        path: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        path: string[];
        filePath: string;
        distance: number;
    }, {
        path: string[];
        filePath: string;
        distance: number;
    }>, "many">>;
    /** External package dependencies */
    packages: z.ZodOptional<z.ZodArray<z.ZodObject<{
        /** Package name */
        name: z.ZodString;
        /** Package version if available */
        version: z.ZodOptional<z.ZodString>;
        /** Dependency type */
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        name: string;
        version?: string | undefined;
    }, {
        type: string;
        name: string;
        version?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    file: string;
    directDependencies: {
        type: "module" | "file";
        filePath: string | null;
        isDefault: boolean;
        isNamespace: boolean;
        moduleName?: string | null | undefined;
        importedSymbols?: string[] | undefined;
    }[];
    transitiveDependencies?: {
        path: string[];
        filePath: string;
        distance: number;
    }[] | undefined;
    packages?: {
        type: string;
        name: string;
        version?: string | undefined;
    }[] | undefined;
}, {
    file: string;
    directDependencies: {
        type: "module" | "file";
        filePath: string | null;
        isDefault: boolean;
        isNamespace: boolean;
        moduleName?: string | null | undefined;
        importedSymbols?: string[] | undefined;
    }[];
    transitiveDependencies?: {
        path: string[];
        filePath: string;
        distance: number;
    }[] | undefined;
    packages?: {
        type: string;
        name: string;
        version?: string | undefined;
    }[] | undefined;
}>;
type GetDependenciesResult = z.infer<typeof getDependenciesResultSchema>;

/**
 * Get Dependents Tool Schemas
 *
 * Zod schemas for the get_dependents MCP tool.
 * Understands what depends on a file (impact analysis).
 */

/**
 * Input parameters schema for get dependents
 */
declare const getDependentsParamsSchema: z.ZodObject<{
    /** File path to analyze */
    filePath: z.ZodString;
    /** Dependency depth for transitive dependents (max: 10) */
    depth: z.ZodOptional<z.ZodNumber>;
    /** Show which symbols are used by each dependent */
    includeSymbols: z.ZodOptional<z.ZodBoolean>;
    /** Include impact metrics and risk assessment */
    includeImpactMetrics: z.ZodOptional<z.ZodBoolean>;
    /** Maximum number of dependents to return per page (default: 20, max: 100) */
    limit: z.ZodDefault<z.ZodNumber>;
    /** Offset for pagination (default: 0) */
    offset: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    limit: number;
    offset: number;
    depth?: number | undefined;
    includeSymbols?: boolean | undefined;
    includeImpactMetrics?: boolean | undefined;
}, {
    filePath: string;
    limit?: number | undefined;
    offset?: number | undefined;
    depth?: number | undefined;
    includeSymbols?: boolean | undefined;
    includeImpactMetrics?: boolean | undefined;
}>;
type GetDependentsParams = z.infer<typeof getDependentsParamsSchema>;
/**
 * Direct dependent (file that directly imports this one) schema
 */
declare const directDependentSchema: z.ZodObject<{
    /** Dependent file path */
    filePath: z.ZodString;
    /** Symbols used from the source file */
    usedSymbols: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    usedSymbols?: string[] | undefined;
}, {
    filePath: string;
    usedSymbols?: string[] | undefined;
}>;
type DirectDependent = z.infer<typeof directDependentSchema>;
/**
 * Transitive dependent (indirect impact) schema
 */
declare const transitiveDependentSchema: z.ZodObject<{
    /** File path */
    filePath: z.ZodString;
    /** Number of hops from source file */
    distance: z.ZodNumber;
    /** Impact chain showing how it's reached */
    path: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    path: string[];
    filePath: string;
    distance: number;
}, {
    path: string[];
    filePath: string;
    distance: number;
}>;
type TransitiveDependent = z.infer<typeof transitiveDependentSchema>;
/**
 * Dependent metrics schema
 */
declare const dependentMetricsSchema: z.ZodObject<{
    /** Total number of dependent files */
    totalFiles: z.ZodNumber;
    /** Maximum dependent depth */
    maxDepth: z.ZodNumber;
    /** Risk level based on dependent count */
    riskLevel: z.ZodEnum<["low", "medium", "high", "critical"]>;
}, "strip", z.ZodTypeAny, {
    riskLevel: "low" | "medium" | "high" | "critical";
    totalFiles: number;
    maxDepth: number;
}, {
    riskLevel: "low" | "medium" | "high" | "critical";
    totalFiles: number;
    maxDepth: number;
}>;
type DependentMetrics = z.infer<typeof dependentMetricsSchema>;
/**
 * Get dependents result schema
 */
declare const getDependentsResultSchema: z.ZodObject<{
    /** Source file being analyzed */
    file: z.ZodString;
    /** Direct (immediate) dependents */
    directDependents: z.ZodArray<z.ZodObject<{
        /** Dependent file path */
        filePath: z.ZodString;
        /** Symbols used from the source file */
        usedSymbols: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        filePath: string;
        usedSymbols?: string[] | undefined;
    }, {
        filePath: string;
        usedSymbols?: string[] | undefined;
    }>, "many">;
    /** Transitive (indirect) dependents */
    transitiveDependents: z.ZodOptional<z.ZodArray<z.ZodObject<{
        /** File path */
        filePath: z.ZodString;
        /** Number of hops from source file */
        distance: z.ZodNumber;
        /** Impact chain showing how it's reached */
        path: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        path: string[];
        filePath: string;
        distance: number;
    }, {
        path: string[];
        filePath: string;
        distance: number;
    }>, "many">>;
    /** Detailed metrics (if includeImpactMetrics=true) */
    detailedMetrics: z.ZodOptional<z.ZodObject<{
        byDepth: z.ZodRecord<z.ZodString, z.ZodNumber>;
        criticalPaths: z.ZodArray<z.ZodArray<z.ZodString, "many">, "many">;
        mostImpactedFiles: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        byDepth: Record<string, number>;
        criticalPaths: string[][];
        mostImpactedFiles: string[];
    }, {
        byDepth: Record<string, number>;
        criticalPaths: string[][];
        mostImpactedFiles: string[];
    }>>;
}, "strip", z.ZodTypeAny, {
    file: string;
    directDependents: {
        filePath: string;
        usedSymbols?: string[] | undefined;
    }[];
    transitiveDependents?: {
        path: string[];
        filePath: string;
        distance: number;
    }[] | undefined;
    detailedMetrics?: {
        byDepth: Record<string, number>;
        criticalPaths: string[][];
        mostImpactedFiles: string[];
    } | undefined;
}, {
    file: string;
    directDependents: {
        filePath: string;
        usedSymbols?: string[] | undefined;
    }[];
    transitiveDependents?: {
        path: string[];
        filePath: string;
        distance: number;
    }[] | undefined;
    detailedMetrics?: {
        byDepth: Record<string, number>;
        criticalPaths: string[][];
        mostImpactedFiles: string[];
    } | undefined;
}>;
type GetDependentsResult = z.infer<typeof getDependentsResultSchema>;

/**
 * Find Circular Dependencies Tool Schemas
 *
 * Zod schemas for the find_circular_dependencies MCP tool.
 * Detects circular dependency cycles in the codebase.
 */

/**
 * Input parameters schema for finding circular dependencies
 */
declare const findCircularDependenciesParamsSchema: z.ZodObject<{
    /** Check if a specific file is involved in any cycles */
    filePath: z.ZodOptional<z.ZodString>;
    /** Filter cycles by minimum length (min: 2, max: 10) */
    minCycleLength: z.ZodOptional<z.ZodNumber>;
    /** Filter cycles by maximum length (min: 2, max: 10) */
    maxCycleLength: z.ZodOptional<z.ZodNumber>;
    /** Maximum number of cycles to return */
    limit: z.ZodDefault<z.ZodNumber>;
    /** Pagination offset */
    offset: z.ZodDefault<z.ZodNumber>;
    /** Include impact scoring for each cycle */
    includeImpactScore: z.ZodOptional<z.ZodBoolean>;
    /** Include confidence assessment */
    includeConfidence: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    offset: number;
    filePath?: string | undefined;
    includeImpactScore?: boolean | undefined;
    minCycleLength?: number | undefined;
    maxCycleLength?: number | undefined;
    includeConfidence?: boolean | undefined;
}, {
    filePath?: string | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
    includeImpactScore?: boolean | undefined;
    minCycleLength?: number | undefined;
    maxCycleLength?: number | undefined;
    includeConfidence?: boolean | undefined;
}>;
type FindCircularDependenciesParams = z.infer<typeof findCircularDependenciesParamsSchema>;
/**
 * Circular dependency cycle schema
 */
declare const circularDependencyCycleSchema: z.ZodObject<{
    /** Files involved in the cycle */
    files: z.ZodArray<z.ZodString, "many">;
    /** Number of files in the cycle */
    length: z.ZodNumber;
    /** Impact score based on file importance (if includeImpactScore=true) */
    impactScore: z.ZodOptional<z.ZodNumber>;
    /** Severity level */
    severity: z.ZodEnum<["low", "medium", "high", "critical"]>;
}, "strip", z.ZodTypeAny, {
    length: number;
    files: string[];
    severity: "low" | "medium" | "high" | "critical";
    impactScore?: number | undefined;
}, {
    length: number;
    files: string[];
    severity: "low" | "medium" | "high" | "critical";
    impactScore?: number | undefined;
}>;
type CircularDependencyCycle = z.infer<typeof circularDependencyCycleSchema>;
/**
 * Find circular dependencies result schema
 */
declare const findCircularDependenciesResultSchema: z.ZodObject<{
    /** Detected circular dependency cycles */
    cycles: z.ZodArray<z.ZodObject<{
        /** Files involved in the cycle */
        files: z.ZodArray<z.ZodString, "many">;
        /** Number of files in the cycle */
        length: z.ZodNumber;
        /** Impact score based on file importance (if includeImpactScore=true) */
        impactScore: z.ZodOptional<z.ZodNumber>;
        /** Severity level */
        severity: z.ZodEnum<["low", "medium", "high", "critical"]>;
    }, "strip", z.ZodTypeAny, {
        length: number;
        files: string[];
        severity: "low" | "medium" | "high" | "critical";
        impactScore?: number | undefined;
    }, {
        length: number;
        files: string[];
        severity: "low" | "medium" | "high" | "critical";
        impactScore?: number | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    cycles: {
        length: number;
        files: string[];
        severity: "low" | "medium" | "high" | "critical";
        impactScore?: number | undefined;
    }[];
}, {
    cycles: {
        length: number;
        files: string[];
        severity: "low" | "medium" | "high" | "critical";
        impactScore?: number | undefined;
    }[];
}>;
type FindCircularDependenciesResult = z.infer<typeof findCircularDependenciesResultSchema>;

/**
 * Trace Symbol Usage Tool Schemas
 *
 * Zod schemas for the trace_symbol_usage MCP tool.
 * Follows where and how a symbol is used across the codebase.
 */

/**
 * Input parameters schema for tracing symbol usage
 */
declare const traceSymbolUsageParamsSchema: z.ZodObject<{
    /** Symbol ID if known */
    symbolId: z.ZodOptional<z.ZodString>;
    /** Symbol name (requires filePath) */
    symbolName: z.ZodOptional<z.ZodString>;
    /** File path where symbol is defined */
    filePath: z.ZodOptional<z.ZodString>;
    /** Filter by specific usage types */
    filterByUsageType: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    /** Filter by relationship type (CALLS, REFERENCES, IMPORTS, etc.) */
    filterByRelationshipType: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    /** Include indirect (transitive) usage */
    includeTransitive: z.ZodOptional<z.ZodBoolean>;
    /** Include usage context (code snippets) */
    includeContext: z.ZodOptional<z.ZodBoolean>;
    /** Exclude test files from results */
    excludeTests: z.ZodOptional<z.ZodBoolean>;
    /** Exclude generated files from results */
    excludeGenerated: z.ZodOptional<z.ZodBoolean>;
    /** Include importance weighting in results */
    includeImportanceWeight: z.ZodOptional<z.ZodBoolean>;
    /** Maximum results to return */
    limit: z.ZodDefault<z.ZodNumber>;
    /** Pagination offset */
    offset: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    offset: number;
    filePath?: string | undefined;
    symbolId?: string | undefined;
    symbolName?: string | undefined;
    filterByUsageType?: string[] | undefined;
    filterByRelationshipType?: string[] | undefined;
    includeTransitive?: boolean | undefined;
    includeContext?: boolean | undefined;
    excludeTests?: boolean | undefined;
    excludeGenerated?: boolean | undefined;
    includeImportanceWeight?: boolean | undefined;
}, {
    filePath?: string | undefined;
    symbolId?: string | undefined;
    symbolName?: string | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
    filterByUsageType?: string[] | undefined;
    filterByRelationshipType?: string[] | undefined;
    includeTransitive?: boolean | undefined;
    includeContext?: boolean | undefined;
    excludeTests?: boolean | undefined;
    excludeGenerated?: boolean | undefined;
    includeImportanceWeight?: boolean | undefined;
}>;
type TraceSymbolUsageParams = z.infer<typeof traceSymbolUsageParamsSchema>;
/**
 * Symbol reference for tracing schema
 */
declare const tracedSymbolSchema: z.ZodObject<{
    /** Symbol being traced */
    name: z.ZodString;
    /** Symbol kind */
    kind: z.ZodString;
    /** File where symbol is defined */
    filePath: z.ZodString;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    name: string;
    kind: string;
}, {
    filePath: string;
    name: string;
    kind: string;
}>;
type TracedSymbol = z.infer<typeof tracedSymbolSchema>;
/**
 * Direct usage of a symbol schema
 */
declare const directUsageSchema: z.ZodObject<{
    /** File path where symbol is used */
    filePath: z.ZodString;
    /** Type of usage */
    usageType: z.ZodString;
    /** Relationship type (CALLS, REFERENCES, IMPORTS, etc.) */
    relationshipType: z.ZodString;
    /** Line number where usage occurs */
    line: z.ZodOptional<z.ZodNumber>;
    /** Column number where usage occurs */
    column: z.ZodOptional<z.ZodNumber>;
    /** Enclosing symbol (function/class containing this usage) */
    enclosingSymbol: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        kind: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        kind: string;
    }, {
        name: string;
        kind: string;
    }>>;
    /** Surrounding code context (if includeContext=true) */
    context: z.ZodOptional<z.ZodString>;
    /** Alias if symbol was renamed on import */
    aliasName: z.ZodOptional<z.ZodString>;
    /** Whether this is a test file */
    isTest: z.ZodOptional<z.ZodBoolean>;
    /** Whether this is a generated file */
    isGenerated: z.ZodOptional<z.ZodBoolean>;
    /** Importance weight (0.0-1.0, if includeImportanceWeight=true) */
    importanceWeight: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    usageType: string;
    relationshipType: string;
    line?: number | undefined;
    column?: number | undefined;
    context?: string | undefined;
    aliasName?: string | undefined;
    enclosingSymbol?: {
        name: string;
        kind: string;
    } | undefined;
    isTest?: boolean | undefined;
    isGenerated?: boolean | undefined;
    importanceWeight?: number | undefined;
}, {
    filePath: string;
    usageType: string;
    relationshipType: string;
    line?: number | undefined;
    column?: number | undefined;
    context?: string | undefined;
    aliasName?: string | undefined;
    enclosingSymbol?: {
        name: string;
        kind: string;
    } | undefined;
    isTest?: boolean | undefined;
    isGenerated?: boolean | undefined;
    importanceWeight?: number | undefined;
}>;
type DirectUsage = z.infer<typeof directUsageSchema>;
/**
 * Transitive usage (indirect) schema
 */
declare const transitiveUsageSchema: z.ZodObject<{
    /** File path */
    filePath: z.ZodString;
    /** Number of hops from source symbol */
    distance: z.ZodNumber;
    /** Chain showing how it's reached */
    chain: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    distance: number;
    chain: string[];
}, {
    filePath: string;
    distance: number;
    chain: string[];
}>;
type TransitiveUsage = z.infer<typeof transitiveUsageSchema>;
/**
 * Trace symbol usage result schema
 */
declare const traceSymbolUsageResultSchema: z.ZodObject<{
    /** Symbol being traced */
    symbol: z.ZodObject<{
        /** Symbol being traced */
        name: z.ZodString;
        /** Symbol kind */
        kind: z.ZodString;
        /** File where symbol is defined */
        filePath: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        filePath: string;
        name: string;
        kind: string;
    }, {
        filePath: string;
        name: string;
        kind: string;
    }>;
    /** Direct usages of the symbol */
    directUsages: z.ZodArray<z.ZodObject<{
        /** File path where symbol is used */
        filePath: z.ZodString;
        /** Type of usage */
        usageType: z.ZodString;
        /** Relationship type (CALLS, REFERENCES, IMPORTS, etc.) */
        relationshipType: z.ZodString;
        /** Line number where usage occurs */
        line: z.ZodOptional<z.ZodNumber>;
        /** Column number where usage occurs */
        column: z.ZodOptional<z.ZodNumber>;
        /** Enclosing symbol (function/class containing this usage) */
        enclosingSymbol: z.ZodOptional<z.ZodObject<{
            name: z.ZodString;
            kind: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            kind: string;
        }, {
            name: string;
            kind: string;
        }>>;
        /** Surrounding code context (if includeContext=true) */
        context: z.ZodOptional<z.ZodString>;
        /** Alias if symbol was renamed on import */
        aliasName: z.ZodOptional<z.ZodString>;
        /** Whether this is a test file */
        isTest: z.ZodOptional<z.ZodBoolean>;
        /** Whether this is a generated file */
        isGenerated: z.ZodOptional<z.ZodBoolean>;
        /** Importance weight (0.0-1.0, if includeImportanceWeight=true) */
        importanceWeight: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        filePath: string;
        usageType: string;
        relationshipType: string;
        line?: number | undefined;
        column?: number | undefined;
        context?: string | undefined;
        aliasName?: string | undefined;
        enclosingSymbol?: {
            name: string;
            kind: string;
        } | undefined;
        isTest?: boolean | undefined;
        isGenerated?: boolean | undefined;
        importanceWeight?: number | undefined;
    }, {
        filePath: string;
        usageType: string;
        relationshipType: string;
        line?: number | undefined;
        column?: number | undefined;
        context?: string | undefined;
        aliasName?: string | undefined;
        enclosingSymbol?: {
            name: string;
            kind: string;
        } | undefined;
        isTest?: boolean | undefined;
        isGenerated?: boolean | undefined;
        importanceWeight?: number | undefined;
    }>, "many">;
    /** Transitive usages (if includeTransitive=true) */
    transitiveUsages: z.ZodOptional<z.ZodArray<z.ZodObject<{
        /** File path */
        filePath: z.ZodString;
        /** Number of hops from source symbol */
        distance: z.ZodNumber;
        /** Chain showing how it's reached */
        chain: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        filePath: string;
        distance: number;
        chain: string[];
    }, {
        filePath: string;
        distance: number;
        chain: string[];
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    symbol: {
        filePath: string;
        name: string;
        kind: string;
    };
    directUsages: {
        filePath: string;
        usageType: string;
        relationshipType: string;
        line?: number | undefined;
        column?: number | undefined;
        context?: string | undefined;
        aliasName?: string | undefined;
        enclosingSymbol?: {
            name: string;
            kind: string;
        } | undefined;
        isTest?: boolean | undefined;
        isGenerated?: boolean | undefined;
        importanceWeight?: number | undefined;
    }[];
    transitiveUsages?: {
        filePath: string;
        distance: number;
        chain: string[];
    }[] | undefined;
}, {
    symbol: {
        filePath: string;
        name: string;
        kind: string;
    };
    directUsages: {
        filePath: string;
        usageType: string;
        relationshipType: string;
        line?: number | undefined;
        column?: number | undefined;
        context?: string | undefined;
        aliasName?: string | undefined;
        enclosingSymbol?: {
            name: string;
            kind: string;
        } | undefined;
        isTest?: boolean | undefined;
        isGenerated?: boolean | undefined;
        importanceWeight?: number | undefined;
    }[];
    transitiveUsages?: {
        filePath: string;
        distance: number;
        chain: string[];
    }[] | undefined;
}>;
type TraceSymbolUsageResult = z.infer<typeof traceSymbolUsageResultSchema>;

/**
 * Get Call Graph Tool Schemas
 *
 * Zod schemas for the get_call_graph MCP tool.
 * Understands the call chain for a function (callers and callees).
 */

/**
 * Input parameters schema for getting call graph
 */
declare const getCallGraphParamsSchema: z.ZodObject<{
    /** Symbol ID to analyze (if known) */
    symbolId: z.ZodOptional<z.ZodString>;
    /** Symbol name (requires filePath if symbolId not provided) */
    symbolName: z.ZodOptional<z.ZodString>;
    /** File path where function is defined */
    filePath: z.ZodOptional<z.ZodString>;
    /** Direction of call graph to retrieve (default: 'both') */
    direction: z.ZodDefault<z.ZodEnum<["callers", "callees", "both"]>>;
    /** Maximum depth to traverse */
    depth: z.ZodDefault<z.ZodNumber>;
    /** Exclude external/package calls */
    excludeExternal: z.ZodOptional<z.ZodBoolean>;
    /** Include graph representation */
    includeGraph: z.ZodOptional<z.ZodBoolean>;
    /** Maximum number of call relationships to return per page (default: 25, max: 100) */
    limit: z.ZodDefault<z.ZodNumber>;
    /** Offset for pagination (default: 0) */
    offset: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    offset: number;
    depth: number;
    direction: "callers" | "callees" | "both";
    filePath?: string | undefined;
    symbolId?: string | undefined;
    symbolName?: string | undefined;
    excludeExternal?: boolean | undefined;
    includeGraph?: boolean | undefined;
}, {
    filePath?: string | undefined;
    symbolId?: string | undefined;
    symbolName?: string | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
    depth?: number | undefined;
    direction?: "callers" | "callees" | "both" | undefined;
    excludeExternal?: boolean | undefined;
    includeGraph?: boolean | undefined;
}>;
type GetCallGraphParams = z.infer<typeof getCallGraphParamsSchema>;
/**
 * Root symbol of call graph schema
 */
declare const callGraphRootSchema: z.ZodObject<{
    /** Symbol ID */
    symbolId: z.ZodString;
    /** Symbol name */
    name: z.ZodString;
    /** File path */
    filePath: z.ZodString;
    /** Line number */
    line: z.ZodNumber;
    /** Column number */
    column: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    line: number;
    column: number;
    symbolId: string;
    name: string;
}, {
    filePath: string;
    line: number;
    column: number;
    symbolId: string;
    name: string;
}>;
type CallGraphRoot = z.infer<typeof callGraphRootSchema>;
/**
 * Caller node in call graph schema
 */
declare const callerNodeSchema: z.ZodObject<{
    /** Symbol ID */
    symbolId: z.ZodString;
    /** Symbol name */
    name: z.ZodString;
    /** File path */
    filePath: z.ZodString;
    /** Line number */
    line: z.ZodNumber;
    /** Column number */
    column: z.ZodNumber;
    /** Depth from root */
    depth: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    line: number;
    column: number;
    symbolId: string;
    name: string;
    depth: number;
}, {
    filePath: string;
    line: number;
    column: number;
    symbolId: string;
    name: string;
    depth: number;
}>;
type CallerNode = z.infer<typeof callerNodeSchema>;
/**
 * Callee node in call graph schema
 */
declare const calleeNodeSchema: z.ZodObject<{
    /** Symbol ID */
    symbolId: z.ZodString;
    /** Symbol name */
    name: z.ZodString;
    /** File path */
    filePath: z.ZodString;
    /** Line number */
    line: z.ZodNumber;
    /** Column number */
    column: z.ZodNumber;
    /** Whether call is async */
    isAsync: z.ZodBoolean;
    /** Depth from root */
    depth: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    line: number;
    column: number;
    symbolId: string;
    name: string;
    depth: number;
    isAsync: boolean;
}, {
    filePath: string;
    line: number;
    column: number;
    symbolId: string;
    name: string;
    depth: number;
    isAsync: boolean;
}>;
type CalleeNode = z.infer<typeof calleeNodeSchema>;
/**
 * Get call graph result schema
 */
declare const getCallGraphResultSchema: z.ZodObject<{
    /** Root symbol */
    root: z.ZodObject<{
        /** Symbol ID */
        symbolId: z.ZodString;
        /** Symbol name */
        name: z.ZodString;
        /** File path */
        filePath: z.ZodString;
        /** Line number */
        line: z.ZodNumber;
        /** Column number */
        column: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        filePath: string;
        line: number;
        column: number;
        symbolId: string;
        name: string;
    }, {
        filePath: string;
        line: number;
        column: number;
        symbolId: string;
        name: string;
    }>;
    /** Functions that call this symbol (if direction includes 'callers') */
    callers: z.ZodOptional<z.ZodArray<z.ZodObject<{
        /** Symbol ID */
        symbolId: z.ZodString;
        /** Symbol name */
        name: z.ZodString;
        /** File path */
        filePath: z.ZodString;
        /** Line number */
        line: z.ZodNumber;
        /** Column number */
        column: z.ZodNumber;
        /** Depth from root */
        depth: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        filePath: string;
        line: number;
        column: number;
        symbolId: string;
        name: string;
        depth: number;
    }, {
        filePath: string;
        line: number;
        column: number;
        symbolId: string;
        name: string;
        depth: number;
    }>, "many">>;
    /** Functions this symbol calls (if direction includes 'callees') */
    callees: z.ZodOptional<z.ZodArray<z.ZodObject<{
        /** Symbol ID */
        symbolId: z.ZodString;
        /** Symbol name */
        name: z.ZodString;
        /** File path */
        filePath: z.ZodString;
        /** Line number */
        line: z.ZodNumber;
        /** Column number */
        column: z.ZodNumber;
        /** Whether call is async */
        isAsync: z.ZodBoolean;
        /** Depth from root */
        depth: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        filePath: string;
        line: number;
        column: number;
        symbolId: string;
        name: string;
        depth: number;
        isAsync: boolean;
    }, {
        filePath: string;
        line: number;
        column: number;
        symbolId: string;
        name: string;
        depth: number;
        isAsync: boolean;
    }>, "many">>;
    /** Graph representation (if includeGraph=true) */
    graph: z.ZodOptional<z.ZodObject<{
        nodes: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            type: z.ZodString;
            properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        }, "strip", z.ZodTypeAny, {
            type: string;
            id: string;
            name: string;
            properties?: Record<string, any> | undefined;
        }, {
            type: string;
            id: string;
            name: string;
            properties?: Record<string, any> | undefined;
        }>, "many">;
        edges: z.ZodArray<z.ZodObject<{
            from: z.ZodString;
            to: z.ZodString;
            type: z.ZodOptional<z.ZodString>;
            weight: z.ZodOptional<z.ZodNumber>;
            properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        }, "strip", z.ZodTypeAny, {
            from: string;
            to: string;
            type?: string | undefined;
            properties?: Record<string, any> | undefined;
            weight?: number | undefined;
        }, {
            from: string;
            to: string;
            type?: string | undefined;
            properties?: Record<string, any> | undefined;
            weight?: number | undefined;
        }>, "many">;
        metadata: z.ZodOptional<z.ZodObject<{
            nodeCount: z.ZodNumber;
            edgeCount: z.ZodNumber;
            directed: z.ZodBoolean;
            hasCycles: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            nodeCount: number;
            edgeCount: number;
            directed: boolean;
            hasCycles?: boolean | undefined;
        }, {
            nodeCount: number;
            edgeCount: number;
            directed: boolean;
            hasCycles?: boolean | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        nodes: {
            type: string;
            id: string;
            name: string;
            properties?: Record<string, any> | undefined;
        }[];
        edges: {
            from: string;
            to: string;
            type?: string | undefined;
            properties?: Record<string, any> | undefined;
            weight?: number | undefined;
        }[];
        metadata?: {
            nodeCount: number;
            edgeCount: number;
            directed: boolean;
            hasCycles?: boolean | undefined;
        } | undefined;
    }, {
        nodes: {
            type: string;
            id: string;
            name: string;
            properties?: Record<string, any> | undefined;
        }[];
        edges: {
            from: string;
            to: string;
            type?: string | undefined;
            properties?: Record<string, any> | undefined;
            weight?: number | undefined;
        }[];
        metadata?: {
            nodeCount: number;
            edgeCount: number;
            directed: boolean;
            hasCycles?: boolean | undefined;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    root: {
        filePath: string;
        line: number;
        column: number;
        symbolId: string;
        name: string;
    };
    callers?: {
        filePath: string;
        line: number;
        column: number;
        symbolId: string;
        name: string;
        depth: number;
    }[] | undefined;
    callees?: {
        filePath: string;
        line: number;
        column: number;
        symbolId: string;
        name: string;
        depth: number;
        isAsync: boolean;
    }[] | undefined;
    graph?: {
        nodes: {
            type: string;
            id: string;
            name: string;
            properties?: Record<string, any> | undefined;
        }[];
        edges: {
            from: string;
            to: string;
            type?: string | undefined;
            properties?: Record<string, any> | undefined;
            weight?: number | undefined;
        }[];
        metadata?: {
            nodeCount: number;
            edgeCount: number;
            directed: boolean;
            hasCycles?: boolean | undefined;
        } | undefined;
    } | undefined;
}, {
    root: {
        filePath: string;
        line: number;
        column: number;
        symbolId: string;
        name: string;
    };
    callers?: {
        filePath: string;
        line: number;
        column: number;
        symbolId: string;
        name: string;
        depth: number;
    }[] | undefined;
    callees?: {
        filePath: string;
        line: number;
        column: number;
        symbolId: string;
        name: string;
        depth: number;
        isAsync: boolean;
    }[] | undefined;
    graph?: {
        nodes: {
            type: string;
            id: string;
            name: string;
            properties?: Record<string, any> | undefined;
        }[];
        edges: {
            from: string;
            to: string;
            type?: string | undefined;
            properties?: Record<string, any> | undefined;
            weight?: number | undefined;
        }[];
        metadata?: {
            nodeCount: number;
            edgeCount: number;
            directed: boolean;
            hasCycles?: boolean | undefined;
        } | undefined;
    } | undefined;
}>;
type GetCallGraphResult = z.infer<typeof getCallGraphResultSchema>;

/**
 * Impact Analysis Tool Schemas
 *
 * Zod schemas for analyzing the impact of changes to symbols across the codebase.
 */

/**
 * Input parameters schema for impact analysis
 */
declare const impactAnalysisParamsSchema: z.ZodObject<{
    /** Symbol ID to analyze impact for */
    symbolId: z.ZodOptional<z.ZodString>;
    /** Qualified name to analyze impact for (alternative to symbolId) */
    qualifiedName: z.ZodOptional<z.ZodString>;
    /** Symbol name (requires filePath if symbolId/qualifiedName not provided) */
    symbolName: z.ZodOptional<z.ZodString>;
    /** File path where symbol is defined */
    filePath: z.ZodOptional<z.ZodString>;
    /** Include direct dependents (symbols that directly use this symbol) @default true */
    includeDirectDependents: z.ZodDefault<z.ZodBoolean>;
    /** Include transitive dependents (symbols that transitively depend on this symbol) @default true */
    includeTransitiveDependents: z.ZodDefault<z.ZodBoolean>;
    /** Maximum depth for transitive analysis (1-5) @default 3 */
    depth: z.ZodDefault<z.ZodNumber>;
    /** Exclude test files from impact analysis @default true */
    excludeTests: z.ZodDefault<z.ZodBoolean>;
    /** Exclude generated files from impact analysis @default true */
    excludeGenerated: z.ZodDefault<z.ZodBoolean>;
    /** Analyze breaking change potential @default true */
    analyzeBreakingChanges: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    depth: number;
    excludeTests: boolean;
    excludeGenerated: boolean;
    includeDirectDependents: boolean;
    includeTransitiveDependents: boolean;
    analyzeBreakingChanges: boolean;
    filePath?: string | undefined;
    symbolId?: string | undefined;
    symbolName?: string | undefined;
    qualifiedName?: string | undefined;
}, {
    filePath?: string | undefined;
    symbolId?: string | undefined;
    symbolName?: string | undefined;
    qualifiedName?: string | undefined;
    depth?: number | undefined;
    excludeTests?: boolean | undefined;
    excludeGenerated?: boolean | undefined;
    includeDirectDependents?: boolean | undefined;
    includeTransitiveDependents?: boolean | undefined;
    analyzeBreakingChanges?: boolean | undefined;
}>;
type ImpactAnalysisParams = z.infer<typeof impactAnalysisParamsSchema>;
/**
 * A symbol that depends on the analyzed symbol schema
 */
declare const impactedSymbolSchema: z.ZodObject<{
    filePath: z.ZodString;
    line: z.ZodOptional<z.ZodNumber>;
    lineStart: z.ZodOptional<z.ZodNumber>;
    lineEnd: z.ZodOptional<z.ZodNumber>;
    column: z.ZodOptional<z.ZodNumber>;
} & {
    /** Symbol ID */
    id: z.ZodString;
    /** Symbol name */
    name: z.ZodString;
    /** Fully qualified name */
    qualifiedName: z.ZodString;
    /** Symbol kind (function, class, variable, etc.) */
    kind: z.ZodString;
    /** Type of relationship (CALLS, REFERENCES, DEPENDS_ON, etc.) */
    relationshipType: z.ZodString;
    /** Depth in the dependency chain (1 = direct, 2+ = transitive) */
    depth: z.ZodNumber;
    /** Whether this symbol is exported (potential breaking change risk) */
    isExported: z.ZodOptional<z.ZodBoolean>;
    /** Number of symbols that depend on this impacted symbol */
    transitiveImpactCount: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    id: string;
    name: string;
    qualifiedName: string;
    kind: string;
    depth: number;
    relationshipType: string;
    line?: number | undefined;
    lineStart?: number | undefined;
    lineEnd?: number | undefined;
    column?: number | undefined;
    isExported?: boolean | undefined;
    transitiveImpactCount?: number | undefined;
}, {
    filePath: string;
    id: string;
    name: string;
    qualifiedName: string;
    kind: string;
    depth: number;
    relationshipType: string;
    line?: number | undefined;
    lineStart?: number | undefined;
    lineEnd?: number | undefined;
    column?: number | undefined;
    isExported?: boolean | undefined;
    transitiveImpactCount?: number | undefined;
}>;
type ImpactedSymbol = z.infer<typeof impactedSymbolSchema>;
/**
 * Information about a file impacted by the change schema
 */
declare const impactedFileSchema: z.ZodObject<{
    /** File path */
    filePath: z.ZodString;
    /** Number of symbols in this file that are impacted */
    symbolCount: z.ZodNumber;
    /** Whether this is a test file */
    isTest: z.ZodOptional<z.ZodBoolean>;
    /** Whether this is a generated file */
    isGenerated: z.ZodOptional<z.ZodBoolean>;
    /** List of impacted symbols in this file */
    symbols: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        kind: z.ZodString;
        line: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        line: number;
        id: string;
        name: string;
        kind: string;
    }, {
        line: number;
        id: string;
        name: string;
        kind: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    symbols: {
        line: number;
        id: string;
        name: string;
        kind: string;
    }[];
    symbolCount: number;
    isTest?: boolean | undefined;
    isGenerated?: boolean | undefined;
}, {
    filePath: string;
    symbols: {
        line: number;
        id: string;
        name: string;
        kind: string;
    }[];
    symbolCount: number;
    isTest?: boolean | undefined;
    isGenerated?: boolean | undefined;
}>;
type ImpactedFile = z.infer<typeof impactedFileSchema>;
/**
 * Breaking change risk assessment schema
 */
declare const breakingChangeRiskSchema: z.ZodObject<{
    /** Overall risk level (low, medium, high, critical) */
    riskLevel: z.ZodEnum<["low", "medium", "high", "critical"]>;
    /** Risk factors contributing to the assessment */
    factors: z.ZodArray<z.ZodObject<{
        /** Factor name */
        factor: z.ZodString;
        /** Severity of this factor (low, medium, high) */
        severity: z.ZodEnum<["low", "medium", "high"]>;
        /** Description of why this is a risk factor */
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        severity: "low" | "medium" | "high";
        factor: string;
        description: string;
    }, {
        severity: "low" | "medium" | "high";
        factor: string;
        description: string;
    }>, "many">;
    /** Recommendations for mitigating breaking changes */
    recommendations: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    factors: {
        severity: "low" | "medium" | "high";
        factor: string;
        description: string;
    }[];
    recommendations: string[];
    riskLevel: "low" | "medium" | "high" | "critical";
}, {
    factors: {
        severity: "low" | "medium" | "high";
        factor: string;
        description: string;
    }[];
    recommendations: string[];
    riskLevel: "low" | "medium" | "high" | "critical";
}>;
type BreakingChangeRisk = z.infer<typeof breakingChangeRiskSchema>;
/**
 * Result of impact analysis schema
 */
declare const impactAnalysisResultSchema: z.ZodObject<{
    /** The symbol being analyzed */
    symbol: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        qualifiedName: z.ZodString;
        kind: z.ZodString;
        filePath: z.ZodString;
        line: z.ZodNumber;
        column: z.ZodNumber;
        isExported: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        filePath: string;
        line: number;
        column: number;
        id: string;
        name: string;
        qualifiedName: string;
        kind: string;
        isExported?: boolean | undefined;
    }, {
        filePath: string;
        line: number;
        column: number;
        id: string;
        name: string;
        qualifiedName: string;
        kind: string;
        isExported?: boolean | undefined;
    }>;
    /** Direct dependents (depth 1) */
    directDependents: z.ZodOptional<z.ZodArray<z.ZodObject<{
        filePath: z.ZodString;
        line: z.ZodOptional<z.ZodNumber>;
        lineStart: z.ZodOptional<z.ZodNumber>;
        lineEnd: z.ZodOptional<z.ZodNumber>;
        column: z.ZodOptional<z.ZodNumber>;
    } & {
        /** Symbol ID */
        id: z.ZodString;
        /** Symbol name */
        name: z.ZodString;
        /** Fully qualified name */
        qualifiedName: z.ZodString;
        /** Symbol kind (function, class, variable, etc.) */
        kind: z.ZodString;
        /** Type of relationship (CALLS, REFERENCES, DEPENDS_ON, etc.) */
        relationshipType: z.ZodString;
        /** Depth in the dependency chain (1 = direct, 2+ = transitive) */
        depth: z.ZodNumber;
        /** Whether this symbol is exported (potential breaking change risk) */
        isExported: z.ZodOptional<z.ZodBoolean>;
        /** Number of symbols that depend on this impacted symbol */
        transitiveImpactCount: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        filePath: string;
        id: string;
        name: string;
        qualifiedName: string;
        kind: string;
        depth: number;
        relationshipType: string;
        line?: number | undefined;
        lineStart?: number | undefined;
        lineEnd?: number | undefined;
        column?: number | undefined;
        isExported?: boolean | undefined;
        transitiveImpactCount?: number | undefined;
    }, {
        filePath: string;
        id: string;
        name: string;
        qualifiedName: string;
        kind: string;
        depth: number;
        relationshipType: string;
        line?: number | undefined;
        lineStart?: number | undefined;
        lineEnd?: number | undefined;
        column?: number | undefined;
        isExported?: boolean | undefined;
        transitiveImpactCount?: number | undefined;
    }>, "many">>;
    /** Transitive dependents (depth 2+) */
    transitiveDependents: z.ZodOptional<z.ZodArray<z.ZodObject<{
        filePath: z.ZodString;
        line: z.ZodOptional<z.ZodNumber>;
        lineStart: z.ZodOptional<z.ZodNumber>;
        lineEnd: z.ZodOptional<z.ZodNumber>;
        column: z.ZodOptional<z.ZodNumber>;
    } & {
        /** Symbol ID */
        id: z.ZodString;
        /** Symbol name */
        name: z.ZodString;
        /** Fully qualified name */
        qualifiedName: z.ZodString;
        /** Symbol kind (function, class, variable, etc.) */
        kind: z.ZodString;
        /** Type of relationship (CALLS, REFERENCES, DEPENDS_ON, etc.) */
        relationshipType: z.ZodString;
        /** Depth in the dependency chain (1 = direct, 2+ = transitive) */
        depth: z.ZodNumber;
        /** Whether this symbol is exported (potential breaking change risk) */
        isExported: z.ZodOptional<z.ZodBoolean>;
        /** Number of symbols that depend on this impacted symbol */
        transitiveImpactCount: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        filePath: string;
        id: string;
        name: string;
        qualifiedName: string;
        kind: string;
        depth: number;
        relationshipType: string;
        line?: number | undefined;
        lineStart?: number | undefined;
        lineEnd?: number | undefined;
        column?: number | undefined;
        isExported?: boolean | undefined;
        transitiveImpactCount?: number | undefined;
    }, {
        filePath: string;
        id: string;
        name: string;
        qualifiedName: string;
        kind: string;
        depth: number;
        relationshipType: string;
        line?: number | undefined;
        lineStart?: number | undefined;
        lineEnd?: number | undefined;
        column?: number | undefined;
        isExported?: boolean | undefined;
        transitiveImpactCount?: number | undefined;
    }>, "many">>;
    /** Files impacted by changes to this symbol */
    impactedFiles: z.ZodArray<z.ZodObject<{
        /** File path */
        filePath: z.ZodString;
        /** Number of symbols in this file that are impacted */
        symbolCount: z.ZodNumber;
        /** Whether this is a test file */
        isTest: z.ZodOptional<z.ZodBoolean>;
        /** Whether this is a generated file */
        isGenerated: z.ZodOptional<z.ZodBoolean>;
        /** List of impacted symbols in this file */
        symbols: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            kind: z.ZodString;
            line: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            line: number;
            id: string;
            name: string;
            kind: string;
        }, {
            line: number;
            id: string;
            name: string;
            kind: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        filePath: string;
        symbols: {
            line: number;
            id: string;
            name: string;
            kind: string;
        }[];
        symbolCount: number;
        isTest?: boolean | undefined;
        isGenerated?: boolean | undefined;
    }, {
        filePath: string;
        symbols: {
            line: number;
            id: string;
            name: string;
            kind: string;
        }[];
        symbolCount: number;
        isTest?: boolean | undefined;
        isGenerated?: boolean | undefined;
    }>, "many">;
    /** Breaking change risk assessment */
    breakingChangeRisk: z.ZodOptional<z.ZodObject<{
        /** Overall risk level (low, medium, high, critical) */
        riskLevel: z.ZodEnum<["low", "medium", "high", "critical"]>;
        /** Risk factors contributing to the assessment */
        factors: z.ZodArray<z.ZodObject<{
            /** Factor name */
            factor: z.ZodString;
            /** Severity of this factor (low, medium, high) */
            severity: z.ZodEnum<["low", "medium", "high"]>;
            /** Description of why this is a risk factor */
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            severity: "low" | "medium" | "high";
            factor: string;
            description: string;
        }, {
            severity: "low" | "medium" | "high";
            factor: string;
            description: string;
        }>, "many">;
        /** Recommendations for mitigating breaking changes */
        recommendations: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        factors: {
            severity: "low" | "medium" | "high";
            factor: string;
            description: string;
        }[];
        recommendations: string[];
        riskLevel: "low" | "medium" | "high" | "critical";
    }, {
        factors: {
            severity: "low" | "medium" | "high";
            factor: string;
            description: string;
        }[];
        recommendations: string[];
        riskLevel: "low" | "medium" | "high" | "critical";
    }>>;
    /** Summary statistics */
    summary: z.ZodObject<{
        /** Total number of directly dependent symbols */
        directDependentCount: z.ZodNumber;
        /** Total number of transitively dependent symbols */
        transitiveDependentCount: z.ZodNumber;
        /** Total number of impacted files */
        impactedFileCount: z.ZodNumber;
        /** Number of impacted test files */
        testFileCount: z.ZodNumber;
        /** Number of impacted production files (non-test, non-generated) */
        productionFileCount: z.ZodNumber;
        /** Maximum depth of dependency chain analyzed */
        maxDepth: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        maxDepth: number;
        directDependentCount: number;
        transitiveDependentCount: number;
        impactedFileCount: number;
        testFileCount: number;
        productionFileCount: number;
    }, {
        maxDepth: number;
        directDependentCount: number;
        transitiveDependentCount: number;
        impactedFileCount: number;
        testFileCount: number;
        productionFileCount: number;
    }>;
}, "strip", z.ZodTypeAny, {
    symbol: {
        filePath: string;
        line: number;
        column: number;
        id: string;
        name: string;
        qualifiedName: string;
        kind: string;
        isExported?: boolean | undefined;
    };
    impactedFiles: {
        filePath: string;
        symbols: {
            line: number;
            id: string;
            name: string;
            kind: string;
        }[];
        symbolCount: number;
        isTest?: boolean | undefined;
        isGenerated?: boolean | undefined;
    }[];
    summary: {
        maxDepth: number;
        directDependentCount: number;
        transitiveDependentCount: number;
        impactedFileCount: number;
        testFileCount: number;
        productionFileCount: number;
    };
    directDependents?: {
        filePath: string;
        id: string;
        name: string;
        qualifiedName: string;
        kind: string;
        depth: number;
        relationshipType: string;
        line?: number | undefined;
        lineStart?: number | undefined;
        lineEnd?: number | undefined;
        column?: number | undefined;
        isExported?: boolean | undefined;
        transitiveImpactCount?: number | undefined;
    }[] | undefined;
    transitiveDependents?: {
        filePath: string;
        id: string;
        name: string;
        qualifiedName: string;
        kind: string;
        depth: number;
        relationshipType: string;
        line?: number | undefined;
        lineStart?: number | undefined;
        lineEnd?: number | undefined;
        column?: number | undefined;
        isExported?: boolean | undefined;
        transitiveImpactCount?: number | undefined;
    }[] | undefined;
    breakingChangeRisk?: {
        factors: {
            severity: "low" | "medium" | "high";
            factor: string;
            description: string;
        }[];
        recommendations: string[];
        riskLevel: "low" | "medium" | "high" | "critical";
    } | undefined;
}, {
    symbol: {
        filePath: string;
        line: number;
        column: number;
        id: string;
        name: string;
        qualifiedName: string;
        kind: string;
        isExported?: boolean | undefined;
    };
    impactedFiles: {
        filePath: string;
        symbols: {
            line: number;
            id: string;
            name: string;
            kind: string;
        }[];
        symbolCount: number;
        isTest?: boolean | undefined;
        isGenerated?: boolean | undefined;
    }[];
    summary: {
        maxDepth: number;
        directDependentCount: number;
        transitiveDependentCount: number;
        impactedFileCount: number;
        testFileCount: number;
        productionFileCount: number;
    };
    directDependents?: {
        filePath: string;
        id: string;
        name: string;
        qualifiedName: string;
        kind: string;
        depth: number;
        relationshipType: string;
        line?: number | undefined;
        lineStart?: number | undefined;
        lineEnd?: number | undefined;
        column?: number | undefined;
        isExported?: boolean | undefined;
        transitiveImpactCount?: number | undefined;
    }[] | undefined;
    transitiveDependents?: {
        filePath: string;
        id: string;
        name: string;
        qualifiedName: string;
        kind: string;
        depth: number;
        relationshipType: string;
        line?: number | undefined;
        lineStart?: number | undefined;
        lineEnd?: number | undefined;
        column?: number | undefined;
        isExported?: boolean | undefined;
        transitiveImpactCount?: number | undefined;
    }[] | undefined;
    breakingChangeRisk?: {
        factors: {
            severity: "low" | "medium" | "high";
            factor: string;
            description: string;
        }[];
        recommendations: string[];
        riskLevel: "low" | "medium" | "high" | "critical";
    } | undefined;
}>;
type ImpactAnalysisResult = z.infer<typeof impactAnalysisResultSchema>;

/**
 * Find Orphaned Code Tool Schemas
 *
 * Zod schemas for the find_orphaned_code MCP tool.
 * Identifies unused exports and dead code.
 */

/**
 * Input parameters schema for finding orphaned code
 */
declare const findOrphanedCodeParamsSchema: z.ZodObject<{
    /** File pattern to search */
    filePattern: z.ZodOptional<z.ZodString>;
    /** Filter by symbol kinds */
    filterByKind: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    /** Only check exported symbols */
    exportedOnly: z.ZodOptional<z.ZodBoolean>;
    /** Exclude test files from orphan analysis @default true */
    excludeTests: z.ZodDefault<z.ZodBoolean>;
    /** Maximum results to return */
    limit: z.ZodDefault<z.ZodNumber>;
    /** Pagination offset */
    offset: z.ZodDefault<z.ZodNumber>;
    /** Include confidence scoring */
    includeConfidence: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    offset: number;
    excludeTests: boolean;
    filterByKind?: string[] | undefined;
    includeConfidence?: boolean | undefined;
    filePattern?: string | undefined;
    exportedOnly?: boolean | undefined;
}, {
    filterByKind?: string[] | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
    includeConfidence?: boolean | undefined;
    excludeTests?: boolean | undefined;
    filePattern?: string | undefined;
    exportedOnly?: boolean | undefined;
}>;
type FindOrphanedCodeParams = z.infer<typeof findOrphanedCodeParamsSchema>;
/**
 * Orphaned symbol schema
 */
declare const orphanedSymbolSchema: z.ZodObject<{
    /** Symbol ID */
    symbolId: z.ZodString;
    /** Symbol name */
    name: z.ZodString;
    /** Symbol kind */
    kind: z.ZodString;
    /** File path */
    filePath: z.ZodString;
    /** Whether symbol is exported */
    isExported: z.ZodBoolean;
    /** Reason for being orphaned */
    reason: z.ZodString;
    /** Confidence (0-1) */
    confidence: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    symbolId: string;
    name: string;
    isExported: boolean;
    kind: string;
    reason: string;
    confidence: number;
}, {
    filePath: string;
    symbolId: string;
    name: string;
    isExported: boolean;
    kind: string;
    reason: string;
    confidence: number;
}>;
type OrphanedSymbol = z.infer<typeof orphanedSymbolSchema>;
/**
 * Orphaned file schema
 */
declare const orphanedFileSchema: z.ZodObject<{
    /** File path */
    filePath: z.ZodString;
    /** Reason for being orphaned */
    reason: z.ZodString;
    /** Last updated timestamp */
    lastUpdated: z.ZodString;
    /** Confidence (0-1) */
    confidence: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    lastUpdated: string;
    filePath: string;
    reason: string;
    confidence: number;
}, {
    lastUpdated: string;
    filePath: string;
    reason: string;
    confidence: number;
}>;
type OrphanedFile = z.infer<typeof orphanedFileSchema>;
/**
 * Find orphaned code result schema
 */
declare const findOrphanedCodeResultSchema: z.ZodObject<{
    /** Orphaned symbols */
    orphanedSymbols: z.ZodArray<z.ZodObject<{
        /** Symbol ID */
        symbolId: z.ZodString;
        /** Symbol name */
        name: z.ZodString;
        /** Symbol kind */
        kind: z.ZodString;
        /** File path */
        filePath: z.ZodString;
        /** Whether symbol is exported */
        isExported: z.ZodBoolean;
        /** Reason for being orphaned */
        reason: z.ZodString;
        /** Confidence (0-1) */
        confidence: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        filePath: string;
        symbolId: string;
        name: string;
        isExported: boolean;
        kind: string;
        reason: string;
        confidence: number;
    }, {
        filePath: string;
        symbolId: string;
        name: string;
        isExported: boolean;
        kind: string;
        reason: string;
        confidence: number;
    }>, "many">;
    /** Orphaned files */
    orphanedFiles: z.ZodArray<z.ZodObject<{
        /** File path */
        filePath: z.ZodString;
        /** Reason for being orphaned */
        reason: z.ZodString;
        /** Last updated timestamp */
        lastUpdated: z.ZodString;
        /** Confidence (0-1) */
        confidence: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        lastUpdated: string;
        filePath: string;
        reason: string;
        confidence: number;
    }, {
        lastUpdated: string;
        filePath: string;
        reason: string;
        confidence: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    orphanedSymbols: {
        filePath: string;
        symbolId: string;
        name: string;
        isExported: boolean;
        kind: string;
        reason: string;
        confidence: number;
    }[];
    orphanedFiles: {
        lastUpdated: string;
        filePath: string;
        reason: string;
        confidence: number;
    }[];
}, {
    orphanedSymbols: {
        filePath: string;
        symbolId: string;
        name: string;
        isExported: boolean;
        kind: string;
        reason: string;
        confidence: number;
    }[];
    orphanedFiles: {
        lastUpdated: string;
        filePath: string;
        reason: string;
        confidence: number;
    }[];
}>;
type FindOrphanedCodeResult = z.infer<typeof findOrphanedCodeResultSchema>;

/**
 * Get Architecture Overview Tool Schemas
 *
 * Zod schemas for retrieving high-level architecture information about the codebase.
 */

/**
 * Input parameters schema for getting architecture overview
 */
declare const getArchitectureOverviewParamsSchema: z.ZodObject<{
    /** Include detailed metrics @default false */
    includeMetrics: z.ZodDefault<z.ZodBoolean>;
    /** Include module-level graph structure @default false */
    includeModuleGraph: z.ZodDefault<z.ZodBoolean>;
    /** Include external package dependency details (production/development classification) @default true */
    includePackages: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    includePackages: boolean;
    includeMetrics: boolean;
    includeModuleGraph: boolean;
}, {
    includePackages?: boolean | undefined;
    includeMetrics?: boolean | undefined;
    includeModuleGraph?: boolean | undefined;
}>;
type GetArchitectureOverviewParams = z.infer<typeof getArchitectureOverviewParamsSchema>;
/**
 * Language information schema
 */
declare const languageInfoSchema: z.ZodObject<{
    language: z.ZodString;
    fileCount: z.ZodNumber;
    percentage: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    language: string;
    fileCount: number;
    percentage: number;
}, {
    language: string;
    fileCount: number;
    percentage: number;
}>;
type LanguageInfo = z.infer<typeof languageInfoSchema>;
/**
 * Framework detection info schema
 */
declare const frameworkInfoSchema: z.ZodObject<{
    name: z.ZodString;
    version: z.ZodOptional<z.ZodString>;
    confidence: z.ZodEnum<["high", "medium", "low"]>;
    evidence: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    confidence: "low" | "medium" | "high";
    evidence: string[];
    version?: string | undefined;
}, {
    name: string;
    confidence: "low" | "medium" | "high";
    evidence: string[];
    version?: string | undefined;
}>;
type FrameworkInfo = z.infer<typeof frameworkInfoSchema>;
/**
 * Project metadata schema
 */
declare const projectMetadataSchema: z.ZodObject<{
    languages: z.ZodArray<z.ZodObject<{
        language: z.ZodString;
        fileCount: z.ZodNumber;
        percentage: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        language: string;
        fileCount: number;
        percentage: number;
    }, {
        language: string;
        fileCount: number;
        percentage: number;
    }>, "many">;
    frameworks: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        version: z.ZodOptional<z.ZodString>;
        confidence: z.ZodEnum<["high", "medium", "low"]>;
        evidence: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        name: string;
        confidence: "low" | "medium" | "high";
        evidence: string[];
        version?: string | undefined;
    }, {
        name: string;
        confidence: "low" | "medium" | "high";
        evidence: string[];
        version?: string | undefined;
    }>, "many">;
    primaryLanguage: z.ZodString;
    totalFiles: z.ZodNumber;
    totalLines: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    totalFiles: number;
    languages: {
        language: string;
        fileCount: number;
        percentage: number;
    }[];
    frameworks: {
        name: string;
        confidence: "low" | "medium" | "high";
        evidence: string[];
        version?: string | undefined;
    }[];
    primaryLanguage: string;
    totalLines?: number | undefined;
}, {
    totalFiles: number;
    languages: {
        language: string;
        fileCount: number;
        percentage: number;
    }[];
    frameworks: {
        name: string;
        confidence: "low" | "medium" | "high";
        evidence: string[];
        version?: string | undefined;
    }[];
    primaryLanguage: string;
    totalLines?: number | undefined;
}>;
type ProjectMetadata = z.infer<typeof projectMetadataSchema>;
/**
 * Structure statistics schema
 */
declare const structureStatisticsSchema: z.ZodObject<{
    files: z.ZodObject<{
        total: z.ZodNumber;
        byType: z.ZodRecord<z.ZodString, z.ZodNumber>;
        byParadigm: z.ZodRecord<z.ZodString, z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        total: number;
        byType: Record<string, number>;
        byParadigm: Record<string, number>;
    }, {
        total: number;
        byType: Record<string, number>;
        byParadigm: Record<string, number>;
    }>;
    symbols: z.ZodObject<{
        total: z.ZodNumber;
        byKind: z.ZodRecord<z.ZodString, z.ZodNumber>;
        exported: z.ZodNumber;
        public: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        total: number;
        byKind: Record<string, number>;
        exported: number;
        public: number;
    }, {
        total: number;
        byKind: Record<string, number>;
        exported: number;
        public: number;
    }>;
    modules: z.ZodObject<{
        total: z.ZodNumber;
        averageSize: z.ZodNumber;
        largest: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        total: number;
        averageSize: number;
        largest: string;
    }, {
        total: number;
        averageSize: number;
        largest: string;
    }>;
}, "strip", z.ZodTypeAny, {
    symbols: {
        total: number;
        byKind: Record<string, number>;
        exported: number;
        public: number;
    };
    files: {
        total: number;
        byType: Record<string, number>;
        byParadigm: Record<string, number>;
    };
    modules: {
        total: number;
        averageSize: number;
        largest: string;
    };
}, {
    symbols: {
        total: number;
        byKind: Record<string, number>;
        exported: number;
        public: number;
    };
    files: {
        total: number;
        byType: Record<string, number>;
        byParadigm: Record<string, number>;
    };
    modules: {
        total: number;
        averageSize: number;
        largest: string;
    };
}>;
type StructureStatistics = z.infer<typeof structureStatisticsSchema>;
/**
 * Dependency overview schema
 */
declare const dependencyOverviewSchema: z.ZodObject<{
    internal: z.ZodObject<{
        totalConnections: z.ZodNumber;
        averagePerFile: z.ZodNumber;
        mostConnectedFiles: z.ZodArray<z.ZodObject<{
            path: z.ZodString;
            incomingCount: z.ZodNumber;
            outgoingCount: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            path: string;
            incomingCount: number;
            outgoingCount: number;
        }, {
            path: string;
            incomingCount: number;
            outgoingCount: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        totalConnections: number;
        averagePerFile: number;
        mostConnectedFiles: {
            path: string;
            incomingCount: number;
            outgoingCount: number;
        }[];
    }, {
        totalConnections: number;
        averagePerFile: number;
        mostConnectedFiles: {
            path: string;
            incomingCount: number;
            outgoingCount: number;
        }[];
    }>;
    external: z.ZodObject<{
        totalPackages: z.ZodNumber;
        directDependencies: z.ZodNumber;
        topPackages: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            usageCount: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            name: string;
            usageCount: number;
        }, {
            name: string;
            usageCount: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        totalPackages: number;
        directDependencies: number;
        topPackages: {
            name: string;
            usageCount: number;
        }[];
    }, {
        totalPackages: number;
        directDependencies: number;
        topPackages: {
            name: string;
            usageCount: number;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    internal: {
        totalConnections: number;
        averagePerFile: number;
        mostConnectedFiles: {
            path: string;
            incomingCount: number;
            outgoingCount: number;
        }[];
    };
    external: {
        totalPackages: number;
        directDependencies: number;
        topPackages: {
            name: string;
            usageCount: number;
        }[];
    };
}, {
    internal: {
        totalConnections: number;
        averagePerFile: number;
        mostConnectedFiles: {
            path: string;
            incomingCount: number;
            outgoingCount: number;
        }[];
    };
    external: {
        totalPackages: number;
        directDependencies: number;
        topPackages: {
            name: string;
            usageCount: number;
        }[];
    };
}>;
type DependencyOverview = z.infer<typeof dependencyOverviewSchema>;
/**
 * Code quality metrics (optional) schema
 */
declare const qualityMetricsSchema: z.ZodObject<{
    complexity: z.ZodObject<{
        average: z.ZodNumber;
        high: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        high: number;
        average: number;
    }, {
        high: number;
        average: number;
    }>;
    maintainability: z.ZodObject<{
        score: z.ZodNumber;
        issues: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        issues: string[];
        score: number;
    }, {
        issues: string[];
        score: number;
    }>;
    testCoverage: z.ZodOptional<z.ZodObject<{
        percentage: z.ZodNumber;
        testedFiles: z.ZodNumber;
        totalFiles: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        totalFiles: number;
        percentage: number;
        testedFiles: number;
    }, {
        totalFiles: number;
        percentage: number;
        testedFiles: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    complexity: {
        high: number;
        average: number;
    };
    maintainability: {
        issues: string[];
        score: number;
    };
    testCoverage?: {
        totalFiles: number;
        percentage: number;
        testedFiles: number;
    } | undefined;
}, {
    complexity: {
        high: number;
        average: number;
    };
    maintainability: {
        issues: string[];
        score: number;
    };
    testCoverage?: {
        totalFiles: number;
        percentage: number;
        testedFiles: number;
    } | undefined;
}>;
type QualityMetrics = z.infer<typeof qualityMetricsSchema>;
/**
 * Module node in graph schema
 */
declare const moduleGraphNodeSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    fileCount: z.ZodNumber;
    type: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    id: string;
    name: string;
    fileCount: number;
}, {
    type: string;
    id: string;
    name: string;
    fileCount: number;
}>;
type ModuleGraphNode = z.infer<typeof moduleGraphNodeSchema>;
/**
 * Module edge in graph schema
 */
declare const moduleGraphEdgeSchema: z.ZodObject<{
    from: z.ZodString;
    to: z.ZodString;
    weight: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    from: string;
    to: string;
    weight: number;
}, {
    from: string;
    to: string;
    weight: number;
}>;
type ModuleGraphEdge = z.infer<typeof moduleGraphEdgeSchema>;
/**
 * Module graph structure schema
 */
declare const moduleGraphSchema: z.ZodObject<{
    nodes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        fileCount: z.ZodNumber;
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        id: string;
        name: string;
        fileCount: number;
    }, {
        type: string;
        id: string;
        name: string;
        fileCount: number;
    }>, "many">;
    edges: z.ZodArray<z.ZodObject<{
        from: z.ZodString;
        to: z.ZodString;
        weight: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        from: string;
        to: string;
        weight: number;
    }, {
        from: string;
        to: string;
        weight: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    nodes: {
        type: string;
        id: string;
        name: string;
        fileCount: number;
    }[];
    edges: {
        from: string;
        to: string;
        weight: number;
    }[];
}, {
    nodes: {
        type: string;
        id: string;
        name: string;
        fileCount: number;
    }[];
    edges: {
        from: string;
        to: string;
        weight: number;
    }[];
}>;
type ModuleGraph = z.infer<typeof moduleGraphSchema>;
/**
 * Get architecture overview result schema
 */
declare const getArchitectureOverviewResultSchema: z.ZodObject<{
    /** Project metadata */
    metadata: z.ZodObject<{
        languages: z.ZodArray<z.ZodObject<{
            language: z.ZodString;
            fileCount: z.ZodNumber;
            percentage: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            language: string;
            fileCount: number;
            percentage: number;
        }, {
            language: string;
            fileCount: number;
            percentage: number;
        }>, "many">;
        frameworks: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            version: z.ZodOptional<z.ZodString>;
            confidence: z.ZodEnum<["high", "medium", "low"]>;
            evidence: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            name: string;
            confidence: "low" | "medium" | "high";
            evidence: string[];
            version?: string | undefined;
        }, {
            name: string;
            confidence: "low" | "medium" | "high";
            evidence: string[];
            version?: string | undefined;
        }>, "many">;
        primaryLanguage: z.ZodString;
        totalFiles: z.ZodNumber;
        totalLines: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        totalFiles: number;
        languages: {
            language: string;
            fileCount: number;
            percentage: number;
        }[];
        frameworks: {
            name: string;
            confidence: "low" | "medium" | "high";
            evidence: string[];
            version?: string | undefined;
        }[];
        primaryLanguage: string;
        totalLines?: number | undefined;
    }, {
        totalFiles: number;
        languages: {
            language: string;
            fileCount: number;
            percentage: number;
        }[];
        frameworks: {
            name: string;
            confidence: "low" | "medium" | "high";
            evidence: string[];
            version?: string | undefined;
        }[];
        primaryLanguage: string;
        totalLines?: number | undefined;
    }>;
    /** Structure statistics */
    structure: z.ZodObject<{
        files: z.ZodObject<{
            total: z.ZodNumber;
            byType: z.ZodRecord<z.ZodString, z.ZodNumber>;
            byParadigm: z.ZodRecord<z.ZodString, z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            total: number;
            byType: Record<string, number>;
            byParadigm: Record<string, number>;
        }, {
            total: number;
            byType: Record<string, number>;
            byParadigm: Record<string, number>;
        }>;
        symbols: z.ZodObject<{
            total: z.ZodNumber;
            byKind: z.ZodRecord<z.ZodString, z.ZodNumber>;
            exported: z.ZodNumber;
            public: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            total: number;
            byKind: Record<string, number>;
            exported: number;
            public: number;
        }, {
            total: number;
            byKind: Record<string, number>;
            exported: number;
            public: number;
        }>;
        modules: z.ZodObject<{
            total: z.ZodNumber;
            averageSize: z.ZodNumber;
            largest: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            total: number;
            averageSize: number;
            largest: string;
        }, {
            total: number;
            averageSize: number;
            largest: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        symbols: {
            total: number;
            byKind: Record<string, number>;
            exported: number;
            public: number;
        };
        files: {
            total: number;
            byType: Record<string, number>;
            byParadigm: Record<string, number>;
        };
        modules: {
            total: number;
            averageSize: number;
            largest: string;
        };
    }, {
        symbols: {
            total: number;
            byKind: Record<string, number>;
            exported: number;
            public: number;
        };
        files: {
            total: number;
            byType: Record<string, number>;
            byParadigm: Record<string, number>;
        };
        modules: {
            total: number;
            averageSize: number;
            largest: string;
        };
    }>;
    /** Dependency overview */
    dependencies: z.ZodObject<{
        internal: z.ZodObject<{
            totalConnections: z.ZodNumber;
            averagePerFile: z.ZodNumber;
            mostConnectedFiles: z.ZodArray<z.ZodObject<{
                path: z.ZodString;
                incomingCount: z.ZodNumber;
                outgoingCount: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                path: string;
                incomingCount: number;
                outgoingCount: number;
            }, {
                path: string;
                incomingCount: number;
                outgoingCount: number;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            totalConnections: number;
            averagePerFile: number;
            mostConnectedFiles: {
                path: string;
                incomingCount: number;
                outgoingCount: number;
            }[];
        }, {
            totalConnections: number;
            averagePerFile: number;
            mostConnectedFiles: {
                path: string;
                incomingCount: number;
                outgoingCount: number;
            }[];
        }>;
        external: z.ZodObject<{
            totalPackages: z.ZodNumber;
            directDependencies: z.ZodNumber;
            topPackages: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                usageCount: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                name: string;
                usageCount: number;
            }, {
                name: string;
                usageCount: number;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            totalPackages: number;
            directDependencies: number;
            topPackages: {
                name: string;
                usageCount: number;
            }[];
        }, {
            totalPackages: number;
            directDependencies: number;
            topPackages: {
                name: string;
                usageCount: number;
            }[];
        }>;
    }, "strip", z.ZodTypeAny, {
        internal: {
            totalConnections: number;
            averagePerFile: number;
            mostConnectedFiles: {
                path: string;
                incomingCount: number;
                outgoingCount: number;
            }[];
        };
        external: {
            totalPackages: number;
            directDependencies: number;
            topPackages: {
                name: string;
                usageCount: number;
            }[];
        };
    }, {
        internal: {
            totalConnections: number;
            averagePerFile: number;
            mostConnectedFiles: {
                path: string;
                incomingCount: number;
                outgoingCount: number;
            }[];
        };
        external: {
            totalPackages: number;
            directDependencies: number;
            topPackages: {
                name: string;
                usageCount: number;
            }[];
        };
    }>;
    /** Quality metrics (if includeMetrics=true) */
    metrics: z.ZodOptional<z.ZodObject<{
        complexity: z.ZodObject<{
            average: z.ZodNumber;
            high: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            high: number;
            average: number;
        }, {
            high: number;
            average: number;
        }>;
        maintainability: z.ZodObject<{
            score: z.ZodNumber;
            issues: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            issues: string[];
            score: number;
        }, {
            issues: string[];
            score: number;
        }>;
        testCoverage: z.ZodOptional<z.ZodObject<{
            percentage: z.ZodNumber;
            testedFiles: z.ZodNumber;
            totalFiles: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            totalFiles: number;
            percentage: number;
            testedFiles: number;
        }, {
            totalFiles: number;
            percentage: number;
            testedFiles: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        complexity: {
            high: number;
            average: number;
        };
        maintainability: {
            issues: string[];
            score: number;
        };
        testCoverage?: {
            totalFiles: number;
            percentage: number;
            testedFiles: number;
        } | undefined;
    }, {
        complexity: {
            high: number;
            average: number;
        };
        maintainability: {
            issues: string[];
            score: number;
        };
        testCoverage?: {
            totalFiles: number;
            percentage: number;
            testedFiles: number;
        } | undefined;
    }>>;
    /** Module graph (if includeModuleGraph=true) */
    moduleGraph: z.ZodOptional<z.ZodObject<{
        nodes: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            fileCount: z.ZodNumber;
            type: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: string;
            id: string;
            name: string;
            fileCount: number;
        }, {
            type: string;
            id: string;
            name: string;
            fileCount: number;
        }>, "many">;
        edges: z.ZodArray<z.ZodObject<{
            from: z.ZodString;
            to: z.ZodString;
            weight: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            from: string;
            to: string;
            weight: number;
        }, {
            from: string;
            to: string;
            weight: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        nodes: {
            type: string;
            id: string;
            name: string;
            fileCount: number;
        }[];
        edges: {
            from: string;
            to: string;
            weight: number;
        }[];
    }, {
        nodes: {
            type: string;
            id: string;
            name: string;
            fileCount: number;
        }[];
        edges: {
            from: string;
            to: string;
            weight: number;
        }[];
    }>>;
}, "strip", z.ZodTypeAny, {
    metadata: {
        totalFiles: number;
        languages: {
            language: string;
            fileCount: number;
            percentage: number;
        }[];
        frameworks: {
            name: string;
            confidence: "low" | "medium" | "high";
            evidence: string[];
            version?: string | undefined;
        }[];
        primaryLanguage: string;
        totalLines?: number | undefined;
    };
    structure: {
        symbols: {
            total: number;
            byKind: Record<string, number>;
            exported: number;
            public: number;
        };
        files: {
            total: number;
            byType: Record<string, number>;
            byParadigm: Record<string, number>;
        };
        modules: {
            total: number;
            averageSize: number;
            largest: string;
        };
    };
    dependencies: {
        internal: {
            totalConnections: number;
            averagePerFile: number;
            mostConnectedFiles: {
                path: string;
                incomingCount: number;
                outgoingCount: number;
            }[];
        };
        external: {
            totalPackages: number;
            directDependencies: number;
            topPackages: {
                name: string;
                usageCount: number;
            }[];
        };
    };
    metrics?: {
        complexity: {
            high: number;
            average: number;
        };
        maintainability: {
            issues: string[];
            score: number;
        };
        testCoverage?: {
            totalFiles: number;
            percentage: number;
            testedFiles: number;
        } | undefined;
    } | undefined;
    moduleGraph?: {
        nodes: {
            type: string;
            id: string;
            name: string;
            fileCount: number;
        }[];
        edges: {
            from: string;
            to: string;
            weight: number;
        }[];
    } | undefined;
}, {
    metadata: {
        totalFiles: number;
        languages: {
            language: string;
            fileCount: number;
            percentage: number;
        }[];
        frameworks: {
            name: string;
            confidence: "low" | "medium" | "high";
            evidence: string[];
            version?: string | undefined;
        }[];
        primaryLanguage: string;
        totalLines?: number | undefined;
    };
    structure: {
        symbols: {
            total: number;
            byKind: Record<string, number>;
            exported: number;
            public: number;
        };
        files: {
            total: number;
            byType: Record<string, number>;
            byParadigm: Record<string, number>;
        };
        modules: {
            total: number;
            averageSize: number;
            largest: string;
        };
    };
    dependencies: {
        internal: {
            totalConnections: number;
            averagePerFile: number;
            mostConnectedFiles: {
                path: string;
                incomingCount: number;
                outgoingCount: number;
            }[];
        };
        external: {
            totalPackages: number;
            directDependencies: number;
            topPackages: {
                name: string;
                usageCount: number;
            }[];
        };
    };
    metrics?: {
        complexity: {
            high: number;
            average: number;
        };
        maintainability: {
            issues: string[];
            score: number;
        };
        testCoverage?: {
            totalFiles: number;
            percentage: number;
            testedFiles: number;
        } | undefined;
    } | undefined;
    moduleGraph?: {
        nodes: {
            type: string;
            id: string;
            name: string;
            fileCount: number;
        }[];
        edges: {
            from: string;
            to: string;
            weight: number;
        }[];
    } | undefined;
}>;
type GetArchitectureOverviewResult = z.infer<typeof getArchitectureOverviewResultSchema>;

/**
 * Ping Tool Schemas
 *
 * Zod schemas for the ping MCP tool.
 * Provides a lightweight connectivity check that validates authentication,
 * configuration, and project access without querying Neo4j.
 */

/**
 * Input parameters schema for ping (none required)
 * Accepts empty object, rejects unknown fields
 */
declare const pingParamsSchema: z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>;
type PingParams = z.infer<typeof pingParamsSchema>;
/**
 * Ping result schema - simple acknowledgment
 */
declare const pingResultSchema: z.ZodObject<{
    /** Always true on success - indicates connectivity verified */
    pong: z.ZodLiteral<true>;
}, "strip", z.ZodTypeAny, {
    pong: true;
}, {
    pong: true;
}>;
type PingResult = z.infer<typeof pingResultSchema>;

export { type ApiResponse, type BreakingChangeRisk, type CallGraphRoot, type CalleeNode, type CallerNode, type CircularDependencyCycle, type ConfidenceScore, type DataQualityMetadata, type DependencyMetrics, type DependencyOverview, type DependentMetrics, type DirectDependency, type DirectDependent, type DirectUsage, ENTRY_POINT_PATTERNS, type FileLocation, type FindCircularDependenciesParams, type FindCircularDependenciesResult, type FindOrphanedCodeParams, type FindOrphanedCodeResult, type FrameworkInfo, type GetArchitectureOverviewParams, type GetArchitectureOverviewResult, type GetCallGraphParams, type GetCallGraphResult, type GetDependenciesParams, type GetDependenciesResult, type GetDependentsParams, type GetDependentsResult, type GetSymbolDetailsParams, type GraphRepresentation, type ImpactAnalysisParams, type ImpactAnalysisResult, type ImpactScore, type ImpactedFile, type ImpactedSymbol, type LanguageInfo, type LanguageMetadata, type ModuleGraph, type ModuleGraphEdge, type ModuleGraphNode, type OrphanedFile, type OrphanedSymbol, type PackageDependency, type PaginationMetadata, type PingParams, type PingResult, type ProjectMetadata, type QualityMetrics, type RelationshipDirections, type RiskLevel, type SearchSymbolsParams, type SearchSymbolsResult, type StandardGraphEdge, type StandardGraphNode, type StructureStatistics, type SymbolDetails, type SymbolDetailsResult, type SymbolInfo, type SymbolKindCategory, type SymbolReference, type SymbolRelationships, type SymbolUsageReference, TEST_PATTERNS, type TraceSymbolUsageParams, type TraceSymbolUsageResult, type TracedSymbol, type TransitiveDependency, type TransitiveDependent, type TransitiveUsage, apiErrorResponseSchema, apiResponseSchema, breakingChangeRiskSchema, callGraphRootSchema, calleeNodeSchema, callerNodeSchema, circularDependencyCycleSchema, confidenceScoreSchema, dataQualityMetadataSchema, dependencyMetricsSchema, dependencyOverviewSchema, dependentMetricsSchema, directDependencySchema, directDependentSchema, directUsageSchema, fileLocationSchema, findCircularDependenciesParamsSchema, findCircularDependenciesResultSchema, findOrphanedCodeParamsSchema, findOrphanedCodeResultSchema, frameworkInfoSchema, getArchitectureOverviewParamsSchema, getArchitectureOverviewResultSchema, getCallGraphParamsSchema, getCallGraphResultSchema, getDependenciesParamsSchema, getDependenciesResultSchema, getDependentsParamsSchema, getDependentsResultSchema, getSymbolDetailsParamsSchema, graphRepresentationSchema, impactAnalysisParamsSchema, impactAnalysisResultSchema, impactScoreSchema, impactedFileSchema, impactedSymbolSchema, isErrorResponse, isSuccessResponse, languageInfoSchema, languageMetadataSchema, moduleGraphEdgeSchema, moduleGraphNodeSchema, moduleGraphSchema, orphanedFileSchema, orphanedSymbolSchema, packageDependencySchema, paginationMetadataSchema, pingParamsSchema, pingResultSchema, projectMetadataSchema, qualityMetricsSchema, relationshipDirectionsSchema, riskLevelSchema, searchSymbolsParamsSchema, searchSymbolsResultSchema, standardGraphEdgeSchema, standardGraphNodeSchema, stringRelationshipDirectionsSchema, structureStatisticsSchema, symbolDetailsResultSchema, symbolDetailsSchema, symbolInfoSchema, symbolKindCategorySchema, symbolReferenceSchema, symbolRelationshipsSchema, symbolUsageReferenceSchema, traceSymbolUsageParamsSchema, traceSymbolUsageResultSchema, tracedSymbolSchema, transitiveDependencySchema, transitiveDependentSchema, transitiveUsageSchema };
