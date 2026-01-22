# Constellation Shared Types

![TypeScript v5.7+](https://img.shields.io/badge/TypeScript-v5.7%2B-3178C6.svg?logo=typescript&logoColor=white) ![Node.js v22+](https://img.shields.io/badge/Node.js-v22%2B-5FA04E.svg?logo=node.js&logoColor=white) [![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](LICENSE) [![Made with Claude Code](https://img.shields.io/badge/made%20with%20Claude%20Code-D97757.svg?logo=claude&logoColor=white)](https://www.anthropic.com/claude-code)

Shared Zod schemas and TypeScript types for Constellation MCP and CLI projects.

## Overview

This package provides the single source of truth for all MCP and CLI data types used across the Constellation system:

- `constellation-mcp` - MCP client and Code Mode sandbox
- `constellation-cli` - Command-line interface tool

> [!NOTE]  
> The `npm run build` script in this project checks for the `process.env.CI` environment variable value.
> If it is not set then the post-build script will run `npm link` to create a local reference to this package.
> Projects dependent on this package also check if the `process.env.CI` value is not set and utilize the local `npm link`.

## Development

```bash
# Install dependencies
npm install

# Build (ESM + CJS + types)
npm run build

# Type check
npm run type-check

# Clean build output
npm run clean
```

## License

AGPL-3.0 - See [LICENSE](LICENSE) for details.

Copyright © 2026 ShiftinBits Inc.
