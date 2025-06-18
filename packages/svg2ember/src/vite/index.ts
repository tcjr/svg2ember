import fs from 'fs/promises';
import type { Plugin } from 'vite';
import { transform } from '../core/index.js';
import type { PluginOptions } from './types.js';

// A unique suffix to identify modules transformed by this plugin in the `load` hook.
// This will be combined with the dynamic extension (.gjs or .gts)
const COMPONENT_QUERY_PART = '?svg2ember_component';

export default function svg2ember(
  options: PluginOptions = { optimize: true, typescript: false },
): Plugin {
  const fileExtension = options.typescript ? '.gts' : '.gjs';
  const virtualModuleSuffix = fileExtension + COMPONENT_QUERY_PART;

  return {
    name: 'vite-plugin-svg2ember',
    enforce: 'pre',

    async resolveId(source, importer) {
      if (source.endsWith('.svg?component')) {
        // Remove the `?component` query to get the actual .svg file path specifier
        const actualSvgPathSpecifier = source.slice(0, -'?component'.length);
        // Resolve the .svg file to its absolute path
        const resolved = await this.resolve(actualSvgPathSpecifier, importer, {
          skipSelf: true,
        });

        if (resolved && !resolved.external) {
          // Return a new ID that ends with the dynamic extension plus our query part.
          // This new ID will be passed to `load` and to subsequent plugins.
          // The fileExtension part ('.gjs' or '.gts') ensures other processors can pick it up.
          return resolved.id + virtualModuleSuffix;
        }
      }
      return null; // Let other plugins or Vite's default resolver handle it
    },

    async load(id) {
      if (id.endsWith(virtualModuleSuffix)) {
        // This ID was created by our `resolveId` hook.
        // Extract the original .svg file path by removing the virtualModuleSuffix.
        const originalSvgPath = id.slice(0, -virtualModuleSuffix.length);

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
        } catch (e: unknown) {
          let errorMessage = `Failed to load or transform ${originalSvgPath}: Unknown error`;
          if (e instanceof Error) {
            errorMessage = `Failed to load or transform ${originalSvgPath}: ${e.message}`;
          } else if (typeof e === 'string') {
            errorMessage = `Failed to load or transform ${originalSvgPath}: ${e}`;
          }
          this.error(errorMessage);
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
