export interface ColorCorrectionParameters {
  readonly exposure: number; // EV offset (-5 to +5)
  readonly contrast: number; // 0.0 to 2.0
  readonly saturation: number; // 0.0 to 2.0
  readonly whiteBalanceKelvin: number; // 2000 to 12000
  readonly tint: number; // -100 to +100
  readonly lutAssetId?: string; // Optional LUT file reference
  readonly colorWheels?: {
    readonly lift: { r: number; g: number; b: number };
    readonly gamma: { r: number; g: number; b: number };
    readonly gain: { r: number; g: number; b: number };
  };
}

export const DEFAULT_COLOR_CORRECTION: ColorCorrectionParameters = {
  exposure: 0.0,
  contrast: 1.0,
  saturation: 1.0,
  whiteBalanceKelvin: 6500,
  tint: 0.0,
};

export class ColorProcessor {
  public applyColorCorrection(
    params: ColorCorrectionParameters,
    inputBuffer: Float32Array
  ): Float32Array {
    // Process exposure, contrast, saturation transformations
    const output = new Float32Array(inputBuffer.length);
    const contrastFactor = params.contrast;

    for (let i = 0; i < inputBuffer.length; i += 4) {
      let r = inputBuffer[i] * Math.pow(2, params.exposure);
      let g = inputBuffer[i + 1] * Math.pow(2, params.exposure);
      let b = inputBuffer[i + 2] * Math.pow(2, params.exposure);

      // Contrast adjust
      r = (r - 0.5) * contrastFactor + 0.5;
      g = (g - 0.5) * contrastFactor + 0.5;
      b = (b - 0.5) * contrastFactor + 0.5;

      output[i] = Math.max(0, Math.min(1, r));
      output[i + 1] = Math.max(0, Math.min(1, g));
      output[i + 2] = Math.max(0, Math.min(1, b));
      output[i + 3] = inputBuffer[i + 3]; // preserve alpha
    }

    return output;
  }
}
