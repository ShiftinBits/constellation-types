/**
 * Enrichment Schemas
 *
 * Zod schemas for LSP enrichment data sent from CLI to Core.
 * Defines the contract for type info, references, and call hierarchy
 * gathered via LSP during indexing.
 *
 * COORDINATE CONVENTIONS
 * ----------------------
 * LSP native format is used on the wire: `line` is 1-based, `column` is
 * 0-based. The Core enrichment processor normalizes `line` to 0-based at
 * ingress so that every internal consumer (classificationMap lookup keys,
 * Symbol node `line` storage, extractor-written :REFERENCES edge `line`)
 * speaks tree-sitter's 0-based row convention. Producers MUST send values
 * in LSP's convention; consumers reading graph properties downstream MUST
 * expect 0-based rows.
 */

import { z } from 'zod';

/**
 * A reference location pointing to where a symbol is used.
 *
 * Wire format is LSP-native: 1-based line, 0-based column. Core normalizes
 * `line` to 0-based before classificationMap lookup and MERGE, so the
 * edge stored on the graph carries a 0-based row.
 */
export const referenceLocationSchema = z
	.object({
		/** POSIX relative path to the file containing the reference */
		filePath: z.string().min(1),

		/** 1-based line number of the reference (LSP convention) */
		line: z.number().int().positive(),

		/** 0-based column offset of the reference */
		column: z.number().int().nonnegative(),
	})
	.strict();

export type ReferenceLocation = z.infer<typeof referenceLocationSchema>;

/**
 * A call hierarchy entry representing an incoming or outgoing call.
 * Extends referenceLocationSchema with a symbol name.
 */
export const callReferenceSchema = referenceLocationSchema
	.extend({
		/** Name of the calling/called symbol */
		name: z.string().min(1),
	})
	.strict();

export type CallReference = z.infer<typeof callReferenceSchema>;

/**
 * Type information resolved from LSP hover results.
 */
export const typeInfoSchema = z
	.object({
		/** The fully resolved type string from LSP */
		resolvedType: z.string().min(1),

		/** Return type for function/method symbols */
		returnType: z.string().optional(),

		/**
		 * Extracted documentation comment. Capped at 16 KiB — Hover text is
		 * rarely useful beyond this and unbounded values stall the request
		 * thread on synchronous Zod validation.
		 */
		documentation: z.string().max(16_384).optional(),
	})
	.strict();

export type TypeInfo = z.infer<typeof typeInfoSchema>;

/**
 * Per-symbol LSP enrichment data aggregating type info, references,
 * and call hierarchy for a single symbol.
 */
export const symbolEnrichmentSchema = z
	.object({
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

		/**
		 * Locations of types/methods that implement (or are implemented by)
		 * this symbol, sourced from `textDocument/implementation`.
		 *
		 * Direction is symmetric and language-server-defined: when fired
		 * on a concrete method, gopls returns the interface methods it
		 * satisfies; when fired on an interface method, it returns the
		 * concrete implementations. The same applies to TypeScript
		 * interfaces / classes via tsserver. Core resolves the target
		 * symbol at each location and emits an `IMPLEMENTS` edge.
		 *
		 * Capped at 200 — interface implementers can run into the
		 * hundreds in large polyglot codebases, but the per-symbol
		 * pathological case (e.g. Go's `error` interface) is bounded
		 * by what the LSP server itself returns. Wire format follows
		 * the file-level COORDINATE CONVENTIONS above: 1-based line,
		 * 0-based column. Core normalizes `line` to 0-based at
		 * ingress, mirroring the `references` path.
		 *
		 * Three-state contract:
		 *  - `undefined` — LSP request not fired (kind not in the
		 *    matrix) or fulfilled with implementors but the array was
		 *    suppressed because the symbol carried no other data
		 *    (avoids emitting a hollow record purely to run a no-op
		 *    delete). Core skips the symbol entirely.
		 *  - `[]` — fired and returned no implementors, paired with
		 *    other LSP data so the symbol is being emitted anyway.
		 *    Core scoped-deletes any stale LSP-sourced `IMPLEMENTS`
		 *    edges (interface lost its last implementor).
		 *  - non-empty — implementor locations, written as
		 *    `IMPLEMENTS` edges by Core.
		 */
		implementations: z.array(referenceLocationSchema).max(200).optional(),
	})
	.strict();

export type SymbolEnrichment = z.infer<typeof symbolEnrichmentSchema>;

/**
 * File-level enrichment data containing all enriched symbols for a single file.
 * Each instance represents one NDJSON line in the enrichment payload.
 */
export const fileEnrichmentSchema = z
	.object({
		/** POSIX relative path to the source file */
		filePath: z.string().min(1),

		/** Programming language identifier (e.g., 'typescript', 'python') */
		language: z.string().min(1),

		/**
		 * Enriched symbols found in this file. Capped at 10,000 — defends
		 * the request thread against pathological/malicious payloads that
		 * would otherwise trigger millions of nested Zod validations before
		 * the 202 response.
		 *
		 * 10,000 is sized to NOT reject real generated code. Reference
		 * points: TypeScript's own `lib.dom.d.ts` has ~5,000+ symbols; a
		 * Prisma client, OpenAPI codegen output, large gRPC stubs, or
		 * dense `.d.ts` files for libraries like Three.js / Material UI /
		 * the AWS SDK regularly produce 2,000–10,000 symbols per file.
		 * Per-symbol cost is itself bounded by inner caps (refs ≤ 100,
		 * calls ≤ 200×2, documentation ≤ 16 KiB), so per-line worst-case
		 * validation work stays bounded.
		 */
		symbols: z.array(symbolEnrichmentSchema).max(10_000),
	})
	.strict();

export type FileEnrichment = z.infer<typeof fileEnrichmentSchema>;

/**
 * Metadata describing the context of an enrichment run.
 */
export const enrichmentMetadataSchema = z
	.object({
		/** Project identifier */
		projectId: z.string().min(1),

		/** Git branch name */
		branch: z.string().min(1),

		/** Full 40-character SHA-1 commit hash */
		commit: z.string().regex(/^[0-9a-f]{40}$/),

		/** ISO 8601 timestamp of the enrichment run */
		timestamp: z.string().datetime(),
	})
	.strict();

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
