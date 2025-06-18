# svg2ember

This package combines the core, CLI, and Vite functionalities for `svg2ember`.

## Features

- Core transformation logic for converting SVG files to Ember components.
- Command-line interface for batch processing of SVGs.
- Vite plugin for seamless integration with Vite-based Ember projects.

## Installation

To use `svg2ember` in your project (for example, if you want to use its Vite plugin or programmatically access its core functions):

```bash
pnpm add --save-dev svg2ember
# or
npm install --save-dev svg2ember
# or
yarn add --dev svg2ember
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
svg2ember --typescript input.svg output.gts
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

## Contributing

(Details to be added)

## License

MIT
