# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

svg2ember is a PNPM monorepo that converts SVG files to Ember template-only components. The tool provides both a CLI interface and Vite plugin, similar in concept to SVGR for React but tailored for Ember applications.

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

## Technical Requirements

- TypeScript throughout
- Dependencies: svg-parser, svgo
- Output: Ember template-only components (.gjs/.gts)
- Attribute spreading: `...attributes` applied to root `<svg>` element