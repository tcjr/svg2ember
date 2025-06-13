import { readFileSync } from 'fs';
import { transform } from '@svg2ember/core';
import type { Plugin } from 'vite';
import type { PluginOptions } from './types.js';

export type { PluginOptions };

const QUERY_COMPONENT = '?component';

export function svg2ember(options: PluginOptions = {}): Plugin {
  return {
    name: 'svg2ember',
    
    resolveId(id: string) {
      // Handle SVG imports with ?component query parameter
      if (id.endsWith('.svg' + QUERY_COMPONENT)) {
        return id;
      }
      return null;
    },
    
    load(id: string) {
      // Transform SVG files with ?component query
      if (id.endsWith('.svg' + QUERY_COMPONENT)) {
        const svgPath = id.replace(QUERY_COMPONENT, '');
        
        try {
          const svgContent = readFileSync(svgPath, 'utf-8');
          const result = transform(svgContent, options);
          return result.code;
        } catch (error) {
          this.error(`Failed to transform SVG: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      
      return null;
    }
  };
}