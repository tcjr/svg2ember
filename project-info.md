The svg2ember tool is a custom solution for converting SVG files to Ember template-only components. It provides both a CLI tool and Vite plugin for seamless development workflow.

Architecturally, I'd like to use a system similar to SVGR for React, but it does not need to be as comprehensive and flexible initially. Specifically, follow these guidelines:

- use TypeScript
- use `svg-parser` package
- use `svgo` to optimize the svg before creating component
- `<svg>` tag will be the element that gets the `...attributes`

Use cases should be:

- command-line
- Vite plugin

### Command Line

The command line interface can be used to create Ember components from SVG files. The converted files should have the gjs or gts extension based on a `--typescript` flag

Usage should be something like this:

To transform a single file:

```
pnpx @svg2ember/cli input/butterfly.svg output/butterfly.gjs
# or
pnpx @svg2ember/cli --typescript input/butterfly.svg output/butterfly.gts
```

To transform all the SVG files in a directory usage:

```
pnpx @svg2ember/cli [--out-dir dir] [--ignore-existing] [src-dir]
```

### Vite/Rollup plugin

The Vite plugin should work for SVG imports that have `?component`.

For example, in an Ember gts file, this should work:

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

The `class` and `data-my-icon` attributes should be on the resulting svg element in the dom. The import without the `?component` designator should use the default behavior.
