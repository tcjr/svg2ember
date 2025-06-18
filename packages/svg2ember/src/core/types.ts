export interface TransformOptions {
  typescript?: boolean;
  optimize?: boolean;
  svgoConfig?: Record<string, unknown>;
}

export interface TransformResult {
  code: string;
  extension: '.gjs' | '.gts';
}
