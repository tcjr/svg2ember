import { parse, type SvgNode } from 'svg-parser';
import { optimize, type Config } from 'svgo';
import type { TransformOptions, TransformResult } from './types.js';

export const DEFAULT_SVGO_CONFIG: Config = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
        },
      },
    },
    'removeXMLNS',
  ],
};

export function transform(
  svgContent: string,
  options: TransformOptions = {},
): TransformResult {
  const {
    typescript = false,
    optimize: shouldOptimize = true,
    svgoConfig = DEFAULT_SVGO_CONFIG,
  } = options;

  let processedSvg = svgContent;

  // Optimize SVG if requested
  if (shouldOptimize) {
    const result = optimize(svgContent, svgoConfig);
    processedSvg = result.data;
  }

  // Parse SVG using svg-parser for AST-based processing
  let ast;
  try {
    ast = parse(processedSvg);
  } catch {
    throw new Error('Invalid SVG: Failed to parse SVG content');
  }

  if (!ast.children || ast.children.length === 0) {
    throw new Error('Invalid SVG: No content found');
  }

  // Find the root SVG element
  const svgElement = ast.children.find(
    (child: SvgNode) => child.type === 'element' && child.tagName === 'svg',
  );

  if (!svgElement) {
    throw new Error('Invalid SVG: No <svg> root element found');
  }

  // Generate Ember component template
  const componentCode = generateEmberComponent(svgElement, typescript);
  const extension = typescript ? '.gts' : '.gjs';

  return {
    code: componentCode,
    extension,
  };
}

function generateEmberComponent(
  svgElement: SvgNode,
  typescript: boolean,
): string {
  // Convert AST back to SVG string with attributes spread
  const svgString = astToSvgString(svgElement);

  if (typescript) {
    return `import type { TOC } from '@ember/component/template-only';

interface Signature {
  Element: SVGSVGElement;
}

const IconComponent: TOC<Signature> = <template>
  ${svgString}
</template>;

export default IconComponent;`;
  } else {
    return `<template>
  ${svgString}
</template>`;
  }
}

function astToSvgString(element: SvgNode): string {
  if (element.type !== 'element') {
    return element.type === 'text' ? element.value || '' : '';
  }

  const { tagName, properties = {}, children = [] } = element;

  // Convert properties to attribute string
  const attrs = Object.entries(properties)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  let attrsString = attrs ? ` ${attrs}` : '';

  // Never self-close <svg> because we add {{yield}}
  if (children.length === 0 && tagName !== 'svg') {
    return `<${tagName}${attrsString} />`;
  }

  let childrenString = children
    .map((child: SvgNode) => astToSvgString(child))
    .join('');

  if (tagName === 'svg') {
    // Add `...attributes` to the opening `<svg>` tag
    attrsString = `${attrsString} ...attributes`;

    // Add `{{yield}}` just before the closing `</svg>`
    childrenString = `${childrenString}{{yield}}`;
  }

  return `<${tagName}${attrsString}>${childrenString}</${tagName}>`;
}
