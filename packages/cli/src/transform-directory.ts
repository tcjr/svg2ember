import { glob } from 'glob';
import { stat, access } from 'fs/promises';
import { join, resolve, relative, dirname, basename } from 'path';
import process from 'node:process';
import { transformFile } from './transform-file.js';

export interface DirectoryTransformOptions {
  inputDir: string;
  outDir?: string;
  typescript?: boolean;
  ignoreExisting?: boolean;
  optimize?: boolean;
}

export interface DirectoryTransformResult {
  success: boolean;
  totalFiles: number;
  processedFiles: number;
  skippedFiles: number;
  errors: Array<{ file: string; error: string }>;
  results: Array<{ inputPath: string; outputPath: string; skipped?: boolean }>;
}

export async function transformDirectory(
  options: DirectoryTransformOptions,
): Promise<DirectoryTransformResult> {
  const {
    inputDir,
    outDir,
    typescript = false,
    ignoreExisting = false,
    optimize = true, // Default to true if not provided
  } = options;

  const result: DirectoryTransformResult = {
    success: true,
    totalFiles: 0,
    processedFiles: 0,
    skippedFiles: 0,
    errors: [],
    results: [],
  };

  try {
    // Validate input directory
    const resolvedInputDir = resolve(inputDir);

    try {
      const inputStat = await stat(resolvedInputDir);
      if (!inputStat.isDirectory()) {
        throw new Error(`Input path is not a directory: ${inputDir}`);
      }
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'ENOENT'
      ) {
        throw new Error(`Input directory does not exist: ${inputDir}`);
      }
      throw new Error(`Input path is not a directory: ${inputDir}`);
    }

    // Find all SVG files in the directory
    const svgPattern = join(resolvedInputDir, '**/*.svg');
    const svgFiles = await glob(svgPattern, {
      absolute: true,
      nodir: true,
    });

    result.totalFiles = svgFiles.length;

    if (svgFiles.length === 0) {
      console.log(`⚠️  No SVG files found in ${inputDir}`);
      return result;
    }

    console.log(
      `📁 Found ${svgFiles.length} SVG file${svgFiles.length === 1 ? '' : 's'} in ${inputDir}`,
    );

    // Process each SVG file
    for (const svgFile of svgFiles) {
      try {
        // Determine output path
        let outputPath: string;

        if (outDir) {
          // Use output directory structure
          const relativePath = relative(resolvedInputDir, svgFile);
          const svgBasename = basename(relativePath, '.svg');
          const svgDirname = dirname(relativePath);
          const extension = typescript ? '.gts' : '.gjs';

          outputPath = resolve(
            outDir,
            svgDirname,
            `${svgBasename}${extension}`,
          );
        } else {
          // Output in same directory as input
          const svgBasename = basename(svgFile, '.svg');
          const extension = typescript ? '.gts' : '.gjs';
          outputPath = resolve(dirname(svgFile), `${svgBasename}${extension}`);
        }

        // Check if output file already exists and should be skipped
        if (ignoreExisting) {
          try {
            await access(outputPath);
            console.log(
              `⏭️  Skipping existing file: ${relative(process.cwd(), outputPath)}`,
            );
            result.skippedFiles++;
            result.results.push({
              inputPath: svgFile,
              outputPath,
              skipped: true,
            });
            continue;
          } catch {
            // File doesn't exist, continue with processing
          }
        }

        // Transform the file
        const transformResult = await transformFile({
          inputPath: svgFile,
          outputPath,
          typescript,
          optimize,
        });

        if (transformResult.success) {
          console.log(
            `✅ ${relative(process.cwd(), svgFile)} → ${relative(process.cwd(), outputPath)}`,
          );
          result.processedFiles++;
          result.results.push({
            inputPath: svgFile,
            outputPath,
          });
        } else {
          console.error(
            `❌ Error processing ${relative(process.cwd(), svgFile)}: ${transformResult.error}`,
          );
          result.errors.push({
            file: svgFile,
            error: transformResult.error || 'Unknown error',
          });
          result.success = false;
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        console.error(
          `❌ Error processing ${relative(process.cwd(), svgFile)}: ${errorMessage}`,
        );
        result.errors.push({
          file: svgFile,
          error: errorMessage,
        });
        result.success = false;
      }
    }

    // Summary
    console.log(`\n📊 Summary:`);
    console.log(`   Total files: ${result.totalFiles}`);
    console.log(`   Processed: ${result.processedFiles}`);
    if (result.skippedFiles > 0) {
      console.log(`   Skipped: ${result.skippedFiles}`);
    }
    if (result.errors.length > 0) {
      console.log(`   Errors: ${result.errors.length}`);
    }

    return result;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    result.success = false;
    result.errors.push({
      file: inputDir,
      error: errorMessage,
    });
    return result;
  }
}
