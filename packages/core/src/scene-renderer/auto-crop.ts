import type { CropRect } from "./types.js";

export class AutoCropEngine {
  crop(imageWidth: number, imageHeight: number, targetRatio: string, subjectBox?: { x: number; y: number; width: number; height: number }): CropRect {
    const [w, h] = targetRatio.split(":").map(Number);
    const targetAspect = w / h;
    const imageAspect = imageWidth / imageHeight;

    let cropW: number, cropH: number, cropX: number, cropY: number;

    if (imageAspect > targetAspect) {
      cropH = imageHeight;
      cropW = cropH * targetAspect;
      cropX = subjectBox ? Math.max(0, subjectBox.x + subjectBox.width / 2 - cropW / 2) : (imageWidth - cropW) / 2;
      cropY = 0;
    } else {
      cropW = imageWidth;
      cropH = cropW / targetAspect;
      cropY = subjectBox ? Math.max(0, subjectBox.y + subjectBox.height / 2 - cropH / 2) : (imageHeight - cropH) / 2;
      cropX = 0;
    }

    if (subjectBox) {
      cropX = Math.max(0, Math.min(imageWidth - cropW, cropX));
      cropY = Math.max(0, Math.min(imageHeight - cropH, cropY));
    }

    return { x: Math.round(cropX), y: Math.round(cropY), width: Math.round(cropW), height: Math.round(cropH), aspectRatio: targetRatio };
  }

  supportedRatios(): string[] {
    return ["16:9", "9:16", "1:1", "4:5"];
  }
}
