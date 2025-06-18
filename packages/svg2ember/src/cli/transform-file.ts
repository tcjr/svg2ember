import { readFile, writeFile } from 'fs/promises';
import { dirname, resolve, extname, basename } from 'path';
import { mkdir } from 'fs/promises';
import { transform } from '../core/index.js';
import type { TransformFileOptions, TransformResult } from './types.js';

export async function transformFile(
  options: TransformFileOptions,
): Promise<TransformResult> {
  const {
    inputPath,
    outputPath,
    typescript = false,
    optimize = true, // Default to true if not provided
  } = options;

  try {
    // Validate input file
    const resolvedInputPath = resolve(inputPath);

    if (extname(resolvedInputPath).toLowerCase() !== '.svg') {
      throw new Error('Input file must have .svg extension');
    }

    // Read SVG content
    const svgContent = await readFile(resolvedInputPath, 'utf-8');

    // Transform using core package
    const result = transform(svgContent, { typescript, optimize });

    // Determine output path
    let resolvedOutputPath: string;
    if (outputPath) {
      resolvedOutputPath = resolve(outputPath);
    } else {
      // Generate output path based on input path and typescript flag
      const inputBasename = basename(resolvedInputPath, '.svg');
      const outputExtension = typescript ? '.gts' : '.gjs';
      resolvedOutputPath = resolve(
        dirname(resolvedInputPath),
        `${inputBasename}${outputExtension}`,
      );
    }

    // Ensure output directory exists
    const outputDir = dirname(resolvedOutputPath);
    await mkdir(outputDir, { recursive: true });

    // Write the component file
    await writeFile(resolvedOutputPath, result.code, 'utf-8');

    return {
      success: true,
      inputPath: resolvedInputPath,
      outputPath: resolvedOutputPath,
    };
  } catch (error) {
    return {
      success: false,
      inputPath: resolve(inputPath),
      outputPath: outputPath ? resolve(outputPath) : '',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
