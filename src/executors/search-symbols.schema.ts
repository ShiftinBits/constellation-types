/**
 * Search Symbols Tool Schemas
 *
 * Zod schemas for the search_symbols MCP tool.
 * Enables searching for functions, classes, types, etc. across the codebase.
 */

import { z } from 'zod';
import {
	paginationMetadataSchema,
	languageMetadataSchema,
	fileLocationSchema,
} from '../common.schema';

/**
 * Input parameters schema for symbol search
 */
export const searchSymbolsParamsSchema = z.object({
	/** Name or pattern to search for (max: 200 chars) */
	query: z.string().min(1).max(200),

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
	includeDocumentation: z.boolean().optional(),
});

export type SearchSymbolsParams = z.infer<typeof searchSymbolsParamsSchema>;

/**
 * Individual symbol result schema
 */
export const symbolInfoSchema = fileLocationSchema.extend({
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

	/** Language-specific metadata */
	languageMetadata: languageMetadataSchema.optional(),
});

export type SymbolInfo = z.infer<typeof symbolInfoSchema>;

/**
 * Search symbols result schema
 */
export const searchSymbolsResultSchema = z.object({
	/** Array of matching symbols */
	symbols: z.array(symbolInfoSchema),

	/** Pagination information */
	pagination: paginationMetadataSchema.optional(),
});

export type SearchSymbolsResult = z.infer<typeof searchSymbolsResultSchema>;
