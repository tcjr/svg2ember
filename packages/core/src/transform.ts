import { parse, type SvgNode } from 'svg-parser';
import { optimize } from 'svgo';
import type { TransformOptions, TransformResult } from './types.js';

export function transform(
  svgContent: string,
  options: TransformOptions = {},
): TransformResult {
  const {
    typescript = false,
    optimize: shouldOptimize = true,
    svgoConfig = {},
  } = options;

  let processedSvg = svgContent;

  // Optimize SVG if requested
  if (shouldOptimize) {
    const result = optimize(svgContent, {
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
      ...svgoConfig,
    });
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
  // Add a marker for ...attributes to the root svg element's properties
  // SvgNode properties are optional, so ensure it exists.
  // svgElement is guaranteed to be an 'element' type here due to prior checks.
  if (!svgElement.properties) {
    svgElement.properties = {};
  }
  svgElement.properties['__spreadAttributes__'] = 1;

  // Convert AST back to SVG string; astToSvgString will handle the spread
  const svgWithAttributes = astToSvgString(svgElement);

  if (typescript) {
    return `import type { TOC } from '@ember/component/template-only';

interface Signature {
  Element: SVGSVGElement;
}

const SvgComponent: TOC<Signature> = <template>
  ${svgWithAttributes}
</template>;

export default SvgComponent;`;
  } else {
    return `<template>
  ${svgWithAttributes}
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
    .map(([key, value]) => {
      if (key === '__spreadAttributes__' && value === 1) {
        return '...attributes';
      }
      return `${key}="${value}"`;
    })
    .join(' ');

  const attrsString = attrs ? ` ${attrs}` : '';

  if (children.length === 0) {
    return `<${tagName}${attrsString} />`;
  }

  const childrenString = children
    .map((child: SvgNode) => astToSvgString(child))
    .join('');

  return `<${tagName}${attrsString}>${childrenString}</${tagName}>`;
}
