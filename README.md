# svg2ember

Convert SVG files to Ember template-only components with CLI and Vite plugin support.

## Overview

svg2ember is a TypeScript-based tool that transforms SVG files into Ember template-only components. It provides both command-line tools and Vite plugin integration for seamless development workflows.

## Features

- ⚡ **SVG optimization** - Integrates svgo for optimized output  
- 💙 **TypeScript support** - Full TypeScript support with `.gts` components
- 🔧 **Attribute spreading** - Generated components have `...attributes` on root `<svg>`
- 🎨 **Composability** - Generated components `{{yield}}` in `<svg>` body to allow children

## See [svg2ember package README](packages/svg2ember/README.md) for installation, usage, and examples.

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

It doesn't really do much, but it works.

## Thanks

Inspired by the great [react-svgr](https://react-svgr.com/) tool for creating React components from SVGs.

## License

MIT
