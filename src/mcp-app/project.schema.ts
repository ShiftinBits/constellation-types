import { z } from 'zod';

export const projectInfoSchema = z.object({
	projectId: z.string(),
	projectName: z.string(),
	defaultBranch: z.string(),
	lastIndexedAt: z.string().datetime().optional(),
	fileCount: z.number().int().nonnegative().optional(),
	languages: z.array(z.string()).optional(),
});
export type ProjectInfo = z.infer<typeof projectInfoSchema>;

export const projectListResponseSchema = z.object({
	projects: z.array(projectInfoSchema),
});
export type ProjectListResponse = z.infer<typeof projectListResponseSchema>;

export const projectResolveResponseSchema = projectInfoSchema.pick({
	projectId: true,
	projectName: true,
	defaultBranch: true,
});
export type ProjectResolveResponse = z.infer<typeof projectResolveResponseSchema>;
