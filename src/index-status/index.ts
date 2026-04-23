/**
 * Index-Status Schemas Barrel Export
 *
 * Shared types for the index-status endpoint that the CLI polls while
 * the server finishes AST ingestion. Single source of truth for:
 *   - Per-phase metrics (pass1/pass2/pass2b/pass3)
 *   - Enrichment lifecycle surfaced to the CLI
 *   - Index-status response discriminated union
 */

export {
	phaseNameSchema,
	phaseMetricsSchema,
	phaseMetricsArraySchema,
	throughputPerSec,
	type PhaseName,
	type PhaseMetrics,
} from './phase-metrics.schema';

export {
	indexStatusEnrichmentSchema,
	indexStatusValueSchema,
	indexStatusProcessingSchema,
	indexStatusCurrentSchema,
	indexStatusStaleSchema,
	indexStatusFailedSchema,
	indexStatusResponseSchema,
	type IndexStatusEnrichment,
	type IndexStatusValue,
	type IndexStatusProcessing,
	type IndexStatusCurrent,
	type IndexStatusStale,
	type IndexStatusFailed,
	type IndexStatusResponse,
} from './index-status-response.schema';
