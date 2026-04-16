import { z } from 'zod';

// src/common.schema.ts
var paginationMetadataSchema = z.object({
  /** Total number of matching items (before pagination) */
  total: z.number().int().nonnegative(),
  /** Number of items returned in this response */
  returned: z.number().int().nonnegative(),
  /** Whether more results are available */
  hasMore: z.boolean(),
  /** Offset for the next page (if hasMore is true) */
  nextOffset: z.number().int().nonnegative().optional(),
  /** Current offset (for context) */
  currentOffset: z.number().int().nonnegative().optional()
});
var confidenceScoreSchema = z.object({
  /** Overall confidence level (0-1 scale) */
  overall: z.number().min(0).max(1),
  /** Detailed confidence factors */
  factors: z.object({
    /** How recent/fresh is the analyzed data (0-1) */
    dataFreshness: z.number().min(0).max(1).optional(),
    /** How complete is the analysis coverage (0-1) */
    coverageComplete: z.number().min(0).max(1).optional(),
    /** Accuracy of heuristic pattern matching (0-1) */
    heuristicAccuracy: z.number().min(0).max(1).optional(),
    /** Semantic analysis depth (0-1) */
    semanticAnalysisDepth: z.number().min(0).max(1).optional(),
    /** Pattern match quality (0-1) */
    patternMatchQuality: z.number().min(0).max(1).optional()
  }).optional(),
  /** Known limitations or warnings about the analysis */
  warnings: z.array(z.string()).optional(),
  /** Recommendations for improving confidence */
  recommendations: z.array(z.string()).optional()
});
var dataQualityMetadataSchema = z.object({
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
  issues: z.array(z.string()).optional()
});
var languageMetadataSchema = z.object({
  /** Programming language identifier */
  language: z.string(),
  // 'typescript', 'python', 'java', 'go', 'rust', etc.
  /** Language-specific features/modifiers */
  features: z.array(z.string()).optional(),
  // ['async', 'static', 'abstract', 'const', 'readonly']
  /** Language-specific visibility rules */
  visibility: z.string().optional(),
  // Interpreted per language
  /** Decorators, annotations, attributes */
  decorators: z.array(z.string()).optional(),
  /** Language-specific type information (stored as JSON) */
  typeInfo: z.any().optional(),
  /** Additional language-specific metadata */
  custom: z.record(z.string(), z.any()).optional()
});
var symbolKindCategorySchema = z.enum([
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
var riskLevelSchema = z.enum(["low", "medium", "high", "critical"]);
var complexityRiskSchema = z.enum([
  "low",
  "moderate",
  "high",
  "very_high"
]);
var complexityMetricsSchema = z.object({
  /** McCabe cyclomatic complexity score (1 = simplest) */
  cyclomaticComplexity: z.number().int().nonnegative(),
  /** Risk category: 1-10 low, 11-20 moderate, 21-50 high, 51+ very_high */
  complexityRisk: complexityRiskSchema
});
var fileLocationSchema = z.object({
  /** File path (relative to project root) */
  filePath: z.string(),
  /** Optional line number */
  line: z.number().int().positive().optional(),
  /** Optional line range start */
  lineStart: z.number().int().positive().optional(),
  /** Optional line range end. Persisted as `endLine` on Neo4j `:Symbol`. */
  lineEnd: z.number().int().positive().optional(),
  /** Optional column number */
  column: z.number().int().nonnegative().optional()
});
var symbolReferenceSchema = fileLocationSchema.extend({
  /** Symbol identifier */
  symbolId: z.string().optional(),
  /** Symbol name */
  symbolName: z.string().optional(),
  /** Symbol kind category */
  symbolKind: z.string().optional()
});
var relationshipDirectionsSchema = (itemSchema) => z.object({
  /** Outgoing relationship: this item relates TO these items */
  outgoing: z.array(itemSchema),
  /** Incoming relationship: these items relate TO this item */
  incoming: z.array(itemSchema)
});
var stringRelationshipDirectionsSchema = z.object({
  outgoing: z.array(z.string()),
  incoming: z.array(z.string())
});
var standardGraphNodeSchema = z.object({
  /** Unique node identifier */
  id: z.string(),
  /** Display name */
  name: z.string(),
  /** Node type/category */
  type: z.string(),
  /** Additional properties */
  properties: z.record(z.string(), z.any()).optional()
});
var standardGraphEdgeSchema = z.object({
  /** Source node ID */
  from: z.string(),
  /** Target node ID */
  to: z.string(),
  /** Edge type/label */
  type: z.string().optional(),
  /** Edge weight (for weighted graphs) */
  weight: z.number().optional(),
  /** Additional properties */
  properties: z.record(z.string(), z.any()).optional()
});
var graphRepresentationSchema = z.object({
  /** Graph nodes */
  nodes: z.array(standardGraphNodeSchema),
  /** Graph edges */
  edges: z.array(standardGraphEdgeSchema),
  /** Optional metadata about the graph */
  metadata: z.object({
    /** Number of nodes */
    nodeCount: z.number().int().nonnegative(),
    /** Number of edges */
    edgeCount: z.number().int().nonnegative(),
    /** Whether this is a directed graph */
    directed: z.boolean(),
    /** Whether this graph contains cycles */
    hasCycles: z.boolean().optional()
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
var PYTHON_STDLIB_MODULES = /* @__PURE__ */ new Set([
  "abc",
  "aifc",
  "argparse",
  "array",
  "ast",
  "asynchat",
  "asyncio",
  "asyncore",
  "atexit",
  "audioop",
  "base64",
  "bdb",
  "binascii",
  "bisect",
  "builtins",
  "bz2",
  "cProfile",
  "calendar",
  "cgi",
  "cgitb",
  "chunk",
  "cmath",
  "cmd",
  "code",
  "codecs",
  "codeop",
  "collections",
  "colorsys",
  "compileall",
  "concurrent",
  "configparser",
  "contextlib",
  "contextvars",
  "copy",
  "copyreg",
  "crypt",
  "csv",
  "ctypes",
  "curses",
  "dataclasses",
  "datetime",
  "dbm",
  "decimal",
  "difflib",
  "dis",
  "distutils",
  "doctest",
  "email",
  "encodings",
  "ensurepip",
  "enum",
  "errno",
  "faulthandler",
  "fcntl",
  "filecmp",
  "fileinput",
  "fnmatch",
  "fractions",
  "ftplib",
  "functools",
  "gc",
  "getopt",
  "getpass",
  "gettext",
  "glob",
  "graphlib",
  "grp",
  "gzip",
  "hashlib",
  "heapq",
  "hmac",
  "html",
  "http",
  "idlelib",
  "imaplib",
  "imghdr",
  "imp",
  "importlib",
  "inspect",
  "io",
  "ipaddress",
  "itertools",
  "json",
  "keyword",
  "lib2to3",
  "linecache",
  "locale",
  "logging",
  "lzma",
  "mailbox",
  "mailcap",
  "marshal",
  "math",
  "mimetypes",
  "mmap",
  "modulefinder",
  "msilib",
  "msvcrt",
  "multiprocessing",
  "netrc",
  "nis",
  "nntplib",
  "numbers",
  "operator",
  "optparse",
  "os",
  "ossaudiodev",
  "pathlib",
  "pdb",
  "pickle",
  "pickletools",
  "pipes",
  "pkgutil",
  "platform",
  "plistlib",
  "poplib",
  "posix",
  "posixpath",
  "pprint",
  "profile",
  "pstats",
  "pty",
  "pwd",
  "py_compile",
  "pyclbr",
  "pydoc",
  "queue",
  "quopri",
  "random",
  "re",
  "readline",
  "reprlib",
  "resource",
  "rlcompleter",
  "runpy",
  "sched",
  "secrets",
  "select",
  "selectors",
  "shelve",
  "shlex",
  "shutil",
  "signal",
  "site",
  "sitecustomize",
  "smtpd",
  "smtplib",
  "sndhdr",
  "socket",
  "socketserver",
  "spwd",
  "sqlite3",
  "ssl",
  "stat",
  "statistics",
  "string",
  "stringprep",
  "struct",
  "subprocess",
  "sunau",
  "symtable",
  "sys",
  "sysconfig",
  "syslog",
  "tabnanny",
  "tarfile",
  "telnetlib",
  "tempfile",
  "termios",
  "test",
  "textwrap",
  "threading",
  "time",
  "timeit",
  "tkinter",
  "token",
  "tokenize",
  "tomllib",
  "trace",
  "traceback",
  "tracemalloc",
  "tty",
  "turtle",
  "turtledemo",
  "types",
  "typing",
  "unicodedata",
  "unittest",
  "urllib",
  "usercustomize",
  "uu",
  "uuid",
  "venv",
  "warnings",
  "wave",
  "weakref",
  "webbrowser",
  "winreg",
  "winsound",
  "wsgiref",
  "xdrlib",
  "xml",
  "xmlrpc",
  "zipapp",
  "zipfile",
  "zipimport",
  "zlib",
  "zoneinfo",
  "_thread",
  "_tkinter",
  "__future__",
  "__main__"
]);
var apiResponseSchema = (dataSchema) => z.object({
  success: z.literal(true),
  data: dataSchema
});
var apiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional()
  })
});
function isSuccessResponse(response) {
  return response.success === true;
}
function isErrorResponse(response) {
  return response.success === false;
}
var searchSymbolsParamsSchema = z.object({
  /** Name or pattern to search for (max: 200 chars). Can be empty when filterByKind or other filters are provided. */
  query: z.string().max(200),
  /** Filter by symbol type (use strings for language-agnostic extensibility) */
  filterByKind: z.array(z.string()).optional(),
  /** Filter by access modifier (public, private, protected) */
  filterByVisibility: z.array(z.string()).optional(),
  /** Only return exported symbols */
  isExported: z.boolean().optional(),
  /** Filter results to file paths matching this pattern (supports glob and regex) */
  filterByFile: z.string().optional(),
  /** Maximum number of results (default: 50, max: 100) */
  limit: z.number().int().positive().max(100).default(50),
  /** Offset for pagination (default: 0) */
  offset: z.number().int().nonnegative().default(0),
  /** Include usage count information */
  includeUsageCount: z.boolean().optional(),
  /** Include full documentation */
  includeDocumentation: z.boolean().optional()
}).refine(
  (data) => data.query.length > 0 || data.filterByKind && data.filterByKind.length > 0 || data.filterByVisibility && data.filterByVisibility.length > 0 || data.isExported !== void 0 || data.filterByFile !== void 0,
  {
    message: "Either query must be non-empty or at least one filter (filterByKind, filterByVisibility, isExported, filterByFile) must be provided",
    path: ["query"]
  }
);
var symbolInfoSchema = fileLocationSchema.extend({
  /** Unique symbol identifier */
  id: z.string(),
  /** Symbol name */
  name: z.string(),
  /** Fully qualified name (e.g., file.class.method) */
  qualifiedName: z.string(),
  /** Type of symbol (language-agnostic string) */
  kind: z.string(),
  /** Full function/method signature */
  signature: z.string().optional(),
  /** Documentation/docstring (if includeDocumentation=true) */
  documentation: z.string().optional(),
  /** Access modifier */
  visibility: z.string().optional(),
  /** Whether the symbol is exported */
  isExported: z.boolean(),
  /** Number of places that use this symbol (if includeUsageCount=true) */
  usageCount: z.number().int().nonnegative().optional(),
  /** Cyclomatic complexity metrics (present on function/method symbols) */
  complexity: complexityMetricsSchema.optional(),
  /** Language-specific metadata */
  languageMetadata: languageMetadataSchema.optional()
});
var searchSymbolsResultSchema = z.object({
  /** Array of matching symbols */
  symbols: z.array(symbolInfoSchema),
  /** Pagination information */
  pagination: paginationMetadataSchema.optional()
});
var getSymbolDetailsParamsSchema = z.object({
  /** Symbol ID if known */
  symbolId: z.string().optional(),
  /** Search by symbol name (requires filePath) */
  symbolName: z.string().optional(),
  /** Narrow search to specific file */
  filePath: z.string().optional(),
  /** Include all usage locations */
  includeReferences: z.boolean().optional(),
  /** Include calls, inheritance, etc. */
  includeRelationships: z.boolean().optional(),
  /** Include impact scoring */
  includeImpactScore: z.boolean().optional()
});
var symbolDetailsSchema = fileLocationSchema.extend({
  /** Unique symbol identifier */
  id: z.string(),
  /** Symbol name */
  name: z.string(),
  /** Fully qualified name */
  qualifiedName: z.string(),
  /** Type of symbol (language-agnostic string) */
  kind: z.string(),
  /** Full signature (for functions/methods) */
  signature: z.string().optional(),
  /** Documentation/docstring */
  documentation: z.string().optional(),
  /** Access modifier */
  visibility: z.string().optional(),
  /** Symbol modifiers (static, abstract, async, etc.) */
  modifiers: z.array(z.string()).optional(),
  /** Type information */
  typeInfo: z.any().optional(),
  /** Decorators/annotations */
  decorators: z.array(z.string()).optional(),
  /** Whether the symbol is exported */
  isExported: z.boolean(),
  /** Whether marked as deprecated */
  isDeprecated: z.boolean(),
  /** Cyclomatic complexity metrics (present on function/method symbols) */
  complexity: complexityMetricsSchema.optional(),
  /** Language-specific metadata */
  languageMetadata: languageMetadataSchema.optional()
});
var symbolUsageReferenceSchema = fileLocationSchema.extend({
  /** Type of usage */
  usageType: z.string(),
  // import, call, type, inherit, reference
  /** Additional context */
  context: z.string().optional(),
  /** Alias if renamed on import */
  aliasName: z.string().optional()
});
var symbolRelationshipsSchema = z.object({
  /** Symbols this calls */
  calls: z.array(z.string()),
  /** Symbols that call this */
  calledBy: z.array(z.string()),
  /** Parent classes/interfaces */
  inheritsFrom: z.array(z.string()),
  /** Child classes */
  inheritedBy: z.array(z.string()),
  /** Nested symbols (methods, properties) */
  children: z.array(z.string())
});
var impactScoreSchema = z.object({
  /** Direct usage count */
  directUsage: z.number().int().nonnegative(),
  /** Transitive impact score */
  transitiveImpact: z.number().int().nonnegative(),
  /** Risk score for making changes (0-100) */
  riskScore: z.number().min(0).max(100),
  /** Risk level category */
  riskLevel: riskLevelSchema
});
var symbolDetailsResultSchema = z.object({
  /** Symbol information */
  symbol: symbolDetailsSchema,
  /** Usage locations (if includeReferences=true) */
  references: z.array(symbolUsageReferenceSchema).optional(),
  /** Relationship information (if includeRelationships=true) */
  relationships: symbolRelationshipsSchema.optional(),
  /** Impact metrics (if includeImpactScore=true) */
  impactScore: impactScoreSchema.optional()
});
var getDependenciesParamsSchema = z.object({
  /** File path to analyze */
  filePath: z.string().min(1),
  /** Dependency depth: 1=direct, 2+=transitive, 0=all (max: 10) */
  depth: z.number().int().nonnegative().max(10).optional(),
  /** Include external package dependencies */
  includePackages: z.boolean().optional(),
  /** Show which symbols are imported from each dependency */
  includeSymbols: z.boolean().optional(),
  /** Maximum number of dependencies to return per page (default: 20, max: 100) */
  limit: z.number().int().positive().max(100).default(20),
  /** Offset for pagination (default: 0) */
  offset: z.number().int().nonnegative().default(0)
});
var directDependencySchema = z.object({
  /** Dependency type: 'file' for internal files, 'module' for external packages */
  type: z.enum(["file", "module"]),
  /** File path (null for external modules) */
  filePath: z.string().nullable(),
  /** Module name for external packages (null for internal files) */
  moduleName: z.string().nullable().optional(),
  /** Symbols imported from this dependency */
  importedSymbols: z.array(z.string()).optional(),
  /** Whether this is a default import */
  isDefault: z.boolean(),
  /** Whether this is a namespace import (import * as X) */
  isNamespace: z.boolean()
});
var transitiveDependencySchema = z.object({
  /** File path */
  filePath: z.string(),
  /** Number of hops from source file */
  distance: z.number().int().positive(),
  /** Dependency chain showing how it's reached */
  path: z.array(z.string())
});
var packageDependencySchema = z.object({
  /** Package name */
  name: z.string(),
  /** Package version if available */
  version: z.string().optional(),
  /** Dependency type */
  type: z.string()
  // production, development, peer, optional
});
var dependencyMetricsSchema = z.object({
  /** Total number of file dependencies */
  totalFiles: z.number().int().nonnegative(),
  /** Total number of package dependencies */
  totalPackages: z.number().int().nonnegative(),
  /** Maximum dependency depth */
  maxDepth: z.number().int().nonnegative()
});
var getDependenciesResultSchema = z.object({
  /** Source file being analyzed */
  file: z.string(),
  /** Direct (immediate) dependencies */
  directDependencies: z.array(directDependencySchema),
  /** Transitive (indirect) dependencies */
  transitiveDependencies: z.array(transitiveDependencySchema).optional(),
  /** External package dependencies */
  packages: z.array(packageDependencySchema).optional()
});
var getDependentsParamsSchema = z.object({
  /** File path to analyze */
  filePath: z.string().min(1),
  /** Dependency depth for transitive dependents (max: 10) */
  depth: z.number().int().nonnegative().max(10).optional(),
  /** Show which symbols are used by each dependent */
  includeSymbols: z.boolean().optional(),
  /** Include impact metrics and risk assessment */
  includeImpactMetrics: z.boolean().optional(),
  /** Maximum number of dependents to return per page (default: 20, max: 100) */
  limit: z.number().int().positive().max(100).default(20),
  /** Offset for pagination (default: 0) */
  offset: z.number().int().nonnegative().default(0)
});
var directDependentSchema = z.object({
  /** Dependent file path */
  filePath: z.string(),
  /** Symbols used from the source file */
  usedSymbols: z.array(z.string()).optional()
});
var transitiveDependentSchema = z.object({
  /** File path */
  filePath: z.string(),
  /** Number of hops from source file */
  distance: z.number().int().positive(),
  /** Impact chain showing how it's reached */
  path: z.array(z.string())
});
var dependentMetricsSchema = z.object({
  /** Total number of dependent files */
  totalFiles: z.number().int().nonnegative(),
  /** Maximum dependent depth */
  maxDepth: z.number().int().nonnegative(),
  /** Risk level based on dependent count */
  riskLevel: riskLevelSchema
});
var getDependentsResultSchema = z.object({
  /** Source file being analyzed */
  file: z.string(),
  /** Direct (immediate) dependents */
  directDependents: z.array(directDependentSchema),
  /** Transitive (indirect) dependents */
  transitiveDependents: z.array(transitiveDependentSchema).optional(),
  /** Detailed metrics (if includeImpactMetrics=true) */
  detailedMetrics: z.object({
    byDepth: z.record(z.string(), z.number()),
    criticalPaths: z.array(z.array(z.string())),
    mostImpactedFiles: z.array(z.string())
  }).optional()
});
var findCircularDependenciesParamsSchema = z.object({
  /** Check if a specific file is involved in any cycles */
  filePath: z.string().min(1).optional(),
  /** Filter cycles by minimum length (min: 2, max: 10) */
  minCycleLength: z.number().int().min(2).max(10).optional(),
  /** Filter cycles by maximum length (min: 2, max: 10) */
  maxCycleLength: z.number().int().min(2).max(10).optional(),
  /** Maximum number of cycles to return */
  limit: z.number().int().positive().max(100).default(50),
  /** Pagination offset */
  offset: z.number().int().nonnegative().default(0),
  /** Include impact scoring for each cycle */
  includeImpactScore: z.boolean().optional(),
  /** Include confidence assessment */
  includeConfidence: z.boolean().optional()
});
var circularDependencyCycleSchema = z.object({
  /** Files involved in the cycle */
  files: z.array(z.string()),
  /** Number of files in the cycle */
  length: z.number().int().positive(),
  /** Impact score based on file importance (if includeImpactScore=true) */
  impactScore: z.number().min(0).max(100).optional(),
  /** Severity level */
  severity: riskLevelSchema
});
var findCircularDependenciesResultSchema = z.object({
  /** Detected circular dependency cycles */
  cycles: z.array(circularDependencyCycleSchema)
});
var traceSymbolUsageParamsSchema = z.object({
  /** Symbol ID if known */
  symbolId: z.string().optional(),
  /** Symbol name (requires filePath) */
  symbolName: z.string().optional(),
  /** File path where symbol is defined */
  filePath: z.string().optional(),
  /** Filter by specific usage types */
  filterByUsageType: z.array(z.string()).optional(),
  /** Filter by relationship type (CALLS, REFERENCES, IMPORTS, etc.) */
  filterByRelationshipType: z.array(z.string()).optional(),
  /** Include indirect (transitive) usage */
  includeTransitive: z.boolean().optional(),
  /** Include usage context (code snippets) */
  includeContext: z.boolean().optional(),
  /** Exclude test files from results */
  excludeTests: z.boolean().optional(),
  /** Exclude generated files from results */
  excludeGenerated: z.boolean().optional(),
  /** Include importance weighting in results */
  includeImportanceWeight: z.boolean().optional(),
  /** Maximum results to return */
  limit: z.number().int().positive().max(100).default(50),
  /** Pagination offset */
  offset: z.number().int().nonnegative().default(0)
});
var tracedSymbolSchema = z.object({
  /** Symbol being traced */
  name: z.string(),
  /** Symbol kind */
  kind: z.string(),
  /** Access modifier (public/private/protected) for class members. Omitted for module-level symbols and interface members. */
  visibility: z.string().optional(),
  /** File where symbol is defined */
  filePath: z.string(),
  /** Optional line range end. Persisted as `endLine` on Neo4j `:Symbol`. */
  lineEnd: z.number().int().positive().optional(),
  /** Cyclomatic complexity metrics (present on function/method symbols) */
  complexity: complexityMetricsSchema.optional(),
  /** Language-specific metadata (e.g., language identifier) */
  languageMetadata: languageMetadataSchema.optional()
});
var directUsageSchema = z.object({
  /** File path where symbol is used */
  filePath: z.string(),
  /** Type of usage */
  usageType: z.string(),
  // import, call, type, inherit, reference
  /** Relationship type (CALLS, REFERENCES, IMPORTS, etc.) */
  relationshipType: z.string(),
  /** Line number where usage occurs */
  line: z.number().int().positive().optional(),
  /** Column number where usage occurs */
  column: z.number().int().nonnegative().optional(),
  /** Enclosing symbol (function/class containing this usage) */
  enclosingSymbol: z.object({
    name: z.string(),
    kind: z.string()
  }).optional(),
  /** Surrounding code context (if includeContext=true) */
  context: z.string().optional(),
  /** Alias if symbol was renamed on import */
  aliasName: z.string().optional(),
  /** Whether this is a test file */
  isTest: z.boolean().optional(),
  /** Whether this is a generated file */
  isGenerated: z.boolean().optional(),
  /** Importance weight (0.0-1.0, if includeImportanceWeight=true) */
  importanceWeight: z.number().min(0).max(1).optional()
});
var transitiveUsageSchema = z.object({
  /** File path */
  filePath: z.string(),
  /** Number of hops from source symbol */
  distance: z.number().int().positive(),
  /** Chain showing how it's reached */
  chain: z.array(z.string())
});
var traceSymbolUsageResultSchema = z.object({
  /** Symbol being traced */
  symbol: tracedSymbolSchema,
  /** Direct usages of the symbol */
  directUsages: z.array(directUsageSchema),
  /** Transitive usages (if includeTransitive=true) */
  transitiveUsages: z.array(transitiveUsageSchema).optional()
});
var getCallGraphParamsSchema = z.object({
  /** Symbol ID to analyze (if known) */
  symbolId: z.string().optional(),
  /** Symbol name (requires filePath if symbolId not provided) */
  symbolName: z.string().optional(),
  /** File path where function is defined */
  filePath: z.string().optional(),
  /** Direction of call graph to retrieve (default: 'both') */
  direction: z.enum(["callers", "callees", "both"]).default("both"),
  /** Maximum depth to traverse */
  depth: z.number().int().positive().max(10).default(3),
  /** Exclude external/package calls */
  excludeExternal: z.boolean().optional(),
  /** Include graph representation */
  includeGraph: z.boolean().optional(),
  /** Maximum number of call relationships to return per page (default: 25, max: 100) */
  limit: z.number().int().positive().max(100).default(25),
  /** Offset for pagination (default: 0) */
  offset: z.number().int().nonnegative().default(0)
});
var callGraphRootSchema = z.object({
  /** Symbol ID */
  symbolId: z.string(),
  /** Symbol name */
  name: z.string(),
  /** Access modifier (public/private/protected) for class members. Omitted for module-level symbols and interface members. */
  visibility: z.string().optional(),
  /** File path */
  filePath: z.string(),
  /** Line number */
  line: z.number().int().positive(),
  /** Optional line range end. Persisted as `endLine` on Neo4j `:Symbol`. */
  lineEnd: z.number().int().positive().optional(),
  /** Column number */
  column: z.number().int().nonnegative(),
  /** Cyclomatic complexity metrics (present on function/method symbols) */
  complexity: complexityMetricsSchema.optional(),
  /** Language-specific metadata (e.g., language identifier) */
  languageMetadata: languageMetadataSchema.optional()
});
var callerNodeSchema = z.object({
  /** Symbol ID */
  symbolId: z.string(),
  /** Symbol name */
  name: z.string(),
  /** Access modifier (public/private/protected) for class members. Omitted for module-level symbols and interface members. */
  visibility: z.string().optional(),
  /** File path */
  filePath: z.string(),
  /** Line number */
  line: z.number().int().positive(),
  /** Optional line range end. Persisted as `endLine` on Neo4j `:Symbol`. */
  lineEnd: z.number().int().positive().optional(),
  /** Column number */
  column: z.number().int().nonnegative(),
  /** Depth from root */
  depth: z.number().int().nonnegative(),
  /** Cyclomatic complexity metrics (present on function/method symbols) */
  complexity: complexityMetricsSchema.optional(),
  /** Language-specific metadata (e.g., language identifier) */
  languageMetadata: languageMetadataSchema.optional()
});
var calleeNodeSchema = z.object({
  /** Symbol ID */
  symbolId: z.string(),
  /** Symbol name */
  name: z.string(),
  /** Access modifier (public/private/protected) for class members. Omitted for module-level symbols and interface members. */
  visibility: z.string().optional(),
  /** File path */
  filePath: z.string(),
  /** Line number */
  line: z.number().int().positive(),
  /** Optional line range end. Persisted as `endLine` on Neo4j `:Symbol`. */
  lineEnd: z.number().int().positive().optional(),
  /** Column number */
  column: z.number().int().nonnegative(),
  /** Whether call is async */
  isAsync: z.boolean(),
  /** Depth from root */
  depth: z.number().int().nonnegative(),
  /** Cyclomatic complexity metrics (present on function/method symbols) */
  complexity: complexityMetricsSchema.optional(),
  /** Language-specific metadata (e.g., language identifier) */
  languageMetadata: languageMetadataSchema.optional()
});
var getCallGraphResultSchema = z.object({
  /** Root symbol */
  root: callGraphRootSchema,
  /** Functions that call this symbol (if direction includes 'callers') */
  callers: z.array(callerNodeSchema).optional(),
  /** Functions this symbol calls (if direction includes 'callees') */
  callees: z.array(calleeNodeSchema).optional(),
  /** Graph representation (if includeGraph=true) */
  graph: graphRepresentationSchema.optional()
});
var impactAnalysisParamsSchema = z.object({
  /** Symbol ID to analyze impact for */
  symbolId: z.string().optional(),
  /** Qualified name to analyze impact for (alternative to symbolId) */
  qualifiedName: z.string().optional(),
  /** Symbol name (requires filePath if symbolId/qualifiedName not provided) */
  symbolName: z.string().optional(),
  /** File path where symbol is defined */
  filePath: z.string().optional(),
  /** Include direct dependents (symbols that directly use this symbol) @default true */
  includeDirectDependents: z.boolean().default(true),
  /** Include transitive dependents (symbols that transitively depend on this symbol) @default true */
  includeTransitiveDependents: z.boolean().default(true),
  /** Maximum depth for transitive analysis (1-5) @default 3 */
  depth: z.number().int().min(1).max(5).default(3),
  /** Exclude test files from impact analysis @default true */
  excludeTests: z.boolean().default(true),
  /** Exclude generated files from impact analysis @default true */
  excludeGenerated: z.boolean().default(true),
  /** Analyze breaking change potential @default true */
  analyzeBreakingChanges: z.boolean().default(true)
});
var impactedSymbolSchema = fileLocationSchema.extend({
  /** Symbol ID */
  id: z.string(),
  /** Symbol name */
  name: z.string(),
  /** Fully qualified name */
  qualifiedName: z.string(),
  /** Symbol kind (function, class, variable, etc.) */
  kind: z.string(),
  /** Access modifier (public/private/protected) for class members. Omitted for module-level symbols and interface members. */
  visibility: z.string().optional(),
  /** Type of relationship (CALLS, REFERENCES, DEPENDS_ON, etc.) */
  relationshipType: z.string(),
  /** Depth in the dependency chain (1 = direct, 2+ = transitive) */
  depth: z.number().int().positive(),
  /** Whether this symbol is exported (potential breaking change risk) */
  isExported: z.boolean().optional(),
  /** Number of symbols that depend on this impacted symbol */
  transitiveImpactCount: z.number().int().nonnegative().optional(),
  /** Language-specific metadata (e.g., language identifier) */
  languageMetadata: languageMetadataSchema.optional()
});
var impactedFileSchema = z.object({
  /** File path */
  filePath: z.string(),
  /** Number of symbols in this file that are impacted */
  symbolCount: z.number().int().positive(),
  /** Whether this is a test file */
  isTest: z.boolean().optional(),
  /** Whether this is a generated file */
  isGenerated: z.boolean().optional(),
  /** List of impacted symbols in this file */
  symbols: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      kind: z.string(),
      line: z.number().int().positive()
    })
  )
});
var breakingChangeRiskSchema = z.object({
  /** Overall risk level (low, medium, high, critical) */
  riskLevel: riskLevelSchema,
  /** Risk factors contributing to the assessment */
  factors: z.array(
    z.object({
      /** Factor name */
      factor: z.string(),
      /** Severity of this factor (low, medium, high) */
      severity: z.enum(["low", "medium", "high"]),
      /** Description of why this is a risk factor */
      description: z.string()
    })
  ),
  /** Recommendations for mitigating breaking changes */
  recommendations: z.array(z.string())
});
var impactAnalysisResultSchema = z.object({
  /** The symbol being analyzed */
  symbol: z.object({
    id: z.string(),
    name: z.string(),
    qualifiedName: z.string(),
    kind: z.string(),
    /** Access modifier (public/private/protected) for class members. Omitted for module-level symbols and interface members. */
    visibility: z.string().optional(),
    filePath: z.string(),
    line: z.number().int().positive(),
    /** Optional line range end. Persisted as `endLine` on Neo4j `:Symbol`. */
    lineEnd: z.number().int().positive().optional(),
    column: z.number().int().nonnegative(),
    isExported: z.boolean().optional(),
    /** Language-specific metadata (e.g., language identifier) */
    languageMetadata: languageMetadataSchema.optional()
  }),
  /** Direct dependents (depth 1) */
  directDependents: z.array(impactedSymbolSchema).optional(),
  /** Transitive dependents (depth 2+) */
  transitiveDependents: z.array(impactedSymbolSchema).optional(),
  /** Files impacted by changes to this symbol */
  impactedFiles: z.array(impactedFileSchema),
  /** Breaking change risk assessment */
  breakingChangeRisk: breakingChangeRiskSchema.optional(),
  /** Summary statistics */
  summary: z.object({
    /** Total number of directly dependent symbols */
    directDependentCount: z.number().int().nonnegative(),
    /** Total number of transitively dependent symbols */
    transitiveDependentCount: z.number().int().nonnegative(),
    /** Total number of impacted files */
    impactedFileCount: z.number().int().nonnegative(),
    /** Number of impacted test files */
    testFileCount: z.number().int().nonnegative(),
    /** Number of impacted production files (non-test, non-generated) */
    productionFileCount: z.number().int().nonnegative(),
    /** Maximum depth of dependency chain analyzed */
    maxDepth: z.number().int().nonnegative()
  })
});
var findOrphanedCodeParamsSchema = z.object({
  /** File pattern to search */
  filePattern: z.string().optional(),
  /** Filter by symbol kinds */
  filterByKind: z.array(z.string()).optional(),
  /** Only check exported symbols */
  exportedOnly: z.boolean().optional(),
  /** Exclude test files from orphan analysis @default true */
  excludeTests: z.boolean().default(true),
  /** Maximum results to return */
  limit: z.number().int().positive().max(100).default(50),
  /** Pagination offset */
  offset: z.number().int().nonnegative().default(0),
  /** Include confidence scoring */
  includeConfidence: z.boolean().optional()
});
var orphanedSymbolSchema = z.object({
  /** Symbol ID */
  symbolId: z.string(),
  /** Symbol name */
  name: z.string(),
  /** Symbol kind */
  kind: z.string(),
  /** Access modifier (public/private/protected) for class members. Omitted for module-level symbols and interface members. */
  visibility: z.string().optional(),
  /** File path */
  filePath: z.string(),
  /** Optional line range end. Persisted as `endLine` on Neo4j `:Symbol`. */
  lineEnd: z.number().int().positive().optional(),
  /** Whether symbol is exported */
  isExported: z.boolean(),
  /** Reason for being orphaned */
  reason: z.string(),
  /** Confidence (0-1) */
  confidence: z.number().min(0).max(1),
  /** Language-specific metadata (e.g., language identifier) */
  languageMetadata: languageMetadataSchema.optional()
});
var orphanedFileSchema = z.object({
  /** File path */
  filePath: z.string(),
  /** Reason for being orphaned */
  reason: z.string(),
  /** Last updated timestamp */
  lastUpdated: z.string(),
  /** Confidence (0-1) */
  confidence: z.number().min(0).max(1)
});
var findOrphanedCodeResultSchema = z.object({
  /** Orphaned symbols */
  orphanedSymbols: z.array(orphanedSymbolSchema),
  /** Orphaned files */
  orphanedFiles: z.array(orphanedFileSchema)
});
var getArchitectureOverviewParamsSchema = z.object({
  /** Include detailed metrics @default false */
  includeMetrics: z.boolean().default(false),
  /** Include module-level graph structure @default false */
  includeModuleGraph: z.boolean().default(false),
  /** Include external package dependency details (production/development classification) @default true */
  includePackages: z.boolean().default(true)
});
var languageInfoSchema = z.object({
  language: z.string(),
  fileCount: z.number().int().nonnegative(),
  percentage: z.number().min(0).max(100)
});
var frameworkInfoSchema = z.object({
  name: z.string(),
  version: z.string().optional(),
  confidence: z.enum(["high", "medium", "low"]),
  evidence: z.array(z.string())
});
var projectMetadataSchema = z.object({
  languages: z.array(languageInfoSchema),
  frameworks: z.array(frameworkInfoSchema),
  primaryLanguage: z.string(),
  totalFiles: z.number().int().nonnegative(),
  totalLines: z.number().int().nonnegative().optional()
});
var structureStatisticsSchema = z.object({
  files: z.object({
    total: z.number().int().nonnegative(),
    byType: z.record(z.string(), z.number()),
    byParadigm: z.record(z.string(), z.number())
  }),
  symbols: z.object({
    total: z.number().int().nonnegative(),
    byKind: z.record(z.string(), z.number()),
    exported: z.number().int().nonnegative(),
    public: z.number().int().nonnegative()
  }),
  modules: z.object({
    total: z.number().int().nonnegative(),
    averageSize: z.number().nonnegative(),
    largest: z.string()
  })
});
var dependencyOverviewSchema = z.object({
  internal: z.object({
    totalConnections: z.number().int().nonnegative(),
    averagePerFile: z.number().nonnegative(),
    mostConnectedFiles: z.array(
      z.object({
        path: z.string(),
        incomingCount: z.number().int().nonnegative(),
        outgoingCount: z.number().int().nonnegative()
      })
    )
  }),
  external: z.object({
    totalPackages: z.number().int().nonnegative(),
    directDependencies: z.number().int().nonnegative(),
    topPackages: z.array(
      z.object({
        name: z.string(),
        usageCount: z.number().int().nonnegative()
      })
    )
  })
});
var qualityMetricsSchema = z.object({
  complexity: z.object({
    average: z.number().nonnegative(),
    high: z.number().int().nonnegative()
    // count of high complexity items
  }),
  maintainability: z.object({
    score: z.number().min(0).max(100),
    // 0-100
    issues: z.array(z.string())
  }),
  testCoverage: z.object({
    percentage: z.number().min(0).max(100),
    testedFiles: z.number().int().nonnegative(),
    totalFiles: z.number().int().nonnegative()
  }).optional()
});
var moduleGraphNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  fileCount: z.number().int().nonnegative(),
  type: z.string()
});
var moduleGraphEdgeSchema = z.object({
  from: z.string(),
  to: z.string(),
  weight: z.number().int().nonnegative()
  // dependency count
});
var moduleGraphSchema = z.object({
  nodes: z.array(moduleGraphNodeSchema),
  edges: z.array(moduleGraphEdgeSchema)
});
var getArchitectureOverviewResultSchema = z.object({
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
var pingParamsSchema = z.object({}).strict();
var pingResultSchema = z.object({
  /** Always true on success - indicates connectivity verified */
  pong: z.literal(true)
});
var importTypeSchema = z.enum([
  "relative",
  "workspace",
  "alias",
  "external",
  "builtin"
]);
var importResolutionSchema = z.object({
  /** Original import specifier from source code */
  source: z.string(),
  /** Resolved project-relative path (e.g., './libs/database/src/index.ts') */
  /** Only present for internal project files */
  resolvedPath: z.string().optional(),
  /** Whether this is an external package (npm, etc.) */
  isExternal: z.boolean(),
  /** Type of import for debugging/analytics */
  importType: importTypeSchema
});
var importResolutionMetadataSchema = z.record(
  z.string(),
  importResolutionSchema
);
var referenceTypeSchema = z.enum([
  "call",
  // function call: f() or obj.f()
  "read",
  // identifier read in expression
  "write",
  // assignment target
  "type",
  // used in type position
  "instantiate",
  // new Foo()
  "import-use"
  // reference resolved through an import; set by resolver, not extractor
]);
var extractorReferenceTypeSchema = referenceTypeSchema.exclude([
  "import-use"
]);

// src/indexing/classification-map.schema.ts
var classificationMapEntrySchema = z.object({
  line: z.number().int().nonnegative(),
  column: z.number().int().nonnegative(),
  referenceType: referenceTypeSchema
}).strict();
var classificationMapSchema = z.object({
  filePath: z.string().min(1),
  entries: z.array(classificationMapEntrySchema)
}).strict();

// src/indexing/serialized-ast.schema.ts
var serializedAstSchema = z.object({
  /** Relative path to the source file from project root */
  file: z.string().min(1),
  /** Programming language identifier (e.g., 'typescript', 'javascript') */
  language: z.string().min(1),
  /** Git commit hash when this AST was generated */
  commit: z.string().min(1),
  /** ISO timestamp when the AST was created */
  timestamp: z.string().datetime(),
  /** Base64-encoded, gzip-compressed AST structure (no source code) */
  ast: z.string().min(1),
  /** CLI-resolved import paths (only CLI has tsconfig/jsconfig access) */
  importResolutions: importResolutionMetadataSchema.optional(),
  /** Per-position reference classifications computed by CLI during parse */
  classificationMap: classificationMapSchema.optional()
}).strict();
var fileFailureSchema = z.object({
  /** Relative file path */
  file: z.string(),
  /** Error message describing the failure */
  error: z.string()
});
var relationshipFailureSchema = z.object({
  /** Relative file path */
  file: z.string(),
  /** Number of relationships that failed to create */
  failedCount: z.number().int().nonnegative(),
  /** Number of relationships that were successfully created */
  createdCount: z.number().int().nonnegative(),
  /** Whether failures were due to transient errors (retryable) */
  isTransient: z.boolean()
});
var relationshipSummarySchema = z.object({
  /** Total number of relationships created across all files */
  totalCreated: z.number().int().nonnegative(),
  /** Total number of relationships that failed to create */
  totalFailed: z.number().int().nonnegative(),
  /** Files that had at least one relationship failure */
  filesWithFailures: z.array(relationshipFailureSchema)
});
var indexingResponseSchema = z.object({
  /** Number of files successfully processed in Pass 1 */
  processed: z.number().int().nonnegative(),
  /** Number of files that failed in Pass 1 */
  failed: z.number().int().nonnegative(),
  /** Project identifier */
  projectId: z.string(),
  /** Git branch name */
  branchName: z.string(),
  /** Details of files that failed during Pass 1 (node creation) */
  failedFiles: z.array(fileFailureSchema).optional(),
  /** Summary of relationship creation results from Pass 2 (always present) */
  relationships: relationshipSummarySchema
});
var projectStateSchema = z.object({
  /** Unique project identifier (normalized git remote URL) */
  projectId: z.string(),
  /** Derived project name from the git repository */
  projectName: z.string(),
  /** Current branch being queried */
  branch: z.string(),
  /** Latest git commit hash that was indexed (null if never indexed) */
  latestCommit: z.string().nullable(),
  /** Total number of files indexed in the project */
  fileCount: z.number().int().nonnegative(),
  /** Timestamp of the most recently indexed file (null if never indexed) */
  lastIndexedAt: z.string().nullable(),
  /** List of programming languages detected in the project */
  languages: z.array(z.string())
});
var importSpecifierSchema = z.object({
  local: z.string(),
  original: z.string().optional(),
  isDefault: z.boolean(),
  isNamespace: z.boolean()
});
var importSchema = z.object({
  source: z.string(),
  specifiers: z.array(importSpecifierSchema),
  isType: z.boolean(),
  isDynamic: z.boolean(),
  isConditional: z.boolean().optional(),
  isLazy: z.boolean().optional(),
  isWildcard: z.boolean().optional(),
  line: z.number(),
  column: z.number()
});
var extractorReferenceSchema = z.object({
  referencerId: z.string(),
  referencedName: z.string(),
  referenceType: extractorReferenceTypeSchema,
  line: z.number(),
  column: z.number(),
  /** Parent symbolId hash */
  scope: z.string().optional(),
  /** For `a.b.c`, holds 'a.b' */
  objectContext: z.string().optional(),
  language: z.string().optional()
});
var referenceLocationSchema = z.object({
  /** POSIX relative path to the file containing the reference */
  filePath: z.string().min(1),
  /** 1-based line number of the reference */
  line: z.number().int().positive(),
  /** 0-based column offset of the reference */
  column: z.number().int().nonnegative()
}).strict();
var callReferenceSchema = referenceLocationSchema.extend({
  /** Name of the calling/called symbol */
  name: z.string().min(1)
});
var typeInfoSchema = z.object({
  /** The fully resolved type string from LSP */
  resolvedType: z.string().min(1),
  /** Return type for function/method symbols */
  returnType: z.string().optional(),
  /** Extracted documentation comment */
  documentation: z.string().optional()
}).strict();
var definitionLocationSchema = z.object({
  /** POSIX relative path to the definition file */
  filePath: z.string().min(1),
  /** 1-based line number of the definition */
  line: z.number().int().positive(),
  /** 0-based column offset of the definition */
  column: z.number().int().nonnegative(),
  /** True if the definition is outside the project root (e.g., node_modules) */
  isExternal: z.boolean()
}).strict();
var symbolEnrichmentSchema = z.object({
  /** Symbol name (must match the corresponding graph node) */
  name: z.string().min(1),
  /** 1-based line number (must match the corresponding graph node) */
  line: z.number().int().positive(),
  /** 0-based column offset */
  column: z.number().int().nonnegative(),
  /** Symbol kind (e.g., function, class, variable, interface) */
  kind: z.string().min(1),
  /** Resolved type information from LSP hover */
  typeInfo: typeInfoSchema.optional(),
  /** Go-to-definition result */
  definition: definitionLocationSchema.optional(),
  /** Reference locations where this symbol is used */
  references: z.object({
    /** Total number of references found */
    count: z.number().int().nonnegative(),
    /** Reference locations (capped at 100) */
    locations: z.array(referenceLocationSchema).max(100)
  }).optional(),
  /** Incoming and outgoing call hierarchy */
  callHierarchy: z.object({
    /** Functions/methods that call this symbol (capped at 200) */
    incomingCalls: z.array(callReferenceSchema).max(200),
    /** Functions/methods called by this symbol (capped at 200) */
    outgoingCalls: z.array(callReferenceSchema).max(200)
  }).optional()
}).strict();
var fileEnrichmentSchema = z.object({
  /** POSIX relative path to the source file */
  filePath: z.string().min(1),
  /** Programming language identifier (e.g., 'typescript', 'python') */
  language: z.string().min(1),
  /** Enriched symbols found in this file */
  symbols: z.array(symbolEnrichmentSchema)
}).strict();
var enrichmentMetadataSchema = z.object({
  /** Project identifier */
  projectId: z.string().min(1),
  /** Git branch name */
  branch: z.string().min(1),
  /** Full 40-character SHA-1 commit hash */
  commit: z.string().regex(/^[0-9a-f]{40}$/),
  /** ISO 8601 timestamp of the enrichment run */
  timestamp: z.string().datetime()
}).strict();
var enrichmentStatusSchema = z.enum([
  "pending",
  "processing",
  "completed",
  "failed",
  "skipped"
]);
var graphNodeTypeSchema = z.enum([
  "function",
  "class",
  "variable",
  "import",
  "module",
  "interface",
  "type",
  "constant",
  "export"
]);
var graphEdgeTypeSchema = z.enum([
  "calls",
  "imports",
  "extends",
  "inherits",
  "implements",
  "uses",
  "references",
  "exports",
  "contains"
]);
var graphNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: graphNodeTypeSchema,
  data: z.object({
    filePath: z.string(),
    lineNumber: z.number().int().nonnegative(),
    module: z.string(),
    visibility: z.string(),
    isExported: z.boolean()
  })
});
var graphEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: graphEdgeTypeSchema,
  label: z.string().optional()
});
var graphSummarySchema = z.object({
  totalNodes: z.number().int().nonnegative(),
  totalEdges: z.number().int().nonnegative(),
  toolName: z.string(),
  query: z.string(),
  riskLevel: riskLevelSchema.optional()
});
var graphMetadataSchema = z.object({
  projectName: z.string(),
  branch: z.string(),
  asOfCommit: z.string(),
  lastIndexedAt: z.string().datetime()
});
var graphToolResultSchema = z.object({
  nodes: z.array(graphNodeSchema),
  edges: z.array(graphEdgeSchema),
  summary: graphSummarySchema,
  metadata: graphMetadataSchema,
  features: z.record(z.string(), z.boolean()).optional()
});
var projectInfoSchema = z.object({
  projectId: z.string(),
  projectName: z.string(),
  defaultBranch: z.string(),
  lastIndexedAt: z.string().datetime().optional(),
  fileCount: z.number().int().nonnegative().optional(),
  languages: z.array(z.string()).optional()
});
var projectListResponseSchema = z.object({
  projects: z.array(projectInfoSchema)
});
var projectResolveResponseSchema = projectInfoSchema.pick({
  projectId: true,
  projectName: true,
  defaultBranch: true
});
var indexErrorReportStatusSchema = z.enum([
  "unresolved",
  "resolved",
  "archived"
]);
var indexOutcomeSchema = z.enum(["succeeded", "failed"]);
var indexTypeSchema = z.enum(["full", "incremental"]);
var logLevelSchema = z.enum(["info", "warn", "error"]);
var errorEntrySchema = z.object({
  type: z.string(),
  message: z.string(),
  phase: z.string(),
  filePath: z.string().optional(),
  stack: z.string().optional()
});
var warningEntrySchema = z.object({
  type: z.string(),
  message: z.string(),
  phase: z.string(),
  filePath: z.string().optional()
});
var errorDataSchema = z.object({
  errors: z.array(errorEntrySchema),
  warnings: z.array(warningEntrySchema)
});
var logEntrySchema = z.object({
  level: logLevelSchema,
  message: z.string(),
  timestamp: z.string().datetime()
});
var createErrorReportSchema = z.object({
  errorSummary: z.string().max(500),
  errorData: errorDataSchema,
  logEntries: z.array(logEntrySchema),
  cliVersion: z.string(),
  outcome: indexOutcomeSchema,
  indexType: indexTypeSchema
});
var updateErrorReportSchema = z.object({
  status: indexErrorReportStatusSchema.exclude(["archived"])
});
var errorReportResponseSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  userId: z.string(),
  projectId: z.string(),
  branchName: z.string(),
  commitHash: z.string().nullable(),
  indexType: indexTypeSchema,
  status: indexErrorReportStatusSchema,
  outcome: indexOutcomeSchema,
  errorSummary: z.string(),
  errorData: errorDataSchema,
  logEntries: z.array(logEntrySchema),
  cliVersion: z.string(),
  resolvedAt: z.string().nullable(),
  resolvedBy: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  // Joined fields (from list endpoint)
  organizationName: z.string().optional(),
  projectName: z.string().optional(),
  userEmail: z.string().optional(),
  resolvedByEmail: z.string().optional()
});
var errorReportMetricsSchema = z.object({
  unresolvedCount: z.number(),
  failedRunCount: z.number(),
  resolvedLast30d: z.number(),
  avgResolutionDays: z.number().nullable(),
  affectedOrgCount: z.number()
});

