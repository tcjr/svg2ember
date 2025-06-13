import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'fs';
import { svg2ember } from '../index.js';
import type { PluginOptions } from '../types.js';
import type { PluginContext } from 'rollup';

// Mock the file system for predictable testing
vi.mock('fs');
const mockedReadFileSync = vi.mocked(readFileSync);

const mockSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="3"/>
  <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
</svg>`;

describe('svg2ember vite plugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedReadFileSync.mockReturnValue(mockSvgContent);
  });

  it('should create plugin with correct name', () => {
    const plugin = svg2ember();
    expect(plugin.name).toBe('svg2ember');
  });

  it('should have resolveId and load hooks', () => {
    const plugin = svg2ember();
    expect(plugin.resolveId).toBeDefined();
    expect(plugin.load).toBeDefined();
  });

  describe('resolveId hook', () => {
    it('should resolve SVG files with ?component query', () => {
      const plugin = svg2ember();
      const mockContext = {} as PluginContext;
      const result = plugin.resolveId?.call(mockContext, 'icon.svg?component', undefined);
      expect(result).toBe('icon.svg?component');
    });

    it('should not resolve regular SVG files', () => {
      const plugin = svg2ember();
      const mockContext = {} as PluginContext;
      const result = plugin.resolveId?.call(mockContext, 'icon.svg', undefined);
      expect(result).toBeNull();
    });

    it('should not resolve non-SVG files with query', () => {
      const plugin = svg2ember();
      const mockContext = {} as PluginContext;
      const result = plugin.resolveId?.call(mockContext, 'icon.png?component', undefined);
      expect(result).toBeNull();
    });
  });

  describe('load hook', () => {
    it('should transform SVG with ?component query', () => {
      const plugin = svg2ember();
      const mockContext = {} as PluginContext;
      const result = plugin.load?.call(mockContext, 'icon.svg?component');
      
      expect(mockedReadFileSync).toHaveBeenCalledWith('icon.svg', 'utf-8');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result).toContain('<template>');
      expect(result).toContain('...attributes');
    });

    it('should not transform regular SVG files', () => {
      const plugin = svg2ember();
      const mockContext = {} as PluginContext;
      const result = plugin.load?.call(mockContext, 'icon.svg');
      
      expect(result).toBeNull();
      expect(mockedReadFileSync).not.toHaveBeenCalled();
    });

    it('should transform with TypeScript option', () => {
      const options: PluginOptions = { typescript: true };
      const plugin = svg2ember(options);
      const mockContext = {} as PluginContext;
      const result = plugin.load?.call(mockContext, 'icon.svg?component');
      
      expect(result).toBeTruthy();
      expect(result).toContain('import type { TOC }');
      expect(result).toContain('interface Signature');
      expect(result).toContain('TOC<Signature>');
    });

    it('should handle file read errors', () => {
      const mockError = vi.fn();
      const mockThis = { error: mockError };
      
      mockedReadFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });
      
      const plugin = svg2ember();
      const mockContext = mockThis as unknown as PluginContext;
      plugin.load?.call(mockContext, 'icon.svg?component');
      
      expect(mockError).toHaveBeenCalledWith('Failed to transform SVG: File not found');
    });

    it('should handle transform errors', () => {
      const mockError = vi.fn();
      const mockThis = { error: mockError };
      
      mockedReadFileSync.mockReturnValue('invalid svg content');
      
      const plugin = svg2ember();
      const mockContext = mockThis as unknown as PluginContext;
      plugin.load?.call(mockContext, 'icon.svg?component');
      
      expect(mockError).toHaveBeenCalledWith(expect.stringContaining('Failed to transform SVG:'));
    });
  });

  describe('plugin options', () => {
    it('should pass options to transform function', () => {
      const options: PluginOptions = {
        typescript: true,
        optimize: false,
        svgoConfig: { multipass: false }
      };
      
      const plugin = svg2ember(options);
      const mockContext = {} as PluginContext;
      const result = plugin.load?.call(mockContext, 'icon.svg?component');
      
      expect(result).toBeTruthy();
      expect(result).toContain('import type { TOC }');
    });

    it('should work with default options', () => {
      const plugin = svg2ember();
      const mockContext = {} as PluginContext;
      const result = plugin.load?.call(mockContext, 'icon.svg?component');
      
      expect(result).toBeTruthy();
      expect(result).toContain('<template>');
      expect(result).not.toContain('import type { TOC }');
    });
  });
});