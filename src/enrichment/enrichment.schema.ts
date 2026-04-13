/**
 * Enrichment Schemas
 *
 * Zod schemas for LSP enrichment data sent from CLI to Core.
 * Defines the contract for type info, references, call hierarchy,
 * and definition locations gathered via LSP during indexing.
 */

import { z } from 'zod';

/**
 * A reference location pointing to where a symbol is used.
 */
export const referenceLocationSchema = z.object({
	/** POSIX relative path to the file containing the reference */
	filePath: z.string().min(1),

	/** 1-based line number of the reference */
	line: z.number().int().positive(),

	/** 0-based column offset of the reference */
	column: z.number().int().nonnegative(),
});

export type ReferenceLocation = z.infer<typeof referenceLocationSchema>;

/**
 * A call hierarchy entry representing an incoming or outgoing call.
 * Extends referenceLocationSchema with a symbol name.
 */
export const callReferenceSchema = referenceLocationSchema.extend({
	/** Name of the calling/called symbol */
	name: z.string().min(1),
});

export type CallReference = z.infer<typeof callReferenceSchema>;

/**
 * Type information resolved from LSP hover results.
 */
export const typeInfoSchema = z.object({
	/** The fully resolved type string from LSP */
	resolvedType: z.string().min(1),

	/** Return type for function/method symbols */
	returnType: z.string().optional(),

	/** Extracted documentation comment */
	documentation: z.string().optional(),
});

export type TypeInfo = z.infer<typeof typeInfoSchema>;

/**
 * Go-to-definition result pointing to a symbol's declaration.
 */
export const definitionLocationSchema = z.object({
	/** POSIX relative path to the definition file */
	filePath: z.string().min(1),

	/** 1-based line number of the definition */
	line: z.number().int().positive(),

	/** 0-based column offset of the definition */
	column: z.number().int().nonnegative(),

	/** True if the definition is outside the project root (e.g., node_modules) */
	isExternal: z.boolean(),
});

export type DefinitionLocation = z.infer<typeof definitionLocationSchema>;

/**
 * Per-symbol LSP enrichment data aggregating type info, definition,
 * references, and call hierarchy for a single symbol.
 */
export const symbolEnrichmentSchema = z.object({
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
	references: z
		.object({
			/** Total number of references found */
			count: z.number().int().nonnegative(),

			/** Reference locations (capped at 100) */
			locations: z.array(referenceLocationSchema).max(100),
		})
		.optional(),

	/** Incoming and outgoing call hierarchy */
	callHierarchy: z
		.object({
			/** Functions/methods that call this symbol (capped at 200) */
			incomingCalls: z.array(callReferenceSchema).max(200),

			/** Functions/methods called by this symbol (capped at 200) */
			outgoingCalls: z.array(callReferenceSchema).max(200),
		})
		.optional(),
});

export type SymbolEnrichment = z.infer<typeof symbolEnrichmentSchema>;

/**
 * File-level enrichment data containing all enriched symbols for a single file.
 * Each instance represents one NDJSON line in the enrichment payload.
 */
export const fileEnrichmentSchema = z.object({
	/** POSIX relative path to the source file */
	filePath: z.string().min(1),

	/** Programming language identifier (e.g., 'typescript', 'python') */
	language: z.string().min(1),

	/** Enriched symbols found in this file */
	symbols: z.array(symbolEnrichmentSchema),
});

export type FileEnrichment = z.infer<typeof fileEnrichmentSchema>;

/**
 * Metadata describing the context of an enrichment run.
 */
export const enrichmentMetadataSchema = z.object({
	/** Project identifier */
	projectId: z.string().min(1),

	/** Git branch name */
	branch: z.string().min(1),

	/** Full 40-character SHA-1 commit hash */
	commit: z.string().regex(/^[0-9a-f]{40}$/),

	/** ISO 8601 timestamp of the enrichment run */
	timestamp: z.string().datetime(),
});

export type EnrichmentMetadata = z.infer<typeof enrichmentMetadataSchema>;

/**
 * Status of an enrichment operation.
 */
export const enrichmentStatusSchema = z.enum([
	'pending',
	'processing',
	'completed',
	'failed',
	'skipped',
]);

export type EnrichmentStatus = z.infer<typeof enrichmentStatusSchema>;
