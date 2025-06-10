#!/usr/bin/env node

import { Command } from 'commander';
import { stat } from 'fs/promises';
import { transformFile } from './transform-file.js';
import { transformDirectory } from './transform-directory.js';
import process from 'node:process';

const program = new Command();

program
  .name('svg2ember-cli')
  .description('Convert SVG files to Ember template-only components')
  .version('0.1.0');

// Main command - handles both single files and directories
program
  .argument('<input>', 'Input SVG file or directory path')
  .argument(
    '[output]',
    'Output component file path (optional, for single files only)',
  )
  .option('-t, --typescript', 'Generate TypeScript component (.gts)', false)
  .option('-o, --out-dir <dir>', 'Output directory for batch processing')
  .option(
    '-i, --ignore-existing',
    'Skip files that already exist in output',
    false,
  )
  .option('--no-optimize', 'Disable SVG optimization', false)
  .action(async (input: string, output: string | undefined, options) => {
    const { typescript, outDir, ignoreExisting } = options;

    try {
      const inputStat = await stat(input);

      if (inputStat.isDirectory()) {
        // Directory processing
        if (output) {
          console.error(
            '❌ Error: Output path cannot be specified when processing directories. Use --out-dir instead.',
          );
          process.exit(1);
        }

        console.log(`🔄 Processing directory ${input}...`);

        const result = await transformDirectory({
          inputDir: input,
          outDir,
          typescript,
          ignoreExisting,
        });

        if (result.success && result.errors.length === 0) {
          console.log(
            `\n🎉 Successfully processed ${result.processedFiles} file${result.processedFiles === 1 ? '' : 's'}`,
          );
          process.exit(0);
        } else {
          if (result.errors.length > 0) {
            console.error(
              `\n❌ Completed with ${result.errors.length} error${result.errors.length === 1 ? '' : 's'}`,
            );
          }
          process.exit(1);
        }
      } else {
        // Single file processing
        if (outDir) {
          console.error(
            '❌ Error: --out-dir can only be used with directory processing.',
          );
          process.exit(1);
        }

        if (ignoreExisting) {
          console.error(
            '❌ Error: --ignore-existing can only be used with directory processing.',
          );
          process.exit(1);
        }

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
      }
    } catch (error) {
      console.error(
        `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      process.exit(1);
    }
  });

// Add help examples
program.addHelpText(
  'after',
  `
Examples:
  Single file:
    $ svg2ember-cli input.svg                    # Creates input.gjs
    $ svg2ember-cli input.svg output.gjs         # Creates output.gjs  
    $ svg2ember-cli --typescript input.svg       # Creates input.gts
    $ svg2ember-cli -t input.svg output.gts      # Creates output.gts
  
  Directory processing:
    $ svg2ember-cli icons/                       # Process all SVGs in icons/
    $ svg2ember-cli --out-dir components icons/  # Output to components/
    $ svg2ember-cli -o components -t icons/      # TypeScript output
    $ svg2ember-cli -i -o components icons/      # Skip existing files
`,
);

program.parse();
