import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdir, writeFile, rm, readFile, readdir } from 'fs/promises';
import { join } from 'path';
import { transformDirectory } from '../transform-directory.js';
import { tmpdir } from 'os';

describe('transformDirectory', () => {
  let testDir: string;

  beforeEach(async () => {
    // Create a temporary directory for each test
    testDir = join(
      tmpdir(),
      `svg2ember-dir-test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    );
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up test directory
    await rm(testDir, { recursive: true, force: true });
  });

  const sampleSvg1 = `<svg width="24" height="24" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="10"/>
</svg>`;

  const sampleSvg2 = `<svg width="32" height="32" viewBox="0 0 32 32">
  <rect x="8" y="8" width="16" height="16"/>
</svg>`;

  it('should process all SVG files in a directory', async () => {
    // Setup test files
    const inputDir = join(testDir, 'input');
    await mkdir(inputDir);
    await writeFile(join(inputDir, 'icon1.svg'), sampleSvg1);
    await writeFile(join(inputDir, 'icon2.svg'), sampleSvg2);

    const result = await transformDirectory({
      inputDir,
    });

    expect(result.success).toBe(true);
    expect(result.totalFiles).toBe(2);
    expect(result.processedFiles).toBe(2);
    expect(result.skippedFiles).toBe(0);
    expect(result.errors).toHaveLength(0);

    // Check output files exist and have correct content
    const icon1Content = await readFile(join(inputDir, 'icon1.gjs'), 'utf-8');
    const icon2Content = await readFile(join(inputDir, 'icon2.gjs'), 'utf-8');

    expect(icon1Content).toContain('<template>');
    expect(icon1Content).toContain('<circle');
    expect(icon1Content).toContain('...attributes');

    expect(icon2Content).toContain('<template>');
    expect(icon2Content).toContain('<path');
    expect(icon2Content).toContain('...attributes');
  });

  it('should process SVG files to TypeScript components when typescript flag is true', async () => {
    const inputDir = join(testDir, 'input');
    await mkdir(inputDir);
    await writeFile(join(inputDir, 'icon.svg'), sampleSvg1);

    const result = await transformDirectory({
      inputDir,
      typescript: true,
    });

    expect(result.success).toBe(true);
    expect(result.processedFiles).toBe(1);

    const iconContent = await readFile(join(inputDir, 'icon.gts'), 'utf-8');
    expect(iconContent).toContain('import type { TOC }');
    expect(iconContent).toContain('interface Signature');
  });

  it('should output to specified output directory', async () => {
    const inputDir = join(testDir, 'input');
    const outputDir = join(testDir, 'output');

    await mkdir(inputDir);
    await writeFile(join(inputDir, 'icon.svg'), sampleSvg1);

    const result = await transformDirectory({
      inputDir,
      outDir: outputDir,
    });

    expect(result.success).toBe(true);
    expect(result.processedFiles).toBe(1);

    // Check output is in the correct directory
    const iconContent = await readFile(join(outputDir, 'icon.gjs'), 'utf-8');
    expect(iconContent).toContain('<template>');
  });

  it('should preserve directory structure when using output directory', async () => {
    const inputDir = join(testDir, 'input');
    const outputDir = join(testDir, 'output');

    // Create nested directory structure
    await mkdir(join(inputDir, 'subdir'), { recursive: true });
    await writeFile(join(inputDir, 'icon1.svg'), sampleSvg1);
    await writeFile(join(inputDir, 'subdir', 'icon2.svg'), sampleSvg2);

    const result = await transformDirectory({
      inputDir,
      outDir: outputDir,
    });

    expect(result.success).toBe(true);
    expect(result.processedFiles).toBe(2);

    // Check files exist in correct structure
    const icon1Content = await readFile(join(outputDir, 'icon1.gjs'), 'utf-8');
    const icon2Content = await readFile(
      join(outputDir, 'subdir', 'icon2.gjs'),
      'utf-8',
    );

    expect(icon1Content).toContain('<template>');
    expect(icon2Content).toContain('<template>');
  });

  it('should skip existing files when ignoreExisting is true', async () => {
    const inputDir = join(testDir, 'input');
    await mkdir(inputDir);
    await writeFile(join(inputDir, 'icon1.svg'), sampleSvg1);
    await writeFile(join(inputDir, 'icon2.svg'), sampleSvg2);

    // Pre-create one output file
    await writeFile(join(inputDir, 'icon1.gjs'), 'existing content');

    const result = await transformDirectory({
      inputDir,
      ignoreExisting: true,
    });

    expect(result.success).toBe(true);
    expect(result.totalFiles).toBe(2);
    expect(result.processedFiles).toBe(1); // Only icon2 processed
    expect(result.skippedFiles).toBe(1); // icon1 skipped

    // Check that existing file wasn't overwritten
    const icon1Content = await readFile(join(inputDir, 'icon1.gjs'), 'utf-8');
    expect(icon1Content).toBe('existing content');

    // Check that new file was created
    const icon2Content = await readFile(join(inputDir, 'icon2.gjs'), 'utf-8');
    expect(icon2Content).toContain('<template>');
  });

  it('should handle empty directories gracefully', async () => {
    const inputDir = join(testDir, 'empty');
    await mkdir(inputDir);

    const result = await transformDirectory({
      inputDir,
    });

    expect(result.success).toBe(true);
    expect(result.totalFiles).toBe(0);
    expect(result.processedFiles).toBe(0);
    expect(result.errors).toHaveLength(0);
  });

  it('should handle directories with non-SVG files', async () => {
    const inputDir = join(testDir, 'mixed');
    await mkdir(inputDir);
    await writeFile(join(inputDir, 'icon.svg'), sampleSvg1);
    await writeFile(join(inputDir, 'readme.txt'), 'This is a readme');
    await writeFile(join(inputDir, 'image.png'), 'fake png data');

    const result = await transformDirectory({
      inputDir,
    });

    expect(result.success).toBe(true);
    expect(result.totalFiles).toBe(1); // Only SVG file counted
    expect(result.processedFiles).toBe(1);

    // Check only the SVG was processed
    const files = await readdir(inputDir);
    expect(files).toContain('icon.gjs');
    expect(files).toContain('readme.txt');
    expect(files).toContain('image.png');
  });

  it('should return error for non-existent directory', async () => {
    const nonExistentDir = join(testDir, 'does-not-exist');

    const result = await transformDirectory({
      inputDir: nonExistentDir,
    });

    expect(result.success).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].error).toContain('Input directory does not exist');
  });

  it('should return error when input path is a file not a directory', async () => {
    const filePath = join(testDir, 'not-a-directory.txt');
    await writeFile(filePath, 'This is a file');

    const result = await transformDirectory({
      inputDir: filePath,
    });

    expect(result.success).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].error).toContain('Input path is not a directory');
  });

  it('should handle invalid SVG files gracefully', async () => {
    const inputDir = join(testDir, 'invalid');
    await mkdir(inputDir);
    await writeFile(join(inputDir, 'valid.svg'), sampleSvg1);
    await writeFile(join(inputDir, 'invalid.svg'), 'This is not valid SVG');

    const result = await transformDirectory({
      inputDir,
    });

    expect(result.success).toBe(false); // Should fail due to invalid SVG
    expect(result.totalFiles).toBe(2);
    expect(result.processedFiles).toBe(1); // Only valid SVG processed
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].file).toContain('invalid.svg');

    // Check that valid file was still processed
    const validContent = await readFile(join(inputDir, 'valid.gjs'), 'utf-8');
    expect(validContent).toContain('<template>');
  });

  it('should handle deeply nested directory structures', async () => {
    const inputDir = join(testDir, 'deep');
    const deepPath = join(inputDir, 'level1', 'level2', 'level3');

    await mkdir(deepPath, { recursive: true });
    await writeFile(join(inputDir, 'root.svg'), sampleSvg1);
    await writeFile(join(deepPath, 'deep.svg'), sampleSvg2);

    const result = await transformDirectory({
      inputDir,
    });

    expect(result.success).toBe(true);
    expect(result.totalFiles).toBe(2);
    expect(result.processedFiles).toBe(2);

    // Check both files were processed
    const rootContent = await readFile(join(inputDir, 'root.gjs'), 'utf-8');
    const deepContent = await readFile(join(deepPath, 'deep.gjs'), 'utf-8');

    expect(rootContent).toContain('<template>');
    expect(deepContent).toContain('<template>');
  });
});
