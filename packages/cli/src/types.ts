export interface CliOptions {
  typescript?: boolean;
  outDir?: string;
  ignoreExisting?: boolean;
}

export interface TransformFileOptions {
  inputPath: string;
  outputPath?: string;
  typescript?: boolean;
}

export interface TransformResult {
  success: boolean;
  inputPath: string;
  outputPath: string;
  error?: string;
}
