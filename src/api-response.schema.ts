/**
 * API Response Schema
 *
 * Standardized wrapper for all MCP tool responses.
 */

import { z } from 'zod';

/**
 * Generic API response wrapper schema factory
 */
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z.object({
		success: z.literal(true),
		data: dataSchema,
	});

/**
 * API error response schema
 */
export const apiErrorResponseSchema = z.object({
	success: z.literal(false),
	error: z.object({
		code: z.string(),
		message: z.string(),
		details: z.any().optional(),
	}),
});

/**
 * Generic API response type
 */
export type ApiResponse<T> =
	| { success: true; data: T }
	| { success: false; error: { code: string; message: string; details?: any } };

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse<T>(
	response: ApiResponse<T>,
): response is { success: true; data: T } {
	return response.success === true;
}

/**
 * Type guard to check if response is an error
 */
export function isErrorResponse<T>(
	response: ApiResponse<T>,
): response is {
	success: false;
	error: { code: string; message: string; details?: any };
} {
	return response.success === false;
}
