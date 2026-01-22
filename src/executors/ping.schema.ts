/**
 * Ping Tool Schemas
 *
 * Zod schemas for the ping MCP tool.
 * Provides a lightweight connectivity check that validates authentication,
 * configuration, and project access without querying Neo4j.
 */

import { z } from 'zod';

/**
 * Input parameters schema for ping (none required)
 * Accepts empty object, rejects unknown fields
 */
export const pingParamsSchema = z.object({}).strict();

export type PingParams = z.infer<typeof pingParamsSchema>;

/**
 * Ping result schema - simple acknowledgment
 */
export const pingResultSchema = z.object({
	/** Always true on success - indicates connectivity verified */
	pong: z.literal(true),
});

export type PingResult = z.infer<typeof pingResultSchema>;
