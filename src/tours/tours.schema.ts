/**
 * Tours module — first-sign-in walkthrough.
 *
 * Single source of truth for tour ids, step ids, and eligibility/progress
 * payloads shared between the web frontend and the mgmt-api backend.
 */

import { z } from 'zod';

export const TOUR_IDS = [
	'org-admin-v1',
	'developer-v1',
	'constellation-admin-v1',
] as const;
export type TourId = (typeof TOUR_IDS)[number];
export const tourIdSchema = z.enum(TOUR_IDS);

export const ORG_ADMIN_STEP_IDS = [
	'welcome',
	'sidebar-projects',
	'create-project-cta',
	'project-form',
	'create-key-nav',
	'create-key',
	'create-key-form',
	'cli-instructions',
] as const;

export const DEVELOPER_STEP_IDS = [
	'welcome',
	'create-key-nav',
	'create-key',
	'create-key-form',
	'cli-instructions',
] as const;

// constellation-admin-v1 is a reserved placeholder — no steps are defined yet,
// so validateStepIdForTour will reject every stepId for this tour until the
// admin walkthrough is designed. Callers should gate progress writes on a
// non-empty TOUR_STEP_IDS[tourId] before invoking the validator.
export const TOUR_STEP_IDS: Record<TourId, readonly string[]> = {
	'org-admin-v1': ORG_ADMIN_STEP_IDS,
	'developer-v1': DEVELOPER_STEP_IDS,
	'constellation-admin-v1': [],
};

export const TOUR_STATUSES = [
	'eligible',
	'completed',
	'dismissed',
	'ineligible',
] as const;
export type TourStatus = (typeof TOUR_STATUSES)[number];
export const tourStatusSchema = z.enum(TOUR_STATUSES);

export const tourEligibilityResponseSchema = z.object({
	tourId: tourIdSchema,
	status: tourStatusSchema,
	lastStepReached: z.string().max(64).optional(),
});
export type TourEligibilityResponse = z.infer<
	typeof tourEligibilityResponseSchema
>;

export const tourProgressBodySchema = z.object({
	stepId: z.string().min(1).max(64),
});
export type TourProgressBody = z.infer<typeof tourProgressBodySchema>;

/**
 * Validates that a step id is a member of the given tour's step list.
 * Returns the step id if valid, throws ZodError otherwise.
 */
export function validateStepIdForTour(
	tourId: TourId,
	stepId: string,
): string {
	const allowed = TOUR_STEP_IDS[tourId];
	if (!allowed.includes(stepId)) {
		throw new z.ZodError([
			{
				code: 'custom',
				path: ['stepId'],
				message: `stepId "${stepId}" is not valid for tour "${tourId}"`,
			},
		]);
	}
	return stepId;
}
