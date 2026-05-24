import { z } from 'zod';

/**
 * Cleanup job message contract (intel-api producer -> reaper-service consumer, via SQS).
 *
 * `kind` is the discriminator — there is intentionally no `version` field. Consumers
 * route on `kind` and should fail unknown kinds to a DLQ. This schema is the single
 * source of truth for the contract; services must not duplicate these types.
 */

/**
 * Fields common to every cleanup job.
 *
 * `organizationId` is `org:`-prefixed and `projectId` is `proj:`-prefixed, following
 * the Constellation ID prefix conventions. They are typed as plain strings to match the
 * existing convention across the package (e.g. error-report and project-state schemas).
 */
const cleanupJobCommonFields = {
	organizationId: z.string(),
	projectId: z.string(),
	branch: z.string(),
	indexAttemptId: z.string().uuid(),
	/** ISO-8601 timestamp (with optional timezone offset) of when the job was enqueued. */
	enqueuedAt: z.string().datetime({ offset: true }),
	/** Optional human-readable explanation for why the cleanup was triggered. */
	reason: z.string().optional(),
} as const;

/** A previously-active index attempt was superseded by a newer successful index. */
export const reclaimSupersededJobSchema = z.object({
	kind: z.literal('reclaim_superseded'),
	...cleanupJobCommonFields,
	previousActiveAttemptId: z.string().uuid(),
});

/** An index attempt aged past its retention window. */
export const reclaimExpiredJobSchema = z.object({
	kind: z.literal('reclaim_expired'),
	...cleanupJobCommonFields,
});

/** An index attempt was cancelled before completion. */
export const reclaimCancelledJobSchema = z.object({
	kind: z.literal('reclaim_cancelled'),
	...cleanupJobCommonFields,
});

/** Discriminated union of all cleanup job messages, keyed on `kind`. */
export const cleanupJobSchema = z.discriminatedUnion('kind', [
	reclaimSupersededJobSchema,
	reclaimExpiredJobSchema,
	reclaimCancelledJobSchema,
]);

/** Enum of valid `kind` values — useful for handler routing and exhaustiveness checks. */
export const cleanupJobKindSchema = z.enum([
	'reclaim_superseded',
	'reclaim_expired',
	'reclaim_cancelled',
]);

export type ReclaimSupersededJob = z.infer<typeof reclaimSupersededJobSchema>;
export type ReclaimExpiredJob = z.infer<typeof reclaimExpiredJobSchema>;
export type ReclaimCancelledJob = z.infer<typeof reclaimCancelledJobSchema>;
export type CleanupJob = z.infer<typeof cleanupJobSchema>;
export type CleanupJobKind = z.infer<typeof cleanupJobKindSchema>;
