import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdir, writeFile, rm, readFile } from 'fs/promises';
import { join } from 'path';
import { transformFile } from '../transform-file.js';
import { tmpdir } from 'os';

describe('transformFile', () => {
  let testDir: string;

  beforeEach(async () => {
    // Create a temporary directory for each test
    testDir = join(
      tmpdir(),
      `svg2ember-test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    );
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up test directory
    await rm(testDir, { recursive: true, force: true });
  });

  const sampleSvg = `<svg width="24" height="24" viewBox="0 0 24 24">
  <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.08.2 2.92.2 4 0 5.16-1 9-5.45 9-11V7l-10-5z"/>
</svg>`;

  it('should transform SVG to JavaScript component by default', async () => {
    const inputPath = join(testDir, 'icon.svg');
    const outputPath = join(testDir, 'icon.gjs');

    await writeFile(inputPath, sampleSvg);

    const result = await transformFile({
      inputPath,
      outputPath,
    });

    expect(result.success).toBe(true);
    expect(result.inputPath).toBe(inputPath);
    expect(result.outputPath).toBe(outputPath);

    const generatedContent = await readFile(outputPath, 'utf-8');
    expect(generatedContent).toContain('<template>');
    expect(generatedContent).toContain('<svg');
    expect(generatedContent).toContain('...attributes');
    expect(generatedContent).toContain('</template>');
    expect(generatedContent).not.toContain('import type { TOC }');
  });

  it('should transform SVG to TypeScript component when typescript flag is true', async () => {
    const inputPath = join(testDir, 'icon.svg');
    const outputPath = join(testDir, 'icon.gts');

    await writeFile(inputPath, sampleSvg);

    const result = await transformFile({
      inputPath,
      outputPath,
      typescript: true,
    });

    expect(result.success).toBe(true);
    expect(result.outputPath).toBe(outputPath);

    const generatedContent = await readFile(outputPath, 'utf-8');
    expect(generatedContent).toContain('import type { TOC }');
    expect(generatedContent).toContain('interface Signature');
    expect(generatedContent).toContain('<template>');
    expect(generatedContent).toContain('...attributes');
  });

  it('should auto-generate output path when not provided', async () => {
    const inputPath = join(testDir, 'my-icon.svg');

    await writeFile(inputPath, sampleSvg);

    const result = await transformFile({
      inputPath,
    });

    expect(result.success).toBe(true);
    expect(result.outputPath).toBe(join(testDir, 'my-icon.gjs'));

    const generatedContent = await readFile(result.outputPath, 'utf-8');
    expect(generatedContent).toContain('<template>');
  });

  it('should auto-generate .gts extension when typescript is true and no output path provided', async () => {
    const inputPath = join(testDir, 'my-icon.svg');

    await writeFile(inputPath, sampleSvg);

    const result = await transformFile({
      inputPath,
      typescript: true,
    });

    expect(result.success).toBe(true);
    expect(result.outputPath).toBe(join(testDir, 'my-icon.gts'));
  });

  it('should create output directory if it does not exist', async () => {
    const inputPath = join(testDir, 'icon.svg');
    const outputPath = join(testDir, 'nested', 'deep', 'icon.gjs');

    await writeFile(inputPath, sampleSvg);

    const result = await transformFile({
      inputPath,
      outputPath,
    });

    expect(result.success).toBe(true);
    expect(result.outputPath).toBe(outputPath);

    const generatedContent = await readFile(outputPath, 'utf-8');
    expect(generatedContent).toContain('<template>');
  });

  it('should return error for non-SVG input file', async () => {
    const inputPath = join(testDir, 'not-svg.txt');

    await writeFile(inputPath, 'This is not an SVG');

    const result = await transformFile({
      inputPath,
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Input file must have .svg extension');
  });

  it('should return error for non-existent input file', async () => {
    const inputPath = join(testDir, 'does-not-exist.svg');

    const result = await transformFile({
      inputPath,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should return error for invalid SVG content', async () => {
    const inputPath = join(testDir, 'invalid.svg');

    await writeFile(inputPath, 'This is not valid SVG content');

    const result = await transformFile({
      inputPath,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
