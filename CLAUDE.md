# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

svg2ember is a PNPM monorepo that converts SVG files to Ember template-only components. The tool provides both a CLI interface and Vite plugin, similar in concept to SVGR for React but tailored for Ember applications.

## Current Status

**Phase**: Phase 4 Complete - All packages implemented and ready for publishing
**Active Branch**: `phase-3-vite` 
**Package Status**: All packages (`core/`, `cli/`, `vite/`) are fully implemented with comprehensive test coverage
**Status**: Production ready - all features implemented, tested, and documented

## Important References

- **PROJECT_PLAN.md** - Comprehensive roadmap, implementation phases, and technical specifications
- **README.md** - User-facing documentation with usage examples

## Architecture

The project is structured as a monorepo with three main packages:
- `packages/core/` - Core transformation logic using svg-parser and svgo
- `packages/cli/` - Command-line interface for batch and single file conversion
- `packages/vite/` - Vite plugin for development workflow integration

The transformation pipeline:
1. Parse SVG using `svg-parser` package
2. Optimize SVG with `svgo`
3. Generate Ember component with `...attributes` spread on the `<svg>` element
4. Output as `.gjs` (JavaScript) or `.gts` (TypeScript) based on configuration

## Common Commands

Build all packages:
```bash
pnpm build
```

Development mode with watch:
```bash
pnpm dev
```

Lint and format:
```bash
pnpm lint
pnpm format
```

## Key Usage Patterns

CLI transforms:
- Single file: `pnpx @svg2ember/cli input.svg output.gjs`
- With TypeScript: `pnpx @svg2ember/cli --typescript input.svg output.gts`
- Directory: `pnpx @svg2ember/cli [--out-dir dir] [--ignore-existing] [src-dir]`

Vite plugin enables imports like:
```gts
import Icon from './icon.svg?component';
// Icon can receive class, data-* attributes that pass through to <svg>
```

## Implementation Priorities

1. **Core Package First** - Implement transformation logic before CLI or Vite plugin
2. **AST-Based Parsing** - Use svg-parser for proper DOM structure handling (NO regex/string manipulation)
3. **Package Dependencies** - Core is standalone, CLI and Vite depend on core

## Technical Requirements

- **TypeScript** throughout all packages
- **Key Dependencies**: svg-parser (AST parsing), svgo (optimization)
- **Testing**: Vitest (modern TypeScript/ESM support)
- **Output**: Ember template-only components (.gjs/.gts)
- **Attribute Spreading**: `...attributes` applied to root `<svg>` element
- **Publishing**: Package publishing deferred until working implementation

## Development Constraints

- **Parsing Approach**: Must use svg-parser AST, never regex or string manipulation
- **Node.js**: 18+ required for modern ESM support
- **Code Quality**: Run `pnpm lint` before commits
- **Architecture**: Maintain clean separation between core/cli/vite packages