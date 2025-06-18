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

You can run `svg2ember` directly using `pnpx` without installing it:

```bash
pnpx svg2ember input.svg output.gjs
pnpx svg2ember --typescript input.svg output.gts
pnpx svg2ember --out-dir components/icons icons/
```

Alternatively, you can install it globally:

```bash
pnpm add --global svg2ember
```

And then run it:

```bash
svg2ember input.svg output.gjs
svg2ember --typescript input.svg output.gts
svg2ember --out-dir components/icons icons/
# To process all SVGs in the 'icons/' directory and output them to 'components/icons',
# skipping any files that already exist in the output directory:
svg2ember --out-dir components/icons --ignore-existing icons/
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
