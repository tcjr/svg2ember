# @svg2ember/cli

Command-line interface for converting SVG files to Ember template-only components.

## Installation

### Global Installation

```bash
npm install -g @svg2ember/cli
# or
pnpm add -g @svg2ember/cli
# or
yarn global add @svg2ember/cli
```

### Local Installation

```bash
npm install @svg2ember/cli
# or
pnpm add @svg2ember/cli
# or
yarn add @svg2ember/cli
```

## Usage

### Single File Transformation

```bash
# Basic transformation (generates icon.gjs)
svg2ember-cli icon.svg

# Specify output path
svg2ember-cli icon.svg components/my-icon.gjs

# Generate TypeScript component
svg2ember-cli --typescript icon.svg
# Creates: icon.gts
```

### Directory Batch Processing

```bash
# Process all SVGs in icons/ directory
svg2ember-cli icons/

# Process with custom output directory
svg2ember-cli --out-dir components/icons icons/

# TypeScript components with custom output
svg2ember-cli --typescript --out-dir src/components/icons assets/svg/
```

## Command-Line Options

| Option              | Alias | Description                                                            |
| ------------------- | ----- | ---------------------------------------------------------------------- |
| `--typescript`      | `-t`  | Generate TypeScript components (`.gts`) instead of JavaScript (`.gjs`) |
| `--out-dir <dir>`   | `-o`  | Output directory for batch processing                                  |
| `--ignore-existing` | `-i`  | Skip files that already exist in output location                       |
| `--help`            | `-h`  | Display help information                                               |
| `--version`         | `-V`  | Display version number                                                 |

## Examples

### Single File Examples

```bash
# Transform single SVG to JavaScript component
svg2ember-cli star.svg
# Creates: star.gjs

# Transform with custom output path
svg2ember-cli star.svg components/star-icon.gjs

# Generate TypeScript component
svg2ember-cli --typescript star.svg
# Creates: star.gts

# TypeScript with custom path
svg2ember-cli --typescript star.svg src/components/star-icon.gts
```

### Directory Processing Examples

```bash
# Process all SVGs in current directory
svg2ember-cli .

# Process specific directory
svg2ember-cli assets/icons/

# Custom output directory (maintains structure)
svg2ember-cli --out-dir src/components/icons assets/svg/
# assets/svg/user.svg → src/components/icons/user.gjs
# assets/svg/admin/settings.svg → src/components/icons/admin/settings.gjs

# TypeScript components with output directory
svg2ember-cli --typescript --out-dir components/icons svg/

# Skip existing files
svg2ember-cli --ignore-existing --out-dir components icons/
```

### Advanced Usage

```bash
# Combine all options
svg2ember-cli --typescript --out-dir src/components --ignore-existing assets/icons/

# Short form aliases
svg2ember-cli -t -o components -i icons/
```

## Generated Components

The CLI uses `@svg2ember/core` to generate components with:

- Proper Ember template syntax
- `...attributes` spread on root `<svg>` element
- Optimized SVG content (via SVGO)
- Preserved directory structure for batch processing

### Example Output

**Input: `star.svg`**

```svg
<svg viewBox="0 0 24 24" fill="none">
  <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11"/>
</svg>
```

**Output: `star.gjs`**

```gjs
<template>
  <svg viewBox="0 0 24 24" fill="none" ...attributes>
    <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11" />
  </svg>
</template>
```

## File Handling

### Directory Structure Preservation

When processing directories, the CLI maintains the source directory structure:

```
Input:
icons/
├── social/
│   ├── twitter.svg
│   └── github.svg
└── ui/
    ├── check.svg
    └── close.svg

Output (--out-dir components):
components/
├── social/
│   ├── twitter.gjs
│   └── github.gjs
└── ui/
    ├── check.gjs
    └── close.gjs
```

### Existing File Handling

- By default, existing files are overwritten
- Use `--ignore-existing` to skip files that already exist
- The CLI reports which files were processed, skipped, or failed

### Error Handling

The CLI provides detailed error messages for:

- Invalid SVG files
- Permission errors
- Missing directories
- Transformation failures

## Integration with Build Tools

### NPM Scripts

```json
{
  "scripts": {
    "icons:build": "svg2ember-cli --out-dir src/components/icons assets/svg/",
    "icons:build-ts": "svg2ember-cli --typescript --out-dir src/components/icons assets/svg/"
  }
}
```

### Continuous Integration

```yaml
# .github/workflows/build.yml
- name: Generate Ember components from SVGs
  run: pnpm svg2ember-cli --typescript --out-dir app/components/icons assets/icons/
```

## Exit Codes

- `0`: Success
- `1`: General error (invalid arguments, file errors, etc.)
- `2`: No SVG files found to process

## License

MIT
