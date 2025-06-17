export interface CliOptions {
  typescript?: boolean;
  outDir?: string;
  ignoreExisting?: boolean;
  optimize: boolean; // Commander will set this based on --no-optimize
}

export interface TransformFileOptions {
  inputPath: string;
  outputPath?: string;
  typescript?: boolean;
  optimize?: boolean;
}

export interface TransformResult {
  success: boolean;
  inputPath: string;
  outputPath: string;
  error?: string;
}
