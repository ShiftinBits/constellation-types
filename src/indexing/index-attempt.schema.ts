/**
 * Index Attempt Schemas
 *
 * Zod schemas for atomic indexing operations. Defines the contract for
 * index attempt lifecycle statuses, lock acquisition responses, and
 * queue upload headers used between CLI and Core.
 */

import { z } from 'zod';

/**
 * All possible statuses for an index attempt throughout its lifecycle.
 */
export const indexAttemptStatusSchema = z.enum([
	'processing',
	'completed',
	'failed',
	'cancelled',
	'queued',
	'superseded',
	'cleaned_up',
]);

export type IndexAttemptStatus = z.infer<typeof indexAttemptStatusSchema>;

/**
 * Possible statuses returned when requesting an indexing lock.
 */
export const lockResponseStatusSchema = z.enum([
	'acquired',
	'current',
	'duplicate',
	'superseded',
	'queued',
	'quota_exceeded',
]);

export type LockResponseStatus = z.infer<typeof lockResponseStatusSchema>;

/**
 * Branch-related fields added to every lock-response variant when the
 * server applies the --dirty default-branch override. Fields are optional
 * for backward compatibility with older intel-api versions that omit them.
 *
 * - branchName: the EFFECTIVE branch (after resolution) the request was
 *   recorded against. May differ from the transmitted x-branch-name when
 *   --dirty causes the server to remap to project.defaultBranch.
 * - effectiveBranchName: explicit alias of branchName for clarity.
 * - remapped: true iff the resolver returned remapped=true on the server.
 */
const lockResponseBranchFields = {
	branchName: z.string().optional(),
	effectiveBranchName: z.string().optional(),
	remapped: z.boolean().optional(),
};

/**
 * Lock acquired — the caller should proceed with indexing.
 */
export const lockResponseAcquiredSchema = z.object({
	status: z.literal('acquired'),
	attemptId: z.string().uuid(),
	...lockResponseBranchFields,
});

/**
 * The requested commit is already the current indexed state.
 */
export const lockResponseCurrentSchema = z.object({
	status: z.literal('current'),
	...lockResponseBranchFields,
});

/**
 * An identical indexing request is already in progress.
 */
export const lockResponseDuplicateSchema = z.object({
	status: z.literal('duplicate'),
	...lockResponseBranchFields,
});

/**
 * A newer commit has already been indexed or is in progress.
 */
export const lockResponseSupersededSchema = z.object({
	status: z.literal('superseded'),
	activeCommit: z.string().optional(),
	...lockResponseBranchFields,
});

/**
 * The request has been queued behind an active indexing operation.
 */
export const lockResponseQueuedSchema = z.object({
	status: z.literal('queued'),
	queuedAttemptId: z.string().uuid(),
	...lockResponseBranchFields,
});

/**
 * The project has reached its symbol quota; indexing is not permitted until
 * the limit is raised or symbols are removed.
 *
 * - current: the number of symbols currently indexed for this project.
 * - limit: the configured maximum (permissive int; callers should treat any
 *   value ≤ 0 as "unlimited" if that semantic is introduced in future).
 */
export const lockResponseQuotaExceededSchema = z.object({
	status: z.literal('quota_exceeded'),
	current: z.number().int().nonnegative(),
	limit: z.number().int(),
	...lockResponseBranchFields,
});

export type LockResponseQuotaExceeded = z.infer<typeof lockResponseQuotaExceededSchema>;

/**
 * Discriminated union of all lock response variants.
 */
export const lockResponseSchema = z.discriminatedUnion('status', [
	lockResponseAcquiredSchema,
	lockResponseCurrentSchema,
	lockResponseDuplicateSchema,
	lockResponseSupersededSchema,
	lockResponseQueuedSchema,
	lockResponseQuotaExceededSchema,
]);

export type LockResponse = z.infer<typeof lockResponseSchema>;

/**
 * HTTP header name used by the CLI when claiming an indexing lock to
 * communicate its pre-scan estimated symbol count. Core reads this value
 * to enforce per-project symbol quotas before accepting the lock.
 *
 * Value is a decimal integer string (e.g. "4200").
 */
export const LOCK_ESTIMATED_SYMBOL_COUNT_HEADER = 'x-estimated-symbol-count' as const;

/**
 * Required headers for queue-based AST upload requests.
 *
 * x-constellation-dirty is OPTIONAL — when "true", the server applies the
 * default-branch override to the queued payload's effective branch.
 */
export const queueUploadHeadersSchema = z.object({
	'x-attempt-id': z.string().uuid(),
	'x-project-id': z.string(),
	'x-branch-name': z.string(),
	'x-commit-hash': z.string().length(40),
	'x-constellation-dirty': z
		.union([z.literal('true'), z.literal('false')])
		.optional(),
});

export type QueueUploadHeaders = z.infer<typeof queueUploadHeadersSchema>;
