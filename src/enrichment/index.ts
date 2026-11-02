/**
 * Enrichment Schemas Barrel Export
 *
 * Shared types for LSP enrichment operations between CLI and Core.
 */

export {
	referenceLocationSchema,
	type ReferenceLocation,
	callReferenceSchema,
	type CallReference,
	typeInfoSchema,
	type TypeInfo,
	symbolEnrichmentSchema,
	type SymbolEnrichment,
	callSiteDefinitionSchema,
	type CallSiteDefinition,
	fileEnrichmentSchema,
	type FileEnrichment,
	enrichmentMetadataSchema,
	type EnrichmentMetadata,
	enrichmentStatusSchema,
	type EnrichmentStatus,
} from './enrichment.schema';
