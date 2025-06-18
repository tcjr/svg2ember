declare module 'svg-parser' {
  export interface SvgNode {
    type: 'element' | 'text';
    tagName?: string;
    properties?: Record<string, string | number>;
    children?: SvgNode[];
    value?: string;
  }

  export interface SvgRoot {
    type: 'root';
    children: SvgNode[];
  }

  export function parse(svg: string): SvgRoot;
}
