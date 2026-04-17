/**
 * Extractor Reference Schema
 *
 * Zod schema for extractor-emitted references between symbols.
 *
 * NOTE: Named `ExtractorReference` (not `SymbolReference`) to avoid collision with
 * `symbolReferenceSchema` / `SymbolReference` in common.schema.ts, which is an
 * unrelated MCP executor response shape (a FileLocation-extended type).
 */

import { z } from 'zod';
import { extractorReferenceTypeSchema } from './reference-type.schema';

/**
 * An extractor-emitted reference to a symbol.
 *
 * Named `ExtractorReference` to avoid collision with `SymbolReference` in common.schema.ts
 * (which is an unrelated MCP executor response shape).
 */
export const extractorReferenceSchema = z.object({
	referencerId: z.string(),
	referencedName: z.string(),
	referenceType: extractorReferenceTypeSchema,
	line: z.number(),
	column: z.number(),
	/** Parent symbolId hash */
	scope: z.string().optional(),
	/** For `a.b.c`, holds 'a.b' */
	objectContext: z.string().optional(),
	language: z.string().optional(),
});

export type ExtractorReference = z.infer<typeof extractorReferenceSchema>;
