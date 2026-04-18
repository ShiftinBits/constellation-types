/**
 * Classification Map Schema
 *
 * Zod schema for code classification maps produced by the LSP classification tool.
 * Maps line:column locations in a file to their reference types.
 */

import { z } from 'zod';
import { referenceTypeSchema } from './reference-type.schema';

export const classificationMapEntrySchema = z
	.object({
		line: z.number().int().nonnegative(),
		column: z.number().int().nonnegative(),
		referenceType: referenceTypeSchema,
	})
	.strict();

export type ClassificationMapEntry = z.infer<typeof classificationMapEntrySchema>;

export const classificationMapSchema = z
	.object({
		filePath: z.string().min(1),
		entries: z.array(classificationMapEntrySchema),
	})
	.strict();

export type ClassificationMap = z.infer<typeof classificationMapSchema>;
