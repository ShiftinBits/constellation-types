/**
 * Project State Schema
 *
 * Zod schema for project state API response.
 * Contains metadata about the current state of an indexed project.
 */

import { z } from 'zod';

/**
 * Project state response containing metadata about the current state of the project.
 */
export const projectStateSchema = z.object({
	/** Unique project identifier (normalized git remote URL) */
	projectId: z.string(),

	/** Derived project name from the git repository */
	projectName: z.string(),

	/** Current branch being queried */
	branch: z.string(),

	/** Latest git commit hash that was indexed (null if never indexed) */
	latestCommit: z.string().nullable(),

	/** Total number of files indexed in the project */
	fileCount: z.number().int().nonnegative(),

	/** Timestamp of the most recently indexed file (null if never indexed) */
	lastIndexedAt: z.string().nullable(),

	/** List of programming languages detected in the project */
	languages: z.array(z.string()),
});

export type ProjectState = z.infer<typeof projectStateSchema>;
