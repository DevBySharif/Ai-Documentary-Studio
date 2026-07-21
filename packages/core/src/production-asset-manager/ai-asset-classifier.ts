import type { PAAssetType } from "./types.js";

const ALL_TYPES: PAAssetType[] = [
  "script", "prompt", "image", "voice", "music", "sound_effect",
  "subtitle", "motion_data", "timeline_data", "effects", "render_cache",
  "qa_report", "thumbnail", "export_file", "project_metadata",
];

export class PAAIAssetClassifier {
  private classifications: Map<string, PAAssetType> = new Map();
  private confidences: Map<string, number> = new Map();
  private tags: Map<string, string[]> = new Map();

  classify(assetId: string): PAAssetType {
    const existing = this.classifications.get(assetId);
    if (existing) return existing;
    const randomType = ALL_TYPES[Math.floor(Math.random() * ALL_TYPES.length)];
    this.classifications.set(assetId, randomType);
    this.confidences.set(assetId, Math.random());
    return randomType;
  }

  getConfidence(assetId: string): number {
    return this.confidences.get(assetId) ?? 0;
  }

  suggestTags(assetId: string): string[] {
    const existing = this.tags.get(assetId);
    if (existing) return existing;
    const tags = ["auto_generated", this.classify(assetId)];
    this.tags.set(assetId, tags);
    return tags;
  }

  autoClassifyAll(projectId: string): Map<string, PAAssetType> {
    const results = new Map<string, PAAssetType>();
    return results;
  }

  setClassification(assetId: string, type: PAAssetType, confidence: number): void {
    this.classifications.set(assetId, type);
    this.confidences.set(assetId, confidence);
  }
}
