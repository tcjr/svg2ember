import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Plugin } from 'vite';
import svg2ember from '../index.js';
import fs from 'fs/promises';

// Mock fs module
vi.mock('fs/promises');
const mockFs = vi.mocked(fs);

// Test SVG content
const testSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="3"/>
  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
</svg>`;

describe('svg2ember vite plugin', () => {
  let plugin: Plugin;
  let mockResolve: ReturnType<typeof vi.fn>;
  let mockError: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockResolve = vi.fn();
    mockError = vi.fn();

    // Reset plugin for each test
    plugin = svg2ember();
  });

  describe('plugin configuration', () => {
    it('should have correct plugin name', () => {
      expect(plugin.name).toBe('vite-plugin-svg2ember');
    });

    it('should enforce pre processing', () => {
      expect(plugin.enforce).toBe('pre');
    });

    it('should use default options when none provided', () => {
      const pluginWithDefaults = svg2ember();
      expect(pluginWithDefaults.name).toBe('vite-plugin-svg2ember');
    });

    it('should respect typescript option', () => {
      const jsPlugin = svg2ember({ typescript: false });
      const tsPlugin = svg2ember({ typescript: true });

      expect(jsPlugin.name).toBe('vite-plugin-svg2ember');
      expect(tsPlugin.name).toBe('vite-plugin-svg2ember');
    });
  });

  describe('resolveId', () => {
    beforeEach(() => {
      mockResolve.mockResolvedValue({
        id: '/absolute/path/to/icon.svg',
        external: false,
      });
    });

    it('should resolve SVG files with ?component query', async () => {
      const result = await plugin.resolveId!(
        'icon.svg?component',
        '/some/importer.js',
      );

      expect(mockResolve).toHaveBeenCalledWith(
        'icon.svg',
        '/some/importer.js',
        {
          skipSelf: true,
        },
      );
      expect(result).toBe('/absolute/path/to/icon.svg.gjs?svg2ember_component');
    });

    it('should resolve with .gts extension when typescript is true', async () => {
      plugin = svg2ember({ typescript: true });
      plugin.resolveId = plugin.resolveId!.bind({
        resolve: mockResolve,
        error: mockError,
      });

      const result = await plugin.resolveId!(
        'icon.svg?component',
        '/some/importer.js',
      );

      expect(result).toBe('/absolute/path/to/icon.svg.gts?svg2ember_component');
    });

    it('should return null for non-component SVG imports', async () => {
      const result = await plugin.resolveId!('icon.svg', '/some/importer.js');

      expect(result).toBeNull();
      expect(mockResolve).not.toHaveBeenCalled();
    });

    it('should return null for non-SVG files with ?component', async () => {
      const result = await plugin.resolveId!(
        'icon.png?component',
        '/some/importer.js',
      );

      expect(result).toBeNull();
    });

    it('should return null when SVG resolution fails', async () => {
      mockResolve.mockResolvedValue(null);

      const result = await plugin.resolveId!(
        'icon.svg?component',
        '/some/importer.js',
      );

      expect(result).toBeNull();
    });

    it('should return null for external SVG files', async () => {
      mockResolve.mockResolvedValue({
        id: '/absolute/path/to/icon.svg',
        external: true,
      });

      const result = await plugin.resolveId!(
        'icon.svg?component',
        '/some/importer.js',
      );

      expect(result).toBeNull();
    });
  });

  describe('load', () => {
    beforeEach(() => {
      mockFs.readFile.mockResolvedValue(testSvg);
    });

    it('should load and transform SVG files with component query', async () => {
      const result = await plugin.load!(
        '/absolute/path/to/icon.svg.gjs?svg2ember_component',
      );

      expect(mockFs.readFile).toHaveBeenCalledWith(
        '/absolute/path/to/icon.svg',
        'utf-8',
      );
      expect(result).toEqual({
        code: expect.stringContaining('<template>'),
        map: null,
      });
      expect(result!.code).toContain('...attributes');
    });

    it('should load and transform for TypeScript when using .gts extension', async () => {
      plugin = svg2ember({ typescript: true });
      plugin.load = plugin.load!.bind({
        resolve: mockResolve,
        error: mockError,
      });

      const result = await plugin.load!(
        '/absolute/path/to/icon.svg.gts?svg2ember_component',
      );

      expect(mockFs.readFile).toHaveBeenCalledWith(
        '/absolute/path/to/icon.svg',
        'utf-8',
      );
      expect(result).toEqual({
        code: expect.stringContaining('<template>'),
        map: null,
      });
      expect(result!.code).toContain('...attributes');
    });

    it('should return null for non-component files', async () => {
      const result = await plugin.load!('/absolute/path/to/icon.svg');

      expect(result).toBeNull();
      expect(mockFs.readFile).not.toHaveBeenCalled();
    });

    it('should handle file read errors', async () => {
      const error = new Error('File not found');
      mockFs.readFile.mockRejectedValue(error);

      const result = await plugin.load!(
        '/absolute/path/to/icon.svg.gjs?svg2ember_component',
      );

      expect(mockError).toHaveBeenCalledWith(
        'Failed to load or transform /absolute/path/to/icon.svg: File not found',
      );
      expect(result).toBeNull();
    });

    it('should trim whitespace from SVG content', async () => {
      const svgWithWhitespace = `  ${testSvg}  \n`;
      mockFs.readFile.mockResolvedValue(svgWithWhitespace);

      const result = await plugin.load!(
        '/absolute/path/to/icon.svg.gjs?svg2ember_component',
      );

      expect(result).toEqual({
        code: expect.stringContaining('<template>'),
        map: null,
      });
    });
  });

  describe('end-to-end transformation', () => {
    it('should produce valid Ember component code', async () => {
      mockResolve.mockResolvedValue({
        id: '/test/icon.svg',
        external: false,
      });
      mockFs.readFile.mockResolvedValue(testSvg);

      // First resolve the ID
      const resolvedId = await plugin.resolveId!(
        'icon.svg?component',
        '/test/importer.js',
      );
      expect(resolvedId).toBe('/test/icon.svg.gjs?svg2ember_component');

      // Then load the transformed content
      const result = await plugin.load!(resolvedId!);

      expect(result).toBeDefined();
      expect(result!.code).toContain('<template>');
      expect(result!.code).toContain('</template>');
      expect(result!.code).toContain('<svg');
      expect(result!.code).toContain('...attributes');
      expect(result!.code).toContain('circle');
      expect(result!.code).toContain('path');
    });

    it('should handle complex SVG paths and attributes', async () => {
      const complexSvg = `<svg xmlns="http://www.w3.org/2000/svg" 
        width="100" height="100" viewBox="0 0 100 100" 
        fill="red" stroke="blue" stroke-width="2">
        <path d="M10,10 Q50,0 90,10 T90,90 Q50,100 10,90 T10,10" fill="green"/>
        <circle cx="50" cy="50" r="20" opacity="0.5"/>
      </svg>`;

      mockResolve.mockResolvedValue({
        id: '/test/complex.svg',
        external: false,
      });
      mockFs.readFile.mockResolvedValue(complexSvg);

      const resolvedId = await plugin.resolveId!(
        'complex.svg?component',
        '/test/importer.js',
      );
      const result = await plugin.load!(resolvedId!);

      expect(result!.code).toContain('width="100"');
      expect(result!.code).toContain('height="100"');
      expect(result!.code).toContain('viewBox="0 0 100 100"');
      expect(result!.code).toContain('fill="red"');
      expect(result!.code).toContain('...attributes');
    });
  });

  describe('options handling', () => {
    it('should pass optimize option to transform', async () => {
      plugin = svg2ember({ optimize: true });
      plugin.load = plugin.load!.bind({
        resolve: mockResolve,
        error: mockError,
      });

      mockFs.readFile.mockResolvedValue(testSvg);

      const result = await plugin.load!(
        '/test/icon.svg.gjs?svg2ember_component',
      );

      expect(result).toBeDefined();
      expect(result!.code).toContain('<template>');
    });

    it('should pass typescript option correctly', async () => {
      const tsPlugin = svg2ember({ typescript: true });
      tsPlugin.load = tsPlugin.load!.bind({
        resolve: mockResolve,
        error: mockError,
      });

      mockFs.readFile.mockResolvedValue(testSvg);

      const result = await tsPlugin.load!(
        '/test/icon.svg.gts?svg2ember_component',
      );

      expect(result).toBeDefined();
      expect(result!.code).toContain('<template>');
    });
  });
});
