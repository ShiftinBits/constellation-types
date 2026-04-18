/**
 * Import Schemas
 *
 * Zod schemas for per-specifier import metadata emitted by extractors.
 * Replaces legacy parallel-arrays shape with structured per-specifier objects.
 */

import { z } from 'zod';

/**
 * A single import specifier — one name bound into the importing file's scope.
 *
 * | Import form                   | Emitted specifier                                                          |
 * |-------------------------------|----------------------------------------------------------------------------|
 * | import Foo from './x'         | { local:'Foo', original:'default', isDefault:true, isNamespace:false }     |
 * | import { a } from './x'       | { local:'a', original:'a', isDefault:false, isNamespace:false }            |
 * | import { a as B }             | { local:'B', original:'a', isDefault:false, isNamespace:false }            |
 * | import { default as Foo }     | { local:'Foo', original:'default', isDefault:true, isNamespace:false }     |
 * | import * as ns                | { local:'ns', original:undefined, isDefault:false, isNamespace:true }      |
 * | Python: import foo.bar.baz    | { local:'foo', original:'foo.bar.baz', isDefault:false, isNamespace:false }|
 */
export const importSpecifierSchema = z.object({
	local: z.string(),
	original: z.string().optional(),
	isDefault: z.boolean(),
	isNamespace: z.boolean(),
});

export type ImportSpecifier = z.infer<typeof importSpecifierSchema>;

/**
 * A single import statement's emitted metadata.
 * Per-specifier `isDefault`/`isNamespace` supports combined forms like `import Foo, { a, b } from './x'`.
 */
export const importSchema = z.object({
	source: z.string(),
	specifiers: z.array(importSpecifierSchema),
	isType: z.boolean(),
	isDynamic: z.boolean(),
	isConditional: z.boolean().optional(),
	isLazy: z.boolean().optional(),
	isWildcard: z.boolean().optional(),
	line: z.number(),
	column: z.number(),
});

export type Import = z.infer<typeof importSchema>;