export { ENTRY_POINT_PATTERNS, PYTHON_STDLIB_MODULES, TEST_PATTERNS, apiErrorResponseSchema, apiResponseSchema, breakingChangeRiskSchema, callGraphRootSchema, callReferenceSchema, calleeNodeSchema, callerNodeSchema, circularDependencyCycleSchema, classificationMapEntrySchema, classificationMapSchema, complexityMetricsSchema, complexityRiskSchema, confidenceScoreSchema, createErrorReportSchema, dataQualityMetadataSchema, definitionLocationSchema, dependencyMetricsSchema, dependencyOverviewSchema, dependentMetricsSchema, directDependencySchema, directDependentSchema, directUsageSchema, enrichmentMetadataSchema, enrichmentStatusSchema, errorDataSchema, errorEntrySchema, errorReportMetricsSchema, errorReportResponseSchema, extractorReferenceSchema, extractorReferenceTypeSchema, fileEnrichmentSchema, fileFailureSchema, fileLocationSchema, findCircularDependenciesParamsSchema, findCircularDependenciesResultSchema, findOrphanedCodeParamsSchema, findOrphanedCodeResultSchema, frameworkInfoSchema, getArchitectureOverviewParamsSchema, getArchitectureOverviewResultSchema, getCallGraphParamsSchema, getCallGraphResultSchema, getDependenciesParamsSchema, getDependenciesResultSchema, getDependentsParamsSchema, getDependentsResultSchema, getSymbolDetailsParamsSchema, graphEdgeSchema, graphEdgeTypeSchema, graphMetadataSchema, graphNodeSchema, graphNodeTypeSchema, graphRepresentationSchema, graphSummarySchema, graphToolResultSchema, impactAnalysisParamsSchema, impactAnalysisResultSchema, impactScoreSchema, impactedFileSchema, impactedSymbolSchema, importResolutionMetadataSchema, importResolutionSchema, importSchema, importSpecifierSchema, importTypeSchema, indexErrorReportStatusSchema, indexOutcomeSchema, indexTypeSchema, indexingResponseSchema, isErrorResponse, isSuccessResponse, languageInfoSchema, languageMetadataSchema, logEntrySchema, logLevelSchema, moduleGraphEdgeSchema, moduleGraphNodeSchema, moduleGraphSchema, orphanedFileSchema, orphanedSymbolSchema, packageDependencySchema, paginationMetadataSchema, pingParamsSchema, pingResultSchema, projectInfoSchema, projectListResponseSchema, projectMetadataSchema, projectResolveResponseSchema, projectStateSchema, qualityMetricsSchema, referenceLocationSchema, referenceTypeSchema, relationshipDirectionsSchema, relationshipFailureSchema, relationshipSummarySchema, riskLevelSchema, searchSymbolsParamsSchema, searchSymbolsResultSchema, serializedAstSchema, standardGraphEdgeSchema, standardGraphNodeSchema, stringRelationshipDirectionsSchema, structureStatisticsSchema, symbolDetailsResultSchema, symbolDetailsSchema, symbolEnrichmentSchema, symbolInfoSchema, symbolKindCategorySchema, symbolReferenceSchema, symbolRelationshipsSchema, symbolUsageReferenceSchema, traceSymbolUsageParamsSchema, traceSymbolUsageResultSchema, tracedSymbolSchema, transitiveDependencySchema, transitiveDependentSchema, transitiveUsageSchema, typeInfoSchema, updateErrorReportSchema, warningEntrySchema };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map