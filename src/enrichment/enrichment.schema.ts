/**
 * Enrichment Schemas
 *
 * Zod schemas for LSP enrichment data sent from CLI to Core.
 * Defines the contract for the two facts Core consumes from LSP during
 * indexing: call-site definitions (`textDocument/definition` fired at
 * targeted call sites, carried per file in `callSites`) and Go struct
 * implementations (`textDocument/implementation` fired on concrete Go
 * structs, carried per symbol in `implementations`).
 *
 * COORDINATE CONVENTIONS
 * ----------------------
 * LSP native format is used on the wire: `line` is 1-based, `column` is
 * 0-based. This applies to every location on the wire, including both the
 * call-site position and the definition target of a call-site record (site
 * `line` and `target.line` are both 1-based). Core keeps these values
 * as-is: graph `line` properties (Symbol nodes and CALLS, REFERENCES and
 * IMPLEMENTS edges) are 1-based too, so wire lines compare to graph lines
 * directly. Producers MUST send values in LSP's convention.
 */

import { z } from 'zod';

/**
 * A reference location pointing to where a symbol is used.
 *
 * Wire format is LSP-native: 1-based line, 0-based column, the same
 * bases the graph stores.
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
 * Per-symbol LSP enrichment data for a single symbol. The field Core
 * consumes is `implementations`; `typeInfo`, `references`, and
 * `callHierarchy` are deprecated and kept optional only so payloads from
 * older CLIs still validate.
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

		/**
		 * Resolved type information from LSP hover.
		 *
		 * @deprecated Core ignores this field. It stays optional so payloads
		 * from older CLIs still validate.
		 */
		typeInfo: typeInfoSchema.optional(),

		/**
		 * Reference locations where this symbol is used.
		 *
		 * @deprecated Core ignores this field. It stays optional so payloads
		 * from older CLIs still validate.
		 */
		references: z
			.object({
				/** Total number of references found */
				count: z.number().int().nonnegative(),

				/** Reference locations (capped at 100) */
				locations: z.array(referenceLocationSchema).max(100),
			})
			.optional(),

		/**
		 * Incoming and outgoing call hierarchy.
		 *
		 * @deprecated Core ignores this field; call edges come from the
		 * file-level `callSites` records instead. It stays optional so
		 * payloads from older CLIs still validate.
		 */
		callHierarchy: z
			.object({
				/** Functions/methods that call this symbol (capped at 200) */
				incomingCalls: z.array(callReferenceSchema).max(200),

				/** Functions/methods called by this symbol (capped at 200) */
				outgoingCalls: z.array(callReferenceSchema).max(200),
			})
			.optional(),

		/**
		 * Locations of the interfaces this symbol satisfies, sourced from
		 * `textDocument/implementation`.
		 *
		 * The CLI fires the request only on concrete Go structs, so every
		 * location is an interface the struct implements. For each location
		 * Core resolves the target as the interface-kind symbol containing
		 * that position and writes `symbol IMPLEMENTS interface`.
		 *
		 * Capped at 200: the per-symbol pathological case (a struct
		 * satisfying many interfaces in a large codebase) is bounded by
		 * what the language server itself returns. Wire format follows the
		 * file-level COORDINATE CONVENTIONS above: 1-based line, 0-based
		 * column.
		 *
		 * Core consumes `implementations` only on concrete Go struct
		 * symbols and ignores the field for any other symbol kind. Older
		 * CLIs sent it for interfaces, methods, and classes in other
		 * languages with symmetric direction; Core discards those.
		 *
		 * Three-state contract:
		 *  - `undefined`: LSP request not fired (symbol is not a concrete
		 *    Go struct) or did not complete. Core leaves existing
		 *    `IMPLEMENTS` edges as they are.
		 *  - `[]`: the request fired on a concrete Go struct and returned
		 *    no interfaces. The CLI MUST send `[]` in this case, even if
		 *    the symbol carries no other data, so Core scoped-deletes any
		 *    stale LSP-sourced `IMPLEMENTS` edges (the struct no longer
		 *    satisfies any interface).
		 *  - non-empty: interface locations, written as `IMPLEMENTS` edges
		 *    by Core.
		 */
		implementations: z.array(referenceLocationSchema).max(200).optional(),
	})
	.strict();

