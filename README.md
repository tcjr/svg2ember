# svg2ember

Convert SVG files to Ember template-only components with CLI and Vite plugin support.

## Overview

svg2ember is a TypeScript-based tool that transforms SVG files into Ember template-only components. It provides both command-line tools and Vite plugin integration for seamless development workflows.

## Features

- ⚡ **SVG optimization** - Integrates svgo for optimized output  
- 💙 **TypeScript support** - Full TypeScript support with `.gts` components
- 🔧 **Attribute spreading** - Generated components have `...attributes` on root `<svg>`
- 🎨 **Composability** - Generated components `{{yield}}` in `<svg>` body to allow children

## Installation

```bash
pnpm add --save-dev svg2ember
```

## Usage

### Command Line Interface

> Exact CLI script binary is WIP. It's here: `./dist/cli/cli.js`

Transform a single SVG file:
```bash
node ./dist/cli/cli.js input/butterfly.svg output/butterfly.gjs
```

With TypeScript support:
```bash
node ./dist/cli/cli.js --typescript input/butterfly.svg output/butterfly.gts
```

Transform all SVG files in a directory:
```bash
node ./dist/cli/cli.js --out-dir components/icons icons/
node ./dist/cli/cli.js --out-dir components/icons --ignore-existing icons/
```

### Vite Plugin

Configure the Vite plugin to enable SVG component imports:

```js
// vite.config.js
import svg2ember from 'svg2ember/vite';

export default {
  plugins: [
    svg2ember()
    // other Ember plugins...
  ]
};
```

Use in Ember components:
```gts
import Butterfly from '../icons/butterfly.svg?component';
import butterflyUrl from '../icons/butterfly.svg'; // standard imports unaffected

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

### Lint
```bash
pnpm lint
```

## Project Status

Currently in development. See [PROJECT_PLAN.md](./PROJECT_PLAN.md) for detailed roadmap and implementation status.

## Thanks

Inspired by the great [react-svgr](https://react-svgr.com/) tool for creating React components from SVGs.

## License

MIT
