import { describe, it, expect } from 'vitest';
import { transform } from '../transform.js';

describe('transform', () => {
  const basicSvg = `<svg width="24" height="24" viewBox="0 0 24 24">
  <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.08.2 2.92.2 4 0 5.16-1 9-5.45 9-11V7l-10-5z"/>
</svg>`;

  it('should transform basic SVG to JavaScript component', () => {
    const result = transform(basicSvg, { typescript: false });

    expect(result.extension).toBe('.gjs');
    expect(result.code).toContain('<template>');
    expect(result.code).toContain('<svg');
    expect(result.code).toContain('...attributes');
    expect(result.code).toContain('</template>');
  });

  it('should transform basic SVG to TypeScript component', () => {
    const result = transform(basicSvg, { typescript: true });

    expect(result.extension).toBe('.gts');
    expect(result.code).toContain('import type { TOC }');
    expect(result.code).toContain('interface Signature');
    expect(result.code).toContain('Element: SVGSVGElement');
    expect(result.code).toContain('<template>');
    expect(result.code).toContain('...attributes');
  });

  it('should add attributes spread to svg element', () => {
    const result = transform(basicSvg);

    expect(result.code).toMatch(/<svg[^>]*\s+\.\.\.attributes[^>]*>/);
  });

  it('should preserve SVG attributes', () => {
    const result = transform(basicSvg);

    expect(result.code).toContain('width="24"');
    expect(result.code).toContain('height="24"');
    expect(result.code).toContain('viewBox="0 0 24 24"');
  });

  it('should handle SVG optimization', () => {
    const svgWithComments = `<!-- This is a comment -->
<svg width="24" height="24" viewBox="0 0 24 24">
  <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.08.2 2.92.2 4 0 5.16-1 9-5.45 9-11V7l-10-5z"/>
</svg>`;

    const result = transform(svgWithComments, { optimize: true });

    // Comments should be removed by optimization
    expect(result.code).not.toContain('<!-- This is a comment -->');
    expect(result.code).toContain('<path d=');
  });

  it('should handle SVG with no optimization', () => {
    const result = transform(basicSvg, { optimize: false });

    expect(result.code).toContain('<svg');
    expect(result.code).toContain('...attributes');
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
    const complexSvg = `<svg width="24" height="24" viewBox="0 0 24 24">
  <g>
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.79a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </g>
</svg>`;

    const result = transform(complexSvg, { optimize: false });

    expect(result.code).toContain('<g>');
    expect(result.code).toContain('<circle');
    expect(result.code).toContain('<path');
    expect(result.code).toContain('</g>');
    expect(result.code).toContain('...attributes');
  });
});
