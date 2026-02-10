/**
 * Tree-sitter AST Type Definitions
 *
 * Minimal interfaces mirroring tree-sitter's SyntaxNode, Tree, and Point types.
 * Allows consumers (Core, CLI) to reference these types without depending on the
 * native tree-sitter package.
 */

export interface SyntaxNode {
	tree: Tree;
	id: number;
	typeId: number;
	grammarId: number;
	type: string;
	grammarType: string;
	isNamed: boolean;
	isMissing: boolean;
	isExtra: boolean;
	hasChanges: boolean;
	hasError: boolean;
	isError: boolean;
	text: string;
	parseState: number;
	nextParseState: number;
	startPosition: Point;
	endPosition: Point;
	startIndex: number;
	endIndex: number;
	parent: SyntaxNode | null;
	children: Array<SyntaxNode>;
	namedChildren: Array<SyntaxNode>;
	childCount: number;
	namedChildCount: number;
	firstChild: SyntaxNode | null;
	firstNamedChild: SyntaxNode | null;
	lastChild: SyntaxNode | null;
	lastNamedChild: SyntaxNode | null;
	nextSibling: SyntaxNode | null;
	nextNamedSibling: SyntaxNode | null;
	previousSibling: SyntaxNode | null;
	previousNamedSibling: SyntaxNode | null;
	descendantCount: number;

	child(index: number): SyntaxNode | null;
	childForFieldName(fieldName: string): SyntaxNode | null;
	descendantsOfType(
		types: string | string[],
		startPosition?: Point,
		endPosition?: Point,
	): Array<SyntaxNode>;
}

export interface Tree {
	readonly rootNode: SyntaxNode;
}

export interface Point {
	row: number;
	column: number;
}
