import { describe, it, expect } from 'vitest';
import { transform } from '../transform.js';

describe('transform', () => {
  const basicSvg = `<svg width="24" height="24" viewBox="0 0 24 24">
  <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.08.2 2.92.2 4 0 5.16-1 9-5.45 9-11V7l-10-5z"/>
</svg>`;

  it('should transform basic SVG to JavaScript component', () => {
    const result = transform(basicSvg, { typescript: false });

    expect(result.extension).toBe('.gjs');
    expect(result.code).toMatchSnapshot();
  });

  it('should transform basic SVG to TypeScript component', () => {
    const result = transform(basicSvg, { typescript: true });

    expect(result.extension).toBe('.gts');
    expect(result.code).toMatchSnapshot();
  });

  it('should add attributes spread to svg element', () => {
    const result = transform(basicSvg);

    expect(result.code).toMatch(/<svg[^>]*\s+\.\.\.attributes[^>]*>/);
    expect(result.code).toMatchSnapshot();
  });

  it('should preserve SVG attributes', () => {
    const result = transform(basicSvg);

    expect(result.code).toContain('width="24"');
    expect(result.code).toContain('height="24"');
    expect(result.code).toContain('viewBox="0 0 24 24"');
    expect(result.code).toMatchSnapshot();
  });

  it('should handle SVG optimization', () => {
    const svgWithId = `
<svg width="24" height="24" viewBox="0 0 24 24" id="SVG_ID_1">
  <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.08.2 2.92.2 4 0 5.16-1 9-5.45 9-11V7l-10-5z"/>
</svg>`;

    const result = transform(svgWithId);

    // Ids should be removed by optimization
    expect(result.code).not.toContain('SVG_ID_1');
    expect(result.code).toMatchSnapshot();
  });

  it('should handle SVG with no optimization', () => {
    const svgWithId = `
<svg width="24" height="24" viewBox="0 0 24 24" id="SVG_ID_1">
  <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.08.2 2.92.2 4 0 5.16-1 9-5.45 9-11V7l-10-5z"/>
</svg>`;
    const result = transform(svgWithId, { optimize: false });
    expect(result.code).toContain('id="SVG_ID_1"');
    expect(result.code).toMatchSnapshot();
  });

  it('should throw error for invalid SVG', () => {
    expect(() => transform('not an svg')).toThrow();
  });

  it('should throw error for SVG with no root element', () => {
    expect(() => transform('<div>not svg</div>')).toThrow(
      'Invalid SVG: No <svg> root element found',
    );
  });

  it('should handle complex SVG with nested elements', () => {
    const complexSvg = `
<?xml version="1.0" encoding="UTF-8"?>
<svg width="88px" height="88px" viewBox="0 0 88 88" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
    <title>Dismiss</title>
    <desc>Created with Sketch.</desc>
    <defs></defs>
    <g id="Blocks" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">
        <g id="Dismiss" stroke="#063855" stroke-width="2">
            <path d="M51,37 L37,51" id="Shape"></path>
            <path d="M51,51 L37,37" id="Shape"></path>
        </g>
    </g>
</svg>
`;

    const result = transform(complexSvg, { optimize: false });
    expect(result.code).toMatchSnapshot();
  });

  it('should transform empty SVG', () => {
    const result = transform('<svg></svg>');
    expect(result.extension).toBe('.gjs');
    expect(result.code).toMatchSnapshot();
  });

  it('should transform empty self-closing SVG', () => {
    const result = transform('<svg />');
    expect(result.extension).toBe('.gjs');
    expect(result.code).toMatchSnapshot();
  });
});

describe('transform with svgoConfig', () => {
  it('should pass options onto svgo, with xmlns', () => {
    const svgSource = `
      <svg xmlns="http://www.w3.org/2000/svg">
      </svg>
    `;
    const result = transform(svgSource, {
      svgoConfig: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
              },
            },
          },
          //'removeXMLNS', <- commenting this means xmlns will remain
        ],
      },
    });
    expect(result.code).toContain('xmlns');
  });

  it('should pass options onto svgo, without xmlns', () => {
    const svgSource = `
      <svg xmlns="http://www.w3.org/2000/svg">
      </svg>
    `;
    const result = transform(svgSource, {
      svgoConfig: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
              },
            },
          },
          'removeXMLNS', // <- leaving this means xmlns will be removed
        ],
      },
    });
    expect(result.code).not.toContain('xmlns');
  });
});
