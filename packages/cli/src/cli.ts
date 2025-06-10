#!/usr/bin/env node

import { Command } from 'commander';
import { transformFile } from './transform-file.js';
import process from 'node:process';

const program = new Command();

program
  .name('svg2ember-cli')
  .description('Convert SVG files to Ember template-only components')
  .version('0.1.0');

// Single file transformation command
program
  .argument('<input>', 'Input SVG file path')
  .argument('[output]', 'Output component file path (optional)')
  .option('-t, --typescript', 'Generate TypeScript component (.gts)', false)
  .option('--no-optimize', 'Disable SVG optimization', false)
  .action(async (input: string, output: string | undefined, options) => {
    const { typescript } = options;

    console.log(`🔄 Transforming ${input}...`);

    const result = await transformFile({
      inputPath: input,
      outputPath: output,
      typescript,
    });

    if (result.success) {
      console.log(`✅ Successfully created ${result.outputPath}`);
      process.exit(0);
    } else {
      console.error(`❌ Error: ${result.error}`);
      process.exit(1);
    }
  });

// Add help examples
program.addHelpText(
  'after',
  `
Examples:
  $ svg2ember-cli input.svg                    # Creates input.gjs
  $ svg2ember-cli input.svg output.gjs         # Creates output.gjs  
  $ svg2ember-cli --typescript input.svg       # Creates input.gts
  $ svg2ember-cli -t input.svg output.gts      # Creates output.gts
`,
);

program.parse();
