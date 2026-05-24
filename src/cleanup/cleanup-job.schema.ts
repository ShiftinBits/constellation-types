import { z } from 'zod';

/**
 * Cleanup job message contract (intel-api producer -> reaper-service consumer, via SQS).
 *
 * `kind` is the discriminator — there is intentionally no `version` field. Consumers
 * route on `kind` and should fail unknown kinds to a DLQ. This schema is the single
 * source of truth for the contract; services must not duplicate these types.
 */

/**
 * Valid `kind` discriminator values — the single source of truth for cleanup job kinds.
 * The discriminated-union variants below reference these via
 * `z.literal(cleanupJobKindSchema.enum.*)` so the literals and this enum cannot drift.
 * Also useful for handler routing and exhaustiveness checks (`cleanupJobKindSchema.options`).
 */
export const cleanupJobKindSchema = z.enum([
	'reclaim_superseded',
	'reclaim_expired',
	'reclaim_cancelled',
]);

/**
 * Fields common to every cleanup job.
 *
 * `organizationId` is `org:`-prefixed and `projectId` is `proj:`-prefixed, following
 * the Constellation ID prefix conventions. They are typed as plain strings to match the
 * existing convention across the package (e.g. error-report and project-state schemas).
 * `organizationId`, `projectId`, and `branch` jointly scope the data a reaper reclaims, so
 * each carries `.min(1)` — an empty routing key would silently mis-scope a destructive cleanup.
 */
const cleanupJobCommonFields = {
	organizationId: z.string().min(1),
	projectId: z.string().min(1),
	branch: z.string().min(1),
	indexAttemptId: z.string().uuid(),
	/** ISO-8601 timestamp (with optional timezone offset) of when the job was enqueued. */
	enqueuedAt: z.string().datetime({ offset: true }),
	/** Optional human-readable explanation for why the cleanup was triggered. */
	reason: z.string().optional(),
} as const;

/** A previously-active index attempt was superseded by a newer successful index. */
export const reclaimSupersededJobSchema = z.object({
	kind: z.literal(cleanupJobKindSchema.enum.reclaim_superseded),
	...cleanupJobCommonFields,
	previousActiveAttemptId: z.string().uuid(),
});

/** An index attempt aged past its retention window. */
export const reclaimExpiredJobSchema = z.object({
	kind: z.literal(cleanupJobKindSchema.enum.reclaim_expired),
	...cleanupJobCommonFields,
});

/** An index attempt was cancelled before completion. */
export const reclaimCancelledJobSchema = z.object({
	kind: z.literal(cleanupJobKindSchema.enum.reclaim_cancelled),
	...cleanupJobCommonFields,
});

/** Discriminated union of all cleanup job messages, keyed on `kind`. */
export const cleanupJobSchema = z.discriminatedUnion('kind', [
	reclaimSupersededJobSchema,
	reclaimExpiredJobSchema,
	reclaimCancelledJobSchema,
]);

export type ReclaimSupersededJob = z.infer<typeof reclaimSupersededJobSchema>;
export type ReclaimExpiredJob = z.infer<typeof reclaimExpiredJobSchema>;
export type ReclaimCancelledJob = z.infer<typeof reclaimCancelledJobSchema>;
export type CleanupJob = z.infer<typeof cleanupJobSchema>;
export type CleanupJobKind = z.infer<typeof cleanupJobKindSchema>;
