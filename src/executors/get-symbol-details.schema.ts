/**
 * Get Symbol Details Tool Schemas
 *
 * Zod schemas for the get_symbol_details MCP tool.
 * Provides detailed information about a specific symbol including references and relationships.
 */

import { z } from 'zod';
import {
	languageMetadataSchema,
	fileLocationSchema,
	riskLevelSchema,
	complexityMetricsSchema,
} from '../common.schema';

/**
 * Input parameters schema for symbol details
 */
export const getSymbolDetailsParamsSchema = z.object({
	/** Symbol ID if known */
	symbolId: z.string().optional(),

	/** Search by symbol name (requires filePath) */
	symbolName: z.string().optional(),

	/** Narrow search to specific file */
	filePath: z.string().optional(),

	/** Include all usage locations */
	includeReferences: z.boolean().optional(),

	/** Include calls, inheritance, etc. */
	includeRelationships: z.boolean().optional(),

	/** Include impact scoring */
	includeImpactScore: z.boolean().optional(),
});

export type GetSymbolDetailsParams = z.infer<
	typeof getSymbolDetailsParamsSchema
>;

/**
 * Member of a class/interface symbol (e.g. a method or property) schema
 */
export const symbolMemberSchema = z.object({
	/** Member name */
	name: z.string(),

	/** Member kind (e.g. method, property, field) */
	kind: z.string(),

	/** Full signature (for callable members) */
	signature: z.string().optional(),

	/** Access modifier */
	visibility: z.string().optional(),
});

export type SymbolMember = z.infer<typeof symbolMemberSchema>;

/**
 * Parent type references (extends/implements) for class/interface symbols schema
 */
export const symbolParentSchema = z.object({
	/** Names of extended classes/interfaces */
	extends: z.array(z.string()).optional(),

	/** Names of implemented interfaces */
	implements: z.array(z.string()).optional(),
});

export type SymbolParent = z.infer<typeof symbolParentSchema>;

/**
 * Detailed symbol information schema
 */
export const symbolDetailsSchema = fileLocationSchema.extend({
	/** Unique symbol identifier */
	id: z.string(),

	/** Symbol name */
	name: z.string(),

	/** Fully qualified name */
	qualifiedName: z.string(),

	/** Type of symbol (language-agnostic string) */
	kind: z.string(),

	/** Full signature (for functions/methods). Language-dependent availability. */
	signature: z.string().optional(),

	/** Documentation/docstring. Language-dependent availability. */
	documentation: z.string().optional(),

	/** Access modifier */
	visibility: z.string().optional(),

	/** Symbol modifiers (static, abstract, async, etc.) */
	modifiers: z.array(z.string()).optional(),

	/** Canonical, resolved type information (language-agnostic). For raw per-language type data, see languageMetadata.typeInfo. Language-dependent availability. */
	typeInfo: z.any().optional(),

	/** Canonical decorators/annotations (resolved). For raw per-language decorator data, see languageMetadata.decorators. Language-dependent availability. */
	decorators: z.array(z.string()).optional(),

	/** Whether the symbol is exported */
	isExported: z.boolean(),

	/** Whether marked as deprecated */
	isDeprecated: z.boolean(),

	/** Cyclomatic complexity metrics (present on function/method symbols) */
	complexity: complexityMetricsSchema.optional(),

	/** Language-specific metadata */
	languageMetadata: languageMetadataSchema.optional(),

	/** Members (methods, properties) for class/interface symbols. Language-dependent availability. */
	members: z.array(symbolMemberSchema).optional(),

	/** Extended/implemented parent types for class/interface symbols. Language-dependent availability. */
	parent: symbolParentSchema.optional(),
});

export type SymbolDetails = z.infer<typeof symbolDetailsSchema>;

/**
 * Symbol reference/usage location schema
 */
export const symbolUsageReferenceSchema = fileLocationSchema.extend({
	/** Type of usage */
	usageType: z.string(), // import, call, type, inherit, reference

	/** Additional context */
	context: z.string().optional(),

	/** Alias if renamed on import */
	aliasName: z.string().optional(),
});

export type SymbolUsageReference = z.infer<typeof symbolUsageReferenceSchema>;

/**
 * Symbol relationships (bidirectional) schema
 */
export const symbolRelationshipsSchema = z.object({
	/** Symbols this calls */
	calls: z.array(z.string()),

	/** Symbols that call this */
	calledBy: z.array(z.string()),

	/** Parent classes/interfaces */
	inheritsFrom: z.array(z.string()),

	/** Child classes */
	inheritedBy: z.array(z.string()),

	/** Nested symbols (methods, properties) */
	children: z.array(z.string()),
});

export type SymbolRelationships = z.infer<typeof symbolRelationshipsSchema>;

/**
 * Impact scoring for understanding change risk schema
 */
export const impactScoreSchema = z.object({
	/** Direct usage count */
	directUsage: z.number().int().nonnegative(),

	/** Transitive impact score */
	transitiveImpact: z.number().int().nonnegative(),

	/** Risk score for making changes (0-100) */
	riskScore: z.number().min(0).max(100),

	/** Risk level category */
	riskLevel: riskLevelSchema,
});

export type ImpactScore = z.infer<typeof impactScoreSchema>;

/**
 * Symbol details result schema
 */
export const symbolDetailsResultSchema = z.object({
	/** Symbol information */
	symbol: symbolDetailsSchema,

	/** Usage locations (if includeReferences=true) */
	references: z.array(symbolUsageReferenceSchema).optional(),

	/** Relationship information (if includeRelationships=true) */
	relationships: symbolRelationshipsSchema.optional(),

	/** Impact metrics (if includeImpactScore=true) */
	impactScore: impactScoreSchema.optional(),
});

export type SymbolDetailsResult = z.infer<typeof symbolDetailsResultSchema>;
