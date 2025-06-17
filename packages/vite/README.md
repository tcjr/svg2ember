# @svg2ember/vite

A Vite plugin for converting SVG imports to Ember template-only components during development and build.

## Installation

```bash
npm install @svg2ember/vite
# or
pnpm add @svg2ember/vite
# or
yarn add @svg2ember/vite
```

## Usage

### Configure Vite Plugin

Add the plugin to your `vite.config.js` or `vite.config.mjs`:

```js
import { defineConfig } from "vite";
import svg2ember from "@svg2ember/vite";

export default defineConfig({
  plugins: [
    svg2ember({
      // Optional configuration
      typescript: false, // Set to true for .gts components
      optimize: true, // Enable SVGO optimization
    }),
    // ... other plugins
  ],
});
```

### Import SVG as Component

Use the `?component` query parameter to import SVG files as Ember components:

```gts
// Import as component
import MyIcon from './assets/my-icon.svg?component';

// Import as URL (standard Vite behavior)
import myIconUrl from './assets/my-icon.svg';

<template>
  {{! Use as component with attribute spreading }}
  <MyIcon class="w-6 h-6 text-blue-500" data-testid="my-icon" />

  {{! Traditional img tag }}
  <img src={{myIconUrl}} alt="My Icon" />
</template>
```

## Configuration Options

The plugin accepts the same options as `@svg2ember/core`:

| Option       | Type      | Default | Description                                                            |
| ------------ | --------- | ------- | ---------------------------------------------------------------------- |
| `typescript` | `boolean` | `false` | Generate `.gts` (TypeScript) instead of `.gjs` (JavaScript) components |
| `optimize`   | `boolean` | `true`  | Enable SVGO optimization                                               |
| `svgoConfig` | `object`  | `{}`    | Pass SVGO config object                                                |

### TypeScript Configuration

When using TypeScript, add this to your type definitions to enable proper import types:

```ts
declare module "*.svg?component" {
  import type { TOC } from "@ember/component/template-only";

  interface SvgSignature {
    Element: SVGSVGElement;
    Blocks: {
      default?: [];
    };
  }

  const convertedSvgComponent: TOC<SvgSignature>;
  export default convertedSvgComponent;
}
```

## How It Works

1. **Resolution**: When you import an SVG file with `?component`, the plugin intercepts the import
2. **Transformation**: The SVG is processed using `@svg2ember/core` to generate an Ember component
3. **Virtual Module**: The generated component code is returned as a virtual module
4. **Attribute Spreading**: The root `<svg>` element receives `...attributes` for full customization

## Generated Component Structure

Input SVG:

```svg
<svg viewBox="0 0 24 24" fill="none">
  <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11"/>
</svg>
```

Generated Ember Component (`.gjs`):

```gjs
<template>
  <svg viewBox="0 0 24 24" fill="none" ...attributes>
    <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11" />
  </svg>
</template>
```

## Integration with Ember

The plugin works seamlessly with:

- **Embroider** + Vite setups
- **Modern Ember** applications using `<template>` syntax
- **Template-only components** and the `...attributes` spread
- **TypeScript** and **JavaScript** codebases

## Examples

### Basic Usage

```gts
import CheckIcon from './icons/check.svg?component';

<template>
  <CheckIcon class="text-green-500 w-4 h-4" />
</template>
```

### With Custom Attributes

```gts
import StarIcon from './icons/star.svg?component';

<template>
  <StarIcon
    class="text-yellow-400 w-8 h-8"
    data-rating="5"
    aria-label="5 star rating"
  />
</template>
```

### Multiple Instances with Different Styling

```gts
import HeartIcon from './icons/heart.svg?component';

<template>
  <div class="flex gap-2">
    <HeartIcon class="text-red-500 w-6 h-6" />
    <HeartIcon class="text-pink-300 w-4 h-4" />
    <HeartIcon class="text-gray-400 w-8 h-8" />
  </div>
</template>
```

## License

MIT
