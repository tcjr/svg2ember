import fs from 'fs/promises';
import type { Plugin } from 'vite';
import { transform } from '@svg2ember/core';
import type { PluginOptions } from './types.js';

// A unique suffix to identify modules transformed by this plugin in the `load` hook.
const VIRTUAL_GJS_SUFFIX = '.gjs?svg2ember_component';

export default function svg2ember(
  options: PluginOptions = { optimize: true, typescript: false },
): Plugin {
  return {
    name: 'vite-plugin-svg2ember',
    enforce: 'pre',

    async resolveId(source, importer, { isEntry }) {
      if (source.endsWith('.svg?component')) {
        // Remove the `?component` query to get the actual .svg file path specifier
        const actualSvgPathSpecifier = source.slice(0, -'?component'.length);
        // Resolve the .svg file to its absolute path
        const resolved = await this.resolve(actualSvgPathSpecifier, importer, {
          skipSelf: true,
        });

        if (resolved && !resolved.external) {
          // Return a new ID that ends with '.gjs' plus our virtual suffix.
          // This new ID will be passed to `load` and to subsequent plugins.
          // The '.gjs' part ensures other GJS processors can pick it up.
          return resolved.id + VIRTUAL_GJS_SUFFIX;
        }
      }
      return null; // Let other plugins or Vite's default resolver handle it
    },

    async load(id) {
      if (id.endsWith(VIRTUAL_GJS_SUFFIX)) {
        // This ID was created by our `resolveId` hook.
        // Extract the original .svg file path by removing the virtual suffix and the added '.gjs'.
        const originalSvgPath = id.slice(
          0,
          -(VIRTUAL_GJS_SUFFIX.length - '.gjs'.length) - '.gjs'.length,
        );

        try {
          const textContent = await fs.readFile(originalSvgPath, 'utf-8');
          const componentCode = makeComponentFromText(
            textContent.trim(),
            options,
          );
          return {
            code: componentCode,
            map: null, // No sourcemap for this simple transformation
          };
        } catch (e: any) {
          this.error(
            `Failed to load or transform ${originalSvgPath}: ${e.message}`,
          );
          return null;
        }
      }
      return null; // Let other plugins or Vite's default loader handle it
    },
  };
}

function makeComponentFromText(svgContent: string, options: PluginOptions) {
  const result = transform(svgContent, options);
  return result.code;
}
