# @svg2ember/core

Core transformation library for converting SVG files to Ember template-only components.

## Installation

```bash
npm install @svg2ember/core
# or
pnpm add @svg2ember/core
# or
yarn add @svg2ember/core
```

## Usage

### Basic Transformation

```js
import { transform } from "@svg2ember/core";

const svgContent = `<svg viewBox="0 0 24 24">
  <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11"/>
</svg>`;

const result = transform(svgContent);

console.log(result.code);
// Output: <template><svg viewBox="0 0 24 24" ...attributes><path d="M12 2L2 7v10c0 5.55 3.84 10 9 11"/></svg></template>

console.log(result.extension);
// Output: .gjs
```

### TypeScript Components

```js
const result = transform(svgContent, { typescript: true });

console.log(result.extension);
// Output: .gts
```

### Custom SVGO Configuration

```js
const result = transform(svgContent, {
  optimize: true,
  svgoConfig: {
    plugins: [
      "preset-default",
      {
        name: "removeViewBox",
        active: false,
      },
    ],
  },
});
```

## API Reference

### `transform(svgContent, options?)`

Transforms SVG content into an Ember component.

**Parameters:**

- `svgContent` (string): The SVG markup to transform
- `options` (TransformOptions, optional): Configuration options

**Returns:** `TransformResult`

- `code` (string): The generated Ember component code
- `extension` (string): File extension (`.gjs` or `.gts`)

### `TransformOptions`

| Option       | Type      | Default | Description                                                           |
| ------------ | --------- | ------- | --------------------------------------------------------------------- |
| `typescript` | `boolean` | `false` | Generate TypeScript component (`.gts`) instead of JavaScript (`.gjs`) |
| `optimize`   | `boolean` | `true`  | Enable or disable SVGO optimization.                                  |
| `svgoConfig` | `object`  | `{}`    | Custom SVGO configuration. Used if `optimize` is `true`.              |

## Generated Component Structure

The transformation:

1. **Parses** SVG using `svg-parser` for proper AST handling
2. **Optimizes** SVG content using `svgo` (if enabled)
3. **Generates** Ember template with `...attributes` spread on root `<svg>` element
4. **Preserves** all original SVG attributes and content

### Example Transformation

**Input:**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="12" r="3"/>
  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
</svg>
```

**Output (.gjs):**

```gjs
<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" ...attributes>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
  </svg>
</template>
```

## Attribute Spreading

The generated components include `...attributes` on the root `<svg>` element, allowing you to:

- Override default attributes
- Add custom classes and styles
- Include accessibility attributes
- Pass data attributes

```gjs
{{! Component can receive any SVG attributes }}
<MyIcon class="w-6 h-6 text-blue-500" data-testid="icon" aria-label="Custom icon" />
```

## Error Handling

```js
try {
  const result = transform(invalidSvgContent);
} catch (error) {
  console.error("SVG transformation failed:", error.message);
}
```

The transform function throws descriptive errors for:

- Invalid SVG markup
- Parsing failures
- SVGO optimization errors

## Dependencies

- **svg-parser**: AST-based SVG parsing (no regex/string manipulation)
- **svgo**: SVG optimization and minification

## License

MIT
