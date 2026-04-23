import { z } from 'zod';

/**
 * Per-phase wall-clock metrics emitted by the Constellation AST ingestion
 * pipeline.
 *
 * Each entry records the duration and work completed by one of the four
 * processing phases:
 *   - pass1:  File + Symbol node creation
 *   - pass2:  relationship creation
 *   - pass2b: post-pass-2 resolution sub-phases (exports, wildcards,
 *             qualified calls, return-type inference, orphan cleanup)
 *   - pass3:  cross-file symbol resolution
 *
 * Metrics are persisted server-side on the IndexAttempt row (phaseMetrics
 * JSONB column) and surfaced to the CLI via the index-status endpoint.
 */
export const phaseNameSchema = z.enum(['pass1', 'pass2', 'pass2b', 'pass3']);
export type PhaseName = z.infer<typeof phaseNameSchema>;

export const phaseMetricsSchema = z.object({
	phase: phaseNameSchema,
	durationMs: z.number().int().nonnegative(),
	fileCount: z.number().int().nonnegative(),
	symbolCount: z.number().int().nonnegative().optional(),
	relationshipCount: z.number().int().nonnegative().optional(),
	throughputPerSec: z.number().nonnegative(),
	deadlockRetryCount: z.number().int().nonnegative().optional(),
});
export type PhaseMetrics = z.infer<typeof phaseMetricsSchema>;

export const phaseMetricsArraySchema = z.array(phaseMetricsSchema);

/**
 * Compute throughput in items/sec, guarding against divide-by-zero and
 * non-finite inputs (NaN, ±Infinity). Returns 0 when the duration is not
 * a positive finite number, when itemCount is not finite, or when
 * itemCount is negative (the phaseMetrics schema requires nonnegative,
 * so we clamp rather than emit a value that would fail validation).
 */
export function throughputPerSec(
	itemCount: number,
	durationMs: number,
): number {
	if (!Number.isFinite(durationMs) || durationMs <= 0) return 0;
	if (!Number.isFinite(itemCount) || itemCount < 0) return 0;
	return Number(((itemCount * 1000) / durationMs).toFixed(2));
}
