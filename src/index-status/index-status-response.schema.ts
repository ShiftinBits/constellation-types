import { z } from 'zod';
import { enrichmentStatusSchema } from '../enrichment/enrichment.schema';
import { phaseMetricsArraySchema } from './phase-metrics.schema';

/**
 * Nested object returned on index-status when enrichment has begun. Omitted
 * entirely while enrichment is still `pending`.
 */
export const indexStatusEnrichmentSchema = z.object({
	status: enrichmentStatusSchema,
	filesProcessed: z.number().int().nonnegative().nullable(),
	completedAt: z
		.union([z.string().datetime({ offset: true }), z.date()])
		.nullable(),
});
export type IndexStatusEnrichment = z.infer<typeof indexStatusEnrichmentSchema>;

/**
 * Index-status values the CLI understands. `current`/`processing`/`stale`
 * are emitted directly by the server; `failed` is reserved for CLI clients
 * that still branch on it (legacy behaviour — the server currently coerces
 * FAILED/CANCELLED to `stale`).
 */
export const indexStatusValueSchema = z.enum([
	'current',
	'processing',
	'stale',
	'failed',
]);
export type IndexStatusValue = z.infer<typeof indexStatusValueSchema>;

const dateLike = z.union([z.string().datetime({ offset: true }), z.date()]);

/**
 * Server still running the three-pass pipeline for the latest attempt.
 */
export const indexStatusProcessingSchema = z
	.object({
		status: z.literal('processing'),
		commitHash: z.string().nullable().optional(),
		startedAt: dateLike.optional(),
		phaseMetrics: phaseMetricsArraySchema.optional(),
	})
	.passthrough();

/**
 * Latest attempt completed and matches the commit the CLI asked about
 * (or no specific commit was requested).
 */
export const indexStatusCurrentSchema = z
	.object({
		status: z.literal('current'),
		commitHash: z.string().nullable().optional(),
		completedAt: dateLike.nullable().optional(),
		enrichment: indexStatusEnrichmentSchema.optional(),
		phaseMetrics: phaseMetricsArraySchema.optional(),
	})
	.passthrough();

/**
 * Latest attempt completed but on a different commit than the CLI asked
 * about, OR the attempt failed/was cancelled. Both map to `stale` on the
 * wire so CLI retry logic is uniform.
 */
export const indexStatusStaleSchema = z
	.object({
		status: z.literal('stale'),
		currentCommit: z.string().nullable().optional(),
		requestedCommit: z.string().optional(),
		enrichment: indexStatusEnrichmentSchema.optional(),
		phaseMetrics: phaseMetricsArraySchema.optional(),
	})
	.passthrough();

/**
 * Reserved for legacy clients. The server does not emit this today, but
 * pollIndexStatus branches on `status === 'failed'` defensively.
 */
export const indexStatusFailedSchema = z
	.object({
		status: z.literal('failed'),
		currentCommit: z.string().nullable().optional(),
		requestedCommit: z.string().optional(),
		enrichment: indexStatusEnrichmentSchema.optional(),
		phaseMetrics: phaseMetricsArraySchema.optional(),
	})
	.passthrough();

/**
 * Discriminated union over the four status values. Extra top-level fields
 * are preserved via `.passthrough()` so a newer server can add metadata
 * without breaking older CLI builds.
 */
export const indexStatusResponseSchema = z.discriminatedUnion('status', [
	indexStatusProcessingSchema,
	indexStatusCurrentSchema,
	indexStatusStaleSchema,
	indexStatusFailedSchema,
]);
export type IndexStatusResponse = z.infer<typeof indexStatusResponseSchema>;
export type IndexStatusProcessing = z.infer<typeof indexStatusProcessingSchema>;
export type IndexStatusCurrent = z.infer<typeof indexStatusCurrentSchema>;
export type IndexStatusStale = z.infer<typeof indexStatusStaleSchema>;
export type IndexStatusFailed = z.infer<typeof indexStatusFailedSchema>;
