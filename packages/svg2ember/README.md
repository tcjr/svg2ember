# svg2ember

This package contains the core, CLI, and Vite functionalities for `svg2ember`.

## Features

- Core transformation logic for converting SVG files to Ember components.
- Command-line interface for batch processing of SVGs.
- Vite plugin for build-time integration with Vite-based Ember projects.

## Installation

To use `svg2ember` in your project (for example, if you want to use its Vite plugin or programmatically access its core functions):

```bash
pnpm add --save-dev svg2ember
# or
npm install --save-dev svg2ember
```

If you want to use the CLI tool globally:

```bash
pnpm add --global svg2ember
# or
npm install --global svg2ember
```

## Usage

### Command Line Interface

Once installed globally, you can use the `svg2ember` command:

```bash
svg2ember input.svg output.gjs

# Create TypeScript component
svg2ember --typescript input.svg output.gts

# Process all SVGs in the 'icons/' directory and output them to 'components/icons'
svg2ember --out-dir components/icons icons/
```

You can also run it without global installation using `pnpx`:

```bash
pnpx svg2ember input.svg output.gjs
```

For more CLI options, run:

```bash
svg2ember --help
# or
pnpx svg2ember --help
```

### Vite Plugin

Configure the Vite plugin to enable SVG component imports:

```js
// vite.config.js
import svg2ember from "svg2ember/vite";

export default {
  plugins: [
    svg2ember(),
    // other Ember plugins...
  ],
};
```

Then use in Ember components:

```gjs
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

The component also works using block syntax and allows arbitrary SVG elements as children as long as they are valid children of the `<svg>` element. The `{{yield}}` is at the bottom, so the children will be placed below any other content in the SVG. (Keep in mind the coordinate space is determined by the `viewBox`.)

```gjs
import Butterfly from '../icons/butterfly.svg?component';

<template>
  <Butterfly class='h-6 w-6'>
    {{! fade the icon in and out using SVG animate }}
    <animate
      attributeName="opacity"
      values="0;1;0"
      dur="500ms"
      repeatCount="indefinite"
    />
  </Butterfly>
</template>
```

## Contributing

Issues and PRs always welcome.

## License

MIT