export type SymbolEnrichment = z.infer<typeof symbolEnrichmentSchema>;

/**
 * One record per targeted call site whose callee the language server
 * resolved, via `textDocument/definition`, to a definition inside the
 * project. Core replaces the structural `CALLS_UNRESOLVED` or name-guessed
 * `CALLS` edge at that site with a `CALLS` edge to the resolved target.
 *
 * SITE ANCHOR
 * -----------
 * The site position is the start of the callee's anchor identifier: the
 * last identifier of the callee expression, which is the token the
 * definition request is fired on.
 *  - Bare call `foo()`: `foo`.
 *  - Member, qualified, or selector call (`obj.svc.method()`, Go
 *    `pkg.Func()`, Python `mod.fn()`): the final member name (`method`,
 *    `Func`, `fn`), never the receiver or qualifier.
 *  - Chained call `a.b().c()`: one record per call, each anchored on its
 *    own final member name (`b`, then `c`).
 *
 * `name` is the exact source text of that anchor identifier, which is the
 * same text the structural call record carries as its callee name. In a
 * call expression that spans lines, the anchor `line` is the line of the
 * anchor identifier, which can differ from the line the call expression
 * starts on.
 *
 * Both the site `line` and `target.line` are 1-based on the wire (see the
 * file-level COORDINATE CONVENTIONS); columns are 0-based.
 */
export const callSiteDefinitionSchema = z
	.object({
		/** 1-based line of the anchor identifier at the call site (LSP convention) */
		line: z.number().int().positive(),

		/** 0-based column of the first character of the anchor identifier */
		column: z.number().int().nonnegative(),

		/** Exact source text of the anchor identifier (e.g. `method` in `obj.svc.method()`) */
		name: z.string().min(1),

		/**
		 * Definition location returned by `textDocument/definition`: POSIX
		 * relative path of the target file, 1-based line and 0-based column
		 * of the target's name.
		 */
		target: referenceLocationSchema,
	})
	.strict();

export type CallSiteDefinition = z.infer<typeof callSiteDefinitionSchema>;

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
		 * Per-symbol cost is itself bounded by inner caps (implementations
		 * ≤ 200, and for older payloads still carrying the deprecated
		 * fields: refs ≤ 100, calls ≤ 200×2, documentation ≤ 16 KiB), so
		 * per-line worst-case validation work stays bounded.
		 */
		symbols: z.array(symbolEnrichmentSchema).max(10_000),

		/**
		 * Resolved call-site definitions in this file. Capped at 10,000 for
		 * the same reason as `symbols`: it bounds synchronous Zod validation
		 * work on the request thread against pathological payloads while
		 * staying above the call-site count of real generated code. Record
		 * size is not bounded by this cap: `name` and `target.filePath` are
		 * unbounded strings.
		 *
		 * The CLI MUST omit `callSites` (the `undefined` state) for a file
		 * with more than 10,000 resolved sites rather than send an
		 * over-cap array. An over-cap array fails validation and Core
		 * rejects the entire request, not just that file.
		 *
		 * Rollout: this schema is `.strict()`, so Core must accept this
		 * field before any CLI sends it; otherwise Core rejects the whole
		 * request.
		 *
		 * Three-state contract:
		 *  - `undefined`: no `textDocument/definition` requests were fired
		 *    for this file, or they did not all complete. Core leaves every
		 *    call edge originating in this file as it is, including
		 *    LSP-sourced `CALLS` edges from an earlier run. The CLI MUST
		 *    omit the array rather than send a partial one.
		 *  - `[]`: requests were fired on every targeted call site in the
		 *    file and none resolved to a definition inside the project.
		 *    Core scoped-deletes the stale LSP-sourced `CALLS` edges
		 *    originating in this file and restores the structural edge at
		 *    each of those sites (the `CALLS_UNRESOLVED` or name-guessed
		 *    `CALLS` edge the structural pass recorded).
		 *  - non-empty: the complete set of resolved sites in the file.
		 *    Core replaces the structural edge at each listed site and
		 *    scoped-deletes LSP-sourced `CALLS` edges originating in this
		 *    file whose site is not listed, restoring the structural edge
		 *    at each such site. Sites that resolved outside the project or
		 *    not at all are omitted.
		 */
		callSites: z.array(callSiteDefinitionSchema).max(10_000).optional(),
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
