import { z } from 'zod';

// --- Enums ---

export const indexErrorReportStatusSchema = z.enum([
	'unresolved',
	'resolved',
	'archived',
]);
export type IndexErrorReportStatus = z.infer<
	typeof indexErrorReportStatusSchema
>;

export const indexOutcomeSchema = z.enum(['succeeded', 'failed']);
export type IndexOutcome = z.infer<typeof indexOutcomeSchema>;

export const indexTypeSchema = z.enum(['full', 'incremental']);
export type IndexType = z.infer<typeof indexTypeSchema>;

export const logLevelSchema = z.enum(['info', 'warn', 'error']);
export type LogLevel = z.infer<typeof logLevelSchema>;

// --- Nested schemas ---

export const errorEntrySchema = z.object({
	type: z.string(),
	message: z.string(),
	phase: z.string(),
	filePath: z.string().optional(),
	stack: z.string().optional(),
});
export type ErrorEntry = z.infer<typeof errorEntrySchema>;

export const warningEntrySchema = z.object({
	type: z.string(),
	message: z.string(),
	phase: z.string(),
	filePath: z.string().optional(),
});
export type WarningEntry = z.infer<typeof warningEntrySchema>;

export const errorDataSchema = z.object({
	errors: z.array(errorEntrySchema),
	warnings: z.array(warningEntrySchema),
});
export type ErrorData = z.infer<typeof errorDataSchema>;

export const logEntrySchema = z.object({
	level: logLevelSchema,
	message: z.string(),
	timestamp: z.string().datetime(),
});
export type LogEntry = z.infer<typeof logEntrySchema>;

// --- Request schemas ---

export const createErrorReportSchema = z.object({
	errorSummary: z.string().max(500),
	errorData: errorDataSchema,
	logEntries: z.array(logEntrySchema),
	cliVersion: z.string(),
	outcome: indexOutcomeSchema,
	indexType: indexTypeSchema,
});
export type CreateErrorReport = z.infer<typeof createErrorReportSchema>;

export const updateErrorReportSchema = z.object({
	status: indexErrorReportStatusSchema.exclude(['archived']),
});
export type UpdateErrorReport = z.infer<typeof updateErrorReportSchema>;

// --- Response schemas ---

export const errorReportResponseSchema = z.object({
	id: z.string(),
	organizationId: z.string(),
	userId: z.string(),
	projectId: z.string(),
	branchName: z.string(),
	commitHash: z.string().nullable(),
	indexType: indexTypeSchema,
	status: indexErrorReportStatusSchema,
	outcome: indexOutcomeSchema,
	errorSummary: z.string(),
	errorData: errorDataSchema,
	logEntries: z.array(logEntrySchema),
	cliVersion: z.string(),
	resolvedAt: z.string().nullable(),
	resolvedBy: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
	// Joined fields (from list endpoint)
	organizationName: z.string().optional(),
	projectName: z.string().optional(),
	userEmail: z.string().optional(),
	resolvedByEmail: z.string().optional(),
});
export type ErrorReportResponse = z.infer<typeof errorReportResponseSchema>;

export const errorReportMetricsSchema = z.object({
	unresolvedCount: z.number(),
	failedRunCount: z.number(),
	resolvedLast30d: z.number(),
	avgResolutionDays: z.number().nullable(),
	affectedOrgCount: z.number(),
});
export type ErrorReportMetrics = z.infer<typeof errorReportMetricsSchema>;
