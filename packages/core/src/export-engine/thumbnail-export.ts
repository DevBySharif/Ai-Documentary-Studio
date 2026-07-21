import type { EEThumbnailFormat } from "./types.js";

export class EEThumbnailExport {
  private readonly formats: EEThumbnailFormat[] = ["png", "jpg", "webp"];

  export(mainFrame: string, altFrame: string, safeCrop: string, format: EEThumbnailFormat): string[] {
    const outputs: string[] = [];
    outputs.push(`thumbnail_main.${format}`);
    outputs.push(`thumbnail_alt.${format}`);
    outputs.push(`thumbnail_frame_capture.${format}`);
    outputs.push(`thumbnail_safe_crop_preview.${format}`);
    return outputs;
  }

  getSupportedFormats(): EEThumbnailFormat[] {
    return [...this.formats];
  }

  getMimeType(format: EEThumbnailFormat): string {
    const map: Record<EEThumbnailFormat, string> = { png: "image/png", jpg: "image/jpeg", webp: "image/webp" };
    return map[format];
  }
}
