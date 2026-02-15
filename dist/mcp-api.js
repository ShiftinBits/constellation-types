'use strict';

var zod = require('zod');

// src/common.schema.ts
var paginationMetadataSchema = zod.z.object({
  /** Total number of matching items (before pagination) */
  total: zod.z.number().int().nonnegative(),
  /** Number of items returned in this response */
  returned: zod.z.number().int().nonnegative(),
  /** Whether more results are available */
  hasMore: zod.z.boolean(),
  /** Offset for the next page (if hasMore is true) */
  nextOffset: zod.z.number().int().nonnegative().optional(),
  /** Current offset (for context) */
  currentOffset: zod.z.number().int().nonnegative().optional()
});
var confidenceScoreSchema = zod.z.object({
  /** Overall confidence level (0-1 scale) */
  overall: zod.z.number().min(0).max(1),
  /** Detailed confidence factors */
  factors: zod.z.object({
    /** How recent/fresh is the analyzed data (0-1) */
    dataFreshness: zod.z.number().min(0).max(1).optional(),
    /** How complete is the analysis coverage (0-1) */
    coverageComplete: zod.z.number().min(0).max(1).optional(),
    /** Accuracy of heuristic pattern matching (0-1) */
    heuristicAccuracy: zod.z.number().min(0).max(1).optional(),
    /** Semantic analysis depth (0-1) */
    semanticAnalysisDepth: zod.z.number().min(0).max(1).optional(),
    /** Pattern match quality (0-1) */
    patternMatchQuality: zod.z.number().min(0).max(1).optional()
  }).optional(),
  /** Known limitations or warnings about the analysis */
  warnings: zod.z.array(zod.z.string()).optional(),
  /** Recommendations for improving confidence */
  recommendations: zod.z.array(zod.z.string()).optional()
});
var dataQualityMetadataSchema = zod.z.object({
  /** Overall data quality score (0-100) */
  qualityScore: zod.z.number().min(0).max(100).optional(),
  /** When was this data last updated/analyzed */
  lastUpdated: zod.z.string().optional(),
  /** Whether this data is from cache or fresh analysis */
  cached: zod.z.boolean().optional(),
  /** How long the analysis took (milliseconds) */
  executionTime: zod.z.number().nonnegative().optional(),
  /** Percentage of codebase analyzed (0-100) */
  coveragePercentage: zod.z.number().min(0).max(100).optional(),
  /** Any data quality issues or limitations */
  issues: zod.z.array(zod.z.string()).optional()
});
var languageMetadataSchema = zod.z.object({
  /** Programming language identifier */
  language: zod.z.string(),
  // 'typescript', 'python', 'java', 'go', 'rust', etc.
  /** Language-specific features/modifiers */
  features: zod.z.array(zod.z.string()).optional(),
  // ['async', 'static', 'abstract', 'const', 'readonly']
  /** Language-specific visibility rules */
  visibility: zod.z.string().optional(),
  // Interpreted per language
  /** Decorators, annotations, attributes */
  decorators: zod.z.array(zod.z.string()).optional(),
  /** Language-specific type information (stored as JSON) */
  typeInfo: zod.z.any().optional(),
  /** Additional language-specific metadata */
  custom: zod.z.record(zod.z.string(), zod.z.any()).optional()
});
var symbolKindCategorySchema = zod.z.enum([
  "function",
  "class",
  "interface",
  "type",
  "variable",
  "constant",
  "enum",
  "module",
  "namespace",
  "method",
  "property",
  "parameter",
  "constructor",
  "decorator",
  "trait",
  "struct",
  "macro",
  "unknown"
]);
var riskLevelSchema = zod.z.enum(["low", "medium", "high", "critical"]);
var fileLocationSchema = zod.z.object({
  /** File path (relative to project root) */
  filePath: zod.z.string(),
  /** Optional line number */
  line: zod.z.number().int().positive().optional(),
  /** Optional line range start */
  lineStart: zod.z.number().int().positive().optional(),
  /** Optional line range end */
  lineEnd: zod.z.number().int().positive().optional(),
  /** Optional column number */
  column: zod.z.number().int().nonnegative().optional()
});
var symbolReferenceSchema = fileLocationSchema.extend({
  /** Symbol identifier */
  symbolId: zod.z.string().optional(),
  /** Symbol name */
  symbolName: zod.z.string().optional(),
  /** Symbol kind category */
  symbolKind: zod.z.string().optional()
});
var relationshipDirectionsSchema = (itemSchema) => zod.z.object({
  /** Outgoing relationship: this item relates TO these items */
  outgoing: zod.z.array(itemSchema),
  /** Incoming relationship: these items relate TO this item */
  incoming: zod.z.array(itemSchema)
});
var stringRelationshipDirectionsSchema = zod.z.object({
  outgoing: zod.z.array(zod.z.string()),
  incoming: zod.z.array(zod.z.string())
});
var standardGraphNodeSchema = zod.z.object({
  /** Unique node identifier */
  id: zod.z.string(),
  /** Display name */
  name: zod.z.string(),
  /** Node type/category */
  type: zod.z.string(),
  /** Additional properties */
  properties: zod.z.record(zod.z.string(), zod.z.any()).optional()
});
var standardGraphEdgeSchema = zod.z.object({
  /** Source node ID */
  from: zod.z.string(),
  /** Target node ID */
  to: zod.z.string(),
  /** Edge type/label */
  type: zod.z.string().optional(),
  /** Edge weight (for weighted graphs) */
  weight: zod.z.number().optional(),
  /** Additional properties */
  properties: zod.z.record(zod.z.string(), zod.z.any()).optional()
});
var graphRepresentationSchema = zod.z.object({
  /** Graph nodes */
  nodes: zod.z.array(standardGraphNodeSchema),
  /** Graph edges */
  edges: zod.z.array(standardGraphEdgeSchema),
  /** Optional metadata about the graph */
  metadata: zod.z.object({
    /** Number of nodes */
    nodeCount: zod.z.number().int().nonnegative(),
    /** Number of edges */
    edgeCount: zod.z.number().int().nonnegative(),
    /** Whether this is a directed graph */
    directed: zod.z.boolean(),
    /** Whether this graph contains cycles */
    hasCycles: zod.z.boolean().optional()
  }).optional()
});
var TEST_PATTERNS = {
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
  elixir: /_test\.exs$/
};
var ENTRY_POINT_PATTERNS = {
  javascript: [/\/main\.js$/, /\/index\.js$/, /\/server\.js$/, /\/app\.js$/],
  typescript: [/\/main\.ts$/, /\/index\.ts$/, /\/server\.ts$/, /\/app\.ts$/],
  python: [
    /__main__\.py$/,
    /\/main\.py$/,
    /\/app\.py$/,
    /\/manage\.py$/,
    /\/run\.py$/
  ],
  java: [/Main\.java$/, /Application\.java$/],
  go: [/\/main\.go$/],
  rust: [/\/main\.rs$/],
  ruby: [/\/main\.rb$/, /\/application\.rb$/],
  php: [/\/index\.php$/, /\/app\.php$/],
  csharp: [/Program\.cs$/, /Main\.cs$/]
};
var apiResponseSchema = (dataSchema) => zod.z.object({
  success: zod.z.literal(true),
  data: dataSchema
});
var apiErrorResponseSchema = zod.z.object({
  success: zod.z.literal(false),
  error: zod.z.object({
    code: zod.z.string(),
    message: zod.z.string(),
    details: zod.z.any().optional()
  })
});
function isSuccessResponse(response) {
  return response.success === true;
}
function isErrorResponse(response) {
  return response.success === false;
}
var searchSymbolsParamsSchema = zod.z.object({
  /** Name or pattern to search for (max: 200 chars) */
  query: zod.z.string().min(1).max(200),
  /** Filter by symbol type (use strings for language-agnostic extensibility) */
  filterByKind: zod.z.array(zod.z.string()).optional(),
  /** Filter by access modifier (public, private, protected) */
  filterByVisibility: zod.z.array(zod.z.string()).optional(),
  /** Only return exported symbols */
  isExported: zod.z.boolean().optional(),
  /** Filter results to file paths matching this pattern (supports glob and regex) */
  filterByFile: zod.z.string().optional(),
  /** Maximum number of results (default: 50, max: 100) */
  limit: zod.z.number().int().positive().max(100).default(50),
  /** Offset for pagination (default: 0) */
  offset: zod.z.number().int().nonnegative().default(0),
  /** Include usage count information */
  includeUsageCount: zod.z.boolean().optional(),
  /** Include full documentation */
  includeDocumentation: zod.z.boolean().optional()
});
var symbolInfoSchema = fileLocationSchema.extend({
  /** Unique symbol identifier */
  id: zod.z.string(),
  /** Symbol name */
  name: zod.z.string(),
  /** Fully qualified name (e.g., file.class.method) */
  qualifiedName: zod.z.string(),
  /** Type of symbol (language-agnostic string) */
  kind: zod.z.string(),
  /** Full function/method signature */
  signature: zod.z.string().optional(),
  /** Documentation/docstring (if includeDocumentation=true) */
  documentation: zod.z.string().optional(),
  /** Access modifier */
  visibility: zod.z.string().optional(),
  /** Whether the symbol is exported */
  isExported: zod.z.boolean(),
  /** Number of places that use this symbol (if includeUsageCount=true) */
  usageCount: zod.z.number().int().nonnegative().optional(),
  /** Language-specific metadata */
  languageMetadata: languageMetadataSchema.optional()
});
var searchSymbolsResultSchema = zod.z.object({
  /** Array of matching symbols */
  symbols: zod.z.array(symbolInfoSchema),
  /** Pagination information */
  pagination: paginationMetadataSchema.optional()
});
var getSymbolDetailsParamsSchema = zod.z.object({
  /** Symbol ID if known */
  symbolId: zod.z.string().optional(),
  /** Search by symbol name (requires filePath) */
  symbolName: zod.z.string().optional(),
  /** Narrow search to specific file */
  filePath: zod.z.string().optional(),
  /** Include all usage locations */
  includeReferences: zod.z.boolean().optional(),
  /** Include calls, inheritance, etc. */
  includeRelationships: zod.z.boolean().optional(),
  /** Include impact scoring */
  includeImpactScore: zod.z.boolean().optional()
});
var symbolDetailsSchema = fileLocationSchema.extend({
  /** Unique symbol identifier */
  id: zod.z.string(),
  /** Symbol name */
  name: zod.z.string(),
  /** Fully qualified name */
  qualifiedName: zod.z.string(),
  /** Type of symbol (language-agnostic string) */
  kind: zod.z.string(),
  /** Full signature (for functions/methods) */
  signature: zod.z.string().optional(),
  /** Documentation/docstring */
  documentation: zod.z.string().optional(),
  /** Access modifier */
  visibility: zod.z.string().optional(),
  /** Symbol modifiers (static, abstract, async, etc.) */
  modifiers: zod.z.array(zod.z.string()).optional(),
  /** Type information */
  typeInfo: zod.z.any().optional(),
  /** Decorators/annotations */
  decorators: zod.z.array(zod.z.string()).optional(),
  /** Whether the symbol is exported */
  isExported: zod.z.boolean(),
  /** Whether marked as deprecated */
  isDeprecated: zod.z.boolean(),
  /** Language-specific metadata */
  languageMetadata: languageMetadataSchema.optional()
});
var symbolUsageReferenceSchema = fileLocationSchema.extend({
  /** Type of usage */
  usageType: zod.z.string(),
  // import, call, type, inherit, reference
  /** Additional context */
  context: zod.z.string().optional(),
  /** Alias if renamed on import */
  aliasName: zod.z.string().optional()
});
var symbolRelationshipsSchema = zod.z.object({
  /** Symbols this calls */
  calls: zod.z.array(zod.z.string()),
  /** Symbols that call this */
  calledBy: zod.z.array(zod.z.string()),
  /** Parent classes/interfaces */
  inheritsFrom: zod.z.array(zod.z.string()),
  /** Child classes */
  inheritedBy: zod.z.array(zod.z.string()),
  /** Nested symbols (methods, properties) */
  children: zod.z.array(zod.z.string())
});
var impactScoreSchema = zod.z.object({
  /** Direct usage count */
  directUsage: zod.z.number().int().nonnegative(),
  /** Transitive impact score */
  transitiveImpact: zod.z.number().int().nonnegative(),
  /** Risk score for making changes (0-100) */
  riskScore: zod.z.number().min(0).max(100),
  /** Risk level category */
  riskLevel: riskLevelSchema
});
var symbolDetailsResultSchema = zod.z.object({
  /** Symbol information */
  symbol: symbolDetailsSchema,
  /** Usage locations (if includeReferences=true) */
  references: zod.z.array(symbolUsageReferenceSchema).optional(),
  /** Relationship information (if includeRelationships=true) */
  relationships: symbolRelationshipsSchema.optional(),
  /** Impact metrics (if includeImpactScore=true) */
  impactScore: impactScoreSchema.optional()
});
var getDependenciesParamsSchema = zod.z.object({
  /** File path to analyze */
  filePath: zod.z.string().min(1),
  /** Dependency depth: 1=direct, 2+=transitive, 0=all (max: 10) */
  depth: zod.z.number().int().nonnegative().max(10).optional(),
  /** Include external package dependencies */
  includePackages: zod.z.boolean().optional(),
  /** Show which symbols are imported from each dependency */
  includeSymbols: zod.z.boolean().optional(),
  /** Maximum number of dependencies to return per page (default: 20, max: 100) */
  limit: zod.z.number().int().positive().max(100).default(20),
  /** Offset for pagination (default: 0) */
  offset: zod.z.number().int().nonnegative().default(0)
});
var directDependencySchema = zod.z.object({
  /** Dependency type: 'file' for internal files, 'module' for external packages */
  type: zod.z.enum(["file", "module"]),
  /** File path (null for external modules) */
  filePath: zod.z.string().nullable(),
  /** Module name for external packages (null for internal files) */
  moduleName: zod.z.string().nullable().optional(),
  /** Symbols imported from this dependency */
  importedSymbols: zod.z.array(zod.z.string()).optional(),
  /** Whether this is a default import */
  isDefault: zod.z.boolean(),
  /** Whether this is a namespace import (import * as X) */
  isNamespace: zod.z.boolean()
});
var transitiveDependencySchema = zod.z.object({
  /** File path */
  filePath: zod.z.string(),
  /** Number of hops from source file */
  distance: zod.z.number().int().positive(),
  /** Dependency chain showing how it's reached */
  path: zod.z.array(zod.z.string())
});
var packageDependencySchema = zod.z.object({
  /** Package name */
  name: zod.z.string(),
  /** Package version if available */
  version: zod.z.string().optional(),
  /** Dependency type */
  type: zod.z.string()
  // production, development, peer, optional
});
var dependencyMetricsSchema = zod.z.object({
  /** Total number of file dependencies */
  totalFiles: zod.z.number().int().nonnegative(),
  /** Total number of package dependencies */
  totalPackages: zod.z.number().int().nonnegative(),
  /** Maximum dependency depth */
  maxDepth: zod.z.number().int().nonnegative()
});
var getDependenciesResultSchema = zod.z.object({
  /** Source file being analyzed */
  file: zod.z.string(),
  /** Direct (immediate) dependencies */
  directDependencies: zod.z.array(directDependencySchema),
  /** Transitive (indirect) dependencies */
  transitiveDependencies: zod.z.array(transitiveDependencySchema).optional(),
  /** External package dependencies */
  packages: zod.z.array(packageDependencySchema).optional()
});
var getDependentsParamsSchema = zod.z.object({
  /** File path to analyze */
  filePath: zod.z.string().min(1),
  /** Dependency depth for transitive dependents (max: 10) */
  depth: zod.z.number().int().nonnegative().max(10).optional(),
  /** Show which symbols are used by each dependent */
  includeSymbols: zod.z.boolean().optional(),
  /** Include impact metrics and risk assessment */
  includeImpactMetrics: zod.z.boolean().optional(),
  /** Maximum number of dependents to return per page (default: 20, max: 100) */
  limit: zod.z.number().int().positive().max(100).default(20),
  /** Offset for pagination (default: 0) */
  offset: zod.z.number().int().nonnegative().default(0)
});
var directDependentSchema = zod.z.object({
  /** Dependent file path */
  filePath: zod.z.string(),
  /** Symbols used from the source file */
  usedSymbols: zod.z.array(zod.z.string()).optional()
});
var transitiveDependentSchema = zod.z.object({
  /** File path */
  filePath: zod.z.string(),
  /** Number of hops from source file */
  distance: zod.z.number().int().positive(),
  /** Impact chain showing how it's reached */
  path: zod.z.array(zod.z.string())
});
var dependentMetricsSchema = zod.z.object({
  /** Total number of dependent files */
  totalFiles: zod.z.number().int().nonnegative(),
  /** Maximum dependent depth */
  maxDepth: zod.z.number().int().nonnegative(),
  /** Risk level based on dependent count */
  riskLevel: riskLevelSchema
});
var getDependentsResultSchema = zod.z.object({
  /** Source file being analyzed */
  file: zod.z.string(),
  /** Direct (immediate) dependents */
  directDependents: zod.z.array(directDependentSchema),
  /** Transitive (indirect) dependents */
  transitiveDependents: zod.z.array(transitiveDependentSchema).optional(),
  /** Detailed metrics (if includeImpactMetrics=true) */
  detailedMetrics: zod.z.object({
    byDepth: zod.z.record(zod.z.string(), zod.z.number()),
    criticalPaths: zod.z.array(zod.z.array(zod.z.string())),
    mostImpactedFiles: zod.z.array(zod.z.string())
  }).optional()
});
var findCircularDependenciesParamsSchema = zod.z.object({
  /** Check if a specific file is involved in any cycles */
  filePath: zod.z.string().min(1).optional(),
  /** Filter cycles by minimum length (min: 2, max: 10) */
  minCycleLength: zod.z.number().int().min(2).max(10).optional(),
  /** Filter cycles by maximum length (min: 2, max: 10) */
  maxCycleLength: zod.z.number().int().min(2).max(10).optional(),
  /** Maximum number of cycles to return */
  limit: zod.z.number().int().positive().max(100).default(50),
  /** Pagination offset */
  offset: zod.z.number().int().nonnegative().default(0),
  /** Include impact scoring for each cycle */
  includeImpactScore: zod.z.boolean().optional(),
  /** Include confidence assessment */
  includeConfidence: zod.z.boolean().optional()
});
var circularDependencyCycleSchema = zod.z.object({
  /** Files involved in the cycle */
  files: zod.z.array(zod.z.string()),
  /** Number of files in the cycle */
  length: zod.z.number().int().positive(),
  /** Impact score based on file importance (if includeImpactScore=true) */
  impactScore: zod.z.number().min(0).max(100).optional(),
  /** Severity level */
  severity: riskLevelSchema
});
var findCircularDependenciesResultSchema = zod.z.object({
  /** Detected circular dependency cycles */
  cycles: zod.z.array(circularDependencyCycleSchema)
});
var traceSymbolUsageParamsSchema = zod.z.object({
  /** Symbol ID if known */
  symbolId: zod.z.string().optional(),
  /** Symbol name (requires filePath) */
  symbolName: zod.z.string().optional(),
  /** File path where symbol is defined */
  filePath: zod.z.string().optional(),
  /** Filter by specific usage types */
  filterByUsageType: zod.z.array(zod.z.string()).optional(),
  /** Filter by relationship type (CALLS, REFERENCES, IMPORTS, etc.) */
  filterByRelationshipType: zod.z.array(zod.z.string()).optional(),
  /** Include indirect (transitive) usage */
  includeTransitive: zod.z.boolean().optional(),
  /** Include usage context (code snippets) */
  includeContext: zod.z.boolean().optional(),
  /** Exclude test files from results */
  excludeTests: zod.z.boolean().optional(),
  /** Exclude generated files from results */
  excludeGenerated: zod.z.boolean().optional(),
  /** Include importance weighting in results */
  includeImportanceWeight: zod.z.boolean().optional(),
  /** Maximum results to return */
  limit: zod.z.number().int().positive().max(100).default(50),
  /** Pagination offset */
  offset: zod.z.number().int().nonnegative().default(0)
});
var tracedSymbolSchema = zod.z.object({
  /** Symbol being traced */
  name: zod.z.string(),
  /** Symbol kind */
  kind: zod.z.string(),
  /** File where symbol is defined */
  filePath: zod.z.string()
});
var directUsageSchema = zod.z.object({
  /** File path where symbol is used */
  filePath: zod.z.string(),
  /** Type of usage */
  usageType: zod.z.string(),
  // import, call, type, inherit, reference
  /** Relationship type (CALLS, REFERENCES, IMPORTS, etc.) */
  relationshipType: zod.z.string(),
  /** Line number where usage occurs */
  line: zod.z.number().int().positive().optional(),
  /** Column number where usage occurs */
  column: zod.z.number().int().nonnegative().optional(),
  /** Enclosing symbol (function/class containing this usage) */
  enclosingSymbol: zod.z.object({
    name: zod.z.string(),
    kind: zod.z.string()
  }).optional(),
  /** Surrounding code context (if includeContext=true) */
  context: zod.z.string().optional(),
  /** Alias if symbol was renamed on import */
  aliasName: zod.z.string().optional(),
  /** Whether this is a test file */
  isTest: zod.z.boolean().optional(),
  /** Whether this is a generated file */
  isGenerated: zod.z.boolean().optional(),
  /** Importance weight (0.0-1.0, if includeImportanceWeight=true) */
  importanceWeight: zod.z.number().min(0).max(1).optional()
});
var transitiveUsageSchema = zod.z.object({
  /** File path */
  filePath: zod.z.string(),
  /** Number of hops from source symbol */
  distance: zod.z.number().int().positive(),
  /** Chain showing how it's reached */
  chain: zod.z.array(zod.z.string())
});
var traceSymbolUsageResultSchema = zod.z.object({
  /** Symbol being traced */
  symbol: tracedSymbolSchema,
  /** Direct usages of the symbol */
  directUsages: zod.z.array(directUsageSchema),
  /** Transitive usages (if includeTransitive=true) */
  transitiveUsages: zod.z.array(transitiveUsageSchema).optional()
});
var getCallGraphParamsSchema = zod.z.object({
  /** Symbol ID to analyze (if known) */
  symbolId: zod.z.string().optional(),
  /** Symbol name (requires filePath if symbolId not provided) */
  symbolName: zod.z.string().optional(),
  /** File path where function is defined */
  filePath: zod.z.string().optional(),
  /** Direction of call graph to retrieve (default: 'both') */
  direction: zod.z.enum(["callers", "callees", "both"]).default("both"),
  /** Maximum depth to traverse */
  depth: zod.z.number().int().positive().max(10).default(3),
  /** Exclude external/package calls */
  excludeExternal: zod.z.boolean().optional(),
  /** Include graph representation */
  includeGraph: zod.z.boolean().optional(),
  /** Maximum number of call relationships to return per page (default: 25, max: 100) */
  limit: zod.z.number().int().positive().max(100).default(25),
  /** Offset for pagination (default: 0) */
  offset: zod.z.number().int().nonnegative().default(0)
});
var callGraphRootSchema = zod.z.object({
  /** Symbol ID */
  symbolId: zod.z.string(),
  /** Symbol name */
  name: zod.z.string(),
  /** File path */
  filePath: zod.z.string(),
  /** Line number */
  line: zod.z.number().int().positive(),
  /** Column number */
  column: zod.z.number().int().nonnegative()
});
var callerNodeSchema = zod.z.object({
  /** Symbol ID */
  symbolId: zod.z.string(),
  /** Symbol name */
  name: zod.z.string(),
  /** File path */
  filePath: zod.z.string(),
  /** Line number */
  line: zod.z.number().int().positive(),
  /** Column number */
  column: zod.z.number().int().nonnegative(),
  /** Depth from root */
  depth: zod.z.number().int().nonnegative()
});
var calleeNodeSchema = zod.z.object({
  /** Symbol ID */
  symbolId: zod.z.string(),
  /** Symbol name */
  name: zod.z.string(),
  /** File path */
  filePath: zod.z.string(),
  /** Line number */
  line: zod.z.number().int().positive(),
  /** Column number */
  column: zod.z.number().int().nonnegative(),
  /** Whether call is async */
  isAsync: zod.z.boolean(),
  /** Depth from root */
  depth: zod.z.number().int().nonnegative()
});
var getCallGraphResultSchema = zod.z.object({
  /** Root symbol */
  root: callGraphRootSchema,
  /** Functions that call this symbol (if direction includes 'callers') */
  callers: zod.z.array(callerNodeSchema).optional(),
  /** Functions this symbol calls (if direction includes 'callees') */
  callees: zod.z.array(calleeNodeSchema).optional(),
  /** Graph representation (if includeGraph=true) */
  graph: graphRepresentationSchema.optional()
});
var impactAnalysisParamsSchema = zod.z.object({
  /** Symbol ID to analyze impact for */
  symbolId: zod.z.string().optional(),
  /** Qualified name to analyze impact for (alternative to symbolId) */
  qualifiedName: zod.z.string().optional(),
  /** Symbol name (requires filePath if symbolId/qualifiedName not provided) */
  symbolName: zod.z.string().optional(),
  /** File path where symbol is defined */
  filePath: zod.z.string().optional(),
  /** Include direct dependents (symbols that directly use this symbol) @default true */
  includeDirectDependents: zod.z.boolean().default(true),
  /** Include transitive dependents (symbols that transitively depend on this symbol) @default true */
  includeTransitiveDependents: zod.z.boolean().default(true),
  /** Maximum depth for transitive analysis (1-5) @default 3 */
  depth: zod.z.number().int().min(1).max(5).default(3),
  /** Exclude test files from impact analysis @default true */
  excludeTests: zod.z.boolean().default(true),
  /** Exclude generated files from impact analysis @default true */
  excludeGenerated: zod.z.boolean().default(true),
  /** Analyze breaking change potential @default true */
  analyzeBreakingChanges: zod.z.boolean().default(true)
});
var impactedSymbolSchema = fileLocationSchema.extend({
  /** Symbol ID */
  id: zod.z.string(),
  /** Symbol name */
  name: zod.z.string(),
  /** Fully qualified name */
  qualifiedName: zod.z.string(),
  /** Symbol kind (function, class, variable, etc.) */
  kind: zod.z.string(),
  /** Type of relationship (CALLS, REFERENCES, DEPENDS_ON, etc.) */
  relationshipType: zod.z.string(),
  /** Depth in the dependency chain (1 = direct, 2+ = transitive) */
  depth: zod.z.number().int().positive(),
  /** Whether this symbol is exported (potential breaking change risk) */
  isExported: zod.z.boolean().optional(),
  /** Number of symbols that depend on this impacted symbol */
  transitiveImpactCount: zod.z.number().int().nonnegative().optional()
});
var impactedFileSchema = zod.z.object({
  /** File path */
  filePath: zod.z.string(),
  /** Number of symbols in this file that are impacted */
  symbolCount: zod.z.number().int().positive(),
  /** Whether this is a test file */
  isTest: zod.z.boolean().optional(),
  /** Whether this is a generated file */
  isGenerated: zod.z.boolean().optional(),
  /** List of impacted symbols in this file */
  symbols: zod.z.array(
    zod.z.object({
      id: zod.z.string(),
      name: zod.z.string(),
      kind: zod.z.string(),
      line: zod.z.number().int().positive()
    })
  )
});
var breakingChangeRiskSchema = zod.z.object({
  /** Overall risk level (low, medium, high, critical) */
  riskLevel: riskLevelSchema,
  /** Risk factors contributing to the assessment */
  factors: zod.z.array(
    zod.z.object({
      /** Factor name */
      factor: zod.z.string(),
      /** Severity of this factor (low, medium, high) */
      severity: zod.z.enum(["low", "medium", "high"]),
      /** Description of why this is a risk factor */
      description: zod.z.string()
    })
  ),
  /** Recommendations for mitigating breaking changes */
  recommendations: zod.z.array(zod.z.string())
});
var impactAnalysisResultSchema = zod.z.object({
  /** The symbol being analyzed */
  symbol: zod.z.object({
    id: zod.z.string(),
    name: zod.z.string(),
    qualifiedName: zod.z.string(),
    kind: zod.z.string(),
    filePath: zod.z.string(),
    line: zod.z.number().int().positive(),
    column: zod.z.number().int().nonnegative(),
    isExported: zod.z.boolean().optional()
  }),
  /** Direct dependents (depth 1) */
  directDependents: zod.z.array(impactedSymbolSchema).optional(),
  /** Transitive dependents (depth 2+) */
  transitiveDependents: zod.z.array(impactedSymbolSchema).optional(),
  /** Files impacted by changes to this symbol */
  impactedFiles: zod.z.array(impactedFileSchema),
  /** Breaking change risk assessment */
  breakingChangeRisk: breakingChangeRiskSchema.optional(),
  /** Summary statistics */
  summary: zod.z.object({
    /** Total number of directly dependent symbols */
    directDependentCount: zod.z.number().int().nonnegative(),
    /** Total number of transitively dependent symbols */
    transitiveDependentCount: zod.z.number().int().nonnegative(),
    /** Total number of impacted files */
    impactedFileCount: zod.z.number().int().nonnegative(),
    /** Number of impacted test files */
    testFileCount: zod.z.number().int().nonnegative(),
    /** Number of impacted production files (non-test, non-generated) */
    productionFileCount: zod.z.number().int().nonnegative(),
    /** Maximum depth of dependency chain analyzed */
    maxDepth: zod.z.number().int().nonnegative()
  })
});
var findOrphanedCodeParamsSchema = zod.z.object({
  /** File pattern to search */
  filePattern: zod.z.string().optional(),
  /** Filter by symbol kinds */
  filterByKind: zod.z.array(zod.z.string()).optional(),
  /** Only check exported symbols */
  exportedOnly: zod.z.boolean().optional(),
  /** Exclude test files from orphan analysis @default true */
  excludeTests: zod.z.boolean().default(true),
  /** Maximum results to return */
  limit: zod.z.number().int().positive().max(100).default(50),
  /** Pagination offset */
  offset: zod.z.number().int().nonnegative().default(0),
  /** Include confidence scoring */
  includeConfidence: zod.z.boolean().optional()
});
var orphanedSymbolSchema = zod.z.object({
  /** Symbol ID */
  symbolId: zod.z.string(),
  /** Symbol name */
  name: zod.z.string(),
  /** Symbol kind */
  kind: zod.z.string(),
  /** File path */
  filePath: zod.z.string(),
  /** Whether symbol is exported */
  isExported: zod.z.boolean(),
  /** Reason for being orphaned */
  reason: zod.z.string(),
  /** Confidence (0-1) */
  confidence: zod.z.number().min(0).max(1)
});
var orphanedFileSchema = zod.z.object({
  /** File path */
  filePath: zod.z.string(),
  /** Reason for being orphaned */
  reason: zod.z.string(),
  /** Last updated timestamp */
  lastUpdated: zod.z.string(),
  /** Confidence (0-1) */
  confidence: zod.z.number().min(0).max(1)
});
var findOrphanedCodeResultSchema = zod.z.object({
  /** Orphaned symbols */
  orphanedSymbols: zod.z.array(orphanedSymbolSchema),
  /** Orphaned files */
  orphanedFiles: zod.z.array(orphanedFileSchema)
});
var getArchitectureOverviewParamsSchema = zod.z.object({
  /** Include detailed metrics @default false */
  includeMetrics: zod.z.boolean().default(false),
  /** Include module-level graph structure @default false */
  includeModuleGraph: zod.z.boolean().default(false),
  /** Include external package dependency details (production/development classification) @default true */
  includePackages: zod.z.boolean().default(true)
});
var languageInfoSchema = zod.z.object({
  language: zod.z.string(),
  fileCount: zod.z.number().int().nonnegative(),
  percentage: zod.z.number().min(0).max(100)
});
var frameworkInfoSchema = zod.z.object({
  name: zod.z.string(),
  version: zod.z.string().optional(),
  confidence: zod.z.enum(["high", "medium", "low"]),
  evidence: zod.z.array(zod.z.string())
});
var projectMetadataSchema = zod.z.object({
  languages: zod.z.array(languageInfoSchema),
  frameworks: zod.z.array(frameworkInfoSchema),
  primaryLanguage: zod.z.string(),
  totalFiles: zod.z.number().int().nonnegative(),
  totalLines: zod.z.number().int().nonnegative().optional()
});
var structureStatisticsSchema = zod.z.object({
  files: zod.z.object({
    total: zod.z.number().int().nonnegative(),
    byType: zod.z.record(zod.z.string(), zod.z.number()),
    byParadigm: zod.z.record(zod.z.string(), zod.z.number())
  }),
  symbols: zod.z.object({
    total: zod.z.number().int().nonnegative(),
    byKind: zod.z.record(zod.z.string(), zod.z.number()),
    exported: zod.z.number().int().nonnegative(),
    public: zod.z.number().int().nonnegative()
  }),
  modules: zod.z.object({
    total: zod.z.number().int().nonnegative(),
    averageSize: zod.z.number().nonnegative(),
    largest: zod.z.string()
  })
});
var dependencyOverviewSchema = zod.z.object({
  internal: zod.z.object({
    totalConnections: zod.z.number().int().nonnegative(),
    averagePerFile: zod.z.number().nonnegative(),
    mostConnectedFiles: zod.z.array(
      zod.z.object({
        path: zod.z.string(),
        incomingCount: zod.z.number().int().nonnegative(),
        outgoingCount: zod.z.number().int().nonnegative()
      })
    )
  }),
  external: zod.z.object({
    totalPackages: zod.z.number().int().nonnegative(),
    directDependencies: zod.z.number().int().nonnegative(),
    topPackages: zod.z.array(
      zod.z.object({
        name: zod.z.string(),
        usageCount: zod.z.number().int().nonnegative()
      })
    )
  })
});
var qualityMetricsSchema = zod.z.object({
  complexity: zod.z.object({
    average: zod.z.number().nonnegative(),
    high: zod.z.number().int().nonnegative()
    // count of high complexity items
  }),
  maintainability: zod.z.object({
    score: zod.z.number().min(0).max(100),
    // 0-100
    issues: zod.z.array(zod.z.string())
  }),
  testCoverage: zod.z.object({
    percentage: zod.z.number().min(0).max(100),
    testedFiles: zod.z.number().int().nonnegative(),
    totalFiles: zod.z.number().int().nonnegative()
  }).optional()
});
var moduleGraphNodeSchema = zod.z.object({
  id: zod.z.string(),
  name: zod.z.string(),
  fileCount: zod.z.number().int().nonnegative(),
  type: zod.z.string()
});
var moduleGraphEdgeSchema = zod.z.object({
  from: zod.z.string(),
  to: zod.z.string(),
  weight: zod.z.number().int().nonnegative()
  // dependency count
});
var moduleGraphSchema = zod.z.object({
  nodes: zod.z.array(moduleGraphNodeSchema),
  edges: zod.z.array(moduleGraphEdgeSchema)
});
var getArchitectureOverviewResultSchema = zod.z.object({
  /** Project metadata */
  metadata: projectMetadataSchema,
  /** Structure statistics */
  structure: structureStatisticsSchema,
  /** Dependency overview */
  dependencies: dependencyOverviewSchema,
  /** Quality metrics (if includeMetrics=true) */
  metrics: qualityMetricsSchema.optional(),
  /** Module graph (if includeModuleGraph=true) */
  moduleGraph: moduleGraphSchema.optional()
});
var pingParamsSchema = zod.z.object({}).strict();
var pingResultSchema = zod.z.object({
  /** Always true on success - indicates connectivity verified */
  pong: zod.z.literal(true)
});

