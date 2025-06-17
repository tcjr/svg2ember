# svg2ember

Convert SVG files to Ember template-only components with CLI and Vite plugin support.

## Overview

svg2ember is a TypeScript-based tool that transforms SVG files into Ember template-only components, similar to SVGR for React but designed specifically for Ember applications. It provides both command-line tools and Vite plugin integration for seamless development workflows.

## Features

- 🎯 **AST-based parsing** - Uses svg-parser for proper DOM structure handling
- ⚡ **SVG optimization** - Integrates svgo for optimized output  
- 🔧 **TypeScript support** - Full TypeScript support with `.gts` components
- 📦 **Monorepo architecture** - Separate packages for core, CLI, and Vite plugin
- 🎨 **Attribute spreading** - Generated components accept `...attributes` on root `<svg>`

## Installation

> **Note**: Packages will be published after initial implementation is complete.

```bash
# CLI usage (future)
pnpx @svg2ember/cli input.svg output.gjs

# Development (current)
pnpm install
pnpm build
```

## Usage

### Command Line Interface

Transform a single SVG file:
```bash
pnpx @svg2ember/cli input/butterfly.svg output/butterfly.gjs
```

With TypeScript support:
```bash
pnpx @svg2ember/cli --typescript input/butterfly.svg output/butterfly.gts
```

Transform all SVG files in a directory:
```bash
pnpx @svg2ember/cli --out-dir components/icons icons/
pnpx @svg2ember/cli --out-dir components/icons --ignore-existing icons/
```

### Vite Plugin

Configure the Vite plugin to enable SVG component imports:

```js
// vite.config.js
import { svg2ember } from '@svg2ember/vite';

export default {
  plugins: [
    svg2ember()
  ]
};
```

Use in Ember components:
```gts
import Butterfly from '../icons/butterfly.svg?component';
import butterflyUrl from '../icons/butterfly.svg';

<template>
  <h1>A butterfly (component):</h1>
  <Butterfly class='h-6 w-6' data-my-icon />
  
  <h1>A butterfly (image):</h1>
  <img src={{butterflyUrl}} alt='butterfly' />
</template>
```

The `class` and `data-my-icon` attributes are passed through to the root `<svg>` element via `...attributes`.

## Development

This project uses PNPM workspaces for monorepo management.

### Setup
```bash
pnpm install
```

### Build all packages
```bash
pnpm build
```

### Development mode with watch
```bash
pnpm dev
```

### Lint and format
```bash
pnpm lint
pnpm format
```

## Architecture

The project consists of three packages:

- **`packages/core/`** - Core SVG transformation logic using svg-parser and svgo
- **`packages/cli/`** - Command-line interface for batch and single file processing  
- **`packages/vite/`** - Vite plugin for development workflow integration

## Project Status

Currently in development. See [PROJECT_PLAN.md](./PROJECT_PLAN.md) for detailed roadmap and implementation status.

## License

ISC