exports.ENTRY_POINT_PATTERNS = ENTRY_POINT_PATTERNS;
exports.TEST_PATTERNS = TEST_PATTERNS;
exports.apiErrorResponseSchema = apiErrorResponseSchema;
exports.apiResponseSchema = apiResponseSchema;
exports.breakingChangeRiskSchema = breakingChangeRiskSchema;
exports.callGraphRootSchema = callGraphRootSchema;
exports.calleeNodeSchema = calleeNodeSchema;
exports.callerNodeSchema = callerNodeSchema;
exports.circularDependencyCycleSchema = circularDependencyCycleSchema;
exports.confidenceScoreSchema = confidenceScoreSchema;
exports.dataQualityMetadataSchema = dataQualityMetadataSchema;
exports.dependencyMetricsSchema = dependencyMetricsSchema;
exports.dependencyOverviewSchema = dependencyOverviewSchema;
exports.dependentMetricsSchema = dependentMetricsSchema;
exports.directDependencySchema = directDependencySchema;
exports.directDependentSchema = directDependentSchema;
exports.directUsageSchema = directUsageSchema;
exports.fileLocationSchema = fileLocationSchema;
exports.findCircularDependenciesParamsSchema = findCircularDependenciesParamsSchema;
exports.findCircularDependenciesResultSchema = findCircularDependenciesResultSchema;
exports.findOrphanedCodeParamsSchema = findOrphanedCodeParamsSchema;
exports.findOrphanedCodeResultSchema = findOrphanedCodeResultSchema;
exports.frameworkInfoSchema = frameworkInfoSchema;
exports.getArchitectureOverviewParamsSchema = getArchitectureOverviewParamsSchema;
exports.getArchitectureOverviewResultSchema = getArchitectureOverviewResultSchema;
exports.getCallGraphParamsSchema = getCallGraphParamsSchema;
exports.getCallGraphResultSchema = getCallGraphResultSchema;
exports.getDependenciesParamsSchema = getDependenciesParamsSchema;
exports.getDependenciesResultSchema = getDependenciesResultSchema;
exports.getDependentsParamsSchema = getDependentsParamsSchema;
exports.getDependentsResultSchema = getDependentsResultSchema;
exports.getSymbolDetailsParamsSchema = getSymbolDetailsParamsSchema;
exports.graphRepresentationSchema = graphRepresentationSchema;
exports.impactAnalysisParamsSchema = impactAnalysisParamsSchema;
exports.impactAnalysisResultSchema = impactAnalysisResultSchema;
exports.impactScoreSchema = impactScoreSchema;
exports.impactedFileSchema = impactedFileSchema;
exports.impactedSymbolSchema = impactedSymbolSchema;
exports.isErrorResponse = isErrorResponse;
exports.isSuccessResponse = isSuccessResponse;
exports.languageInfoSchema = languageInfoSchema;
exports.languageMetadataSchema = languageMetadataSchema;
exports.moduleGraphEdgeSchema = moduleGraphEdgeSchema;
exports.moduleGraphNodeSchema = moduleGraphNodeSchema;
exports.moduleGraphSchema = moduleGraphSchema;
exports.orphanedFileSchema = orphanedFileSchema;
exports.orphanedSymbolSchema = orphanedSymbolSchema;
exports.packageDependencySchema = packageDependencySchema;
exports.paginationMetadataSchema = paginationMetadataSchema;
exports.pingParamsSchema = pingParamsSchema;
exports.pingResultSchema = pingResultSchema;
exports.projectMetadataSchema = projectMetadataSchema;
exports.qualityMetricsSchema = qualityMetricsSchema;
exports.relationshipDirectionsSchema = relationshipDirectionsSchema;
exports.riskLevelSchema = riskLevelSchema;
exports.searchSymbolsParamsSchema = searchSymbolsParamsSchema;
exports.searchSymbolsResultSchema = searchSymbolsResultSchema;
exports.standardGraphEdgeSchema = standardGraphEdgeSchema;
exports.standardGraphNodeSchema = standardGraphNodeSchema;
exports.stringRelationshipDirectionsSchema = stringRelationshipDirectionsSchema;
exports.structureStatisticsSchema = structureStatisticsSchema;
exports.symbolDetailsResultSchema = symbolDetailsResultSchema;
exports.symbolDetailsSchema = symbolDetailsSchema;
exports.symbolInfoSchema = symbolInfoSchema;
exports.symbolKindCategorySchema = symbolKindCategorySchema;
exports.symbolReferenceSchema = symbolReferenceSchema;
exports.symbolRelationshipsSchema = symbolRelationshipsSchema;
exports.symbolUsageReferenceSchema = symbolUsageReferenceSchema;
exports.traceSymbolUsageParamsSchema = traceSymbolUsageParamsSchema;
exports.traceSymbolUsageResultSchema = traceSymbolUsageResultSchema;
exports.tracedSymbolSchema = tracedSymbolSchema;
exports.transitiveDependencySchema = transitiveDependencySchema;
exports.transitiveDependentSchema = transitiveDependentSchema;
exports.transitiveUsageSchema = transitiveUsageSchema;
//# sourceMappingURL=mcp-api.js.map
//# sourceMappingURL=mcp-api.js.map