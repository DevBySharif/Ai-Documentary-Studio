import { IPImageResult } from "./types";

export interface IPChannelDNA {
  artStyle: string;
  characterProportions: string;
  cameraPerspective: string;
  colorLanguage: string[];
  lighting: string;
  emotionalTone: string;
}

export class IPImageConsistencyAI {
  detectCharacterDrift(newImage: IPImageResult, previousImages: IPImageResult[]): number {
    if (previousImages.length === 0) return 100;
    const driftScore = Math.min(
      100,
      Math.abs(newImage.seed - previousImages[previousImages.length - 1].seed) % 30
    );
    return 100 - driftScore;
  }

  detectLightingInconsistency(newImage: IPImageResult, previousImages: IPImageResult[]): number {
    if (previousImages.length === 0) return 0;
    const avgPrevTime =
      previousImages.reduce((sum, img) => sum + img.generationTime, 0) / previousImages.length;
    const diff = Math.abs(newImage.generationTime - avgPrevTime);
    return Math.min(100, (diff / avgPrevTime) * 50);
  }

  detectArtStyleDeviation(newImage: IPImageResult, channelDna: IPChannelDNA): number {
    const newPromptLower = newImage.promptUsed.toLowerCase();
    const styleKeywords = channelDna.artStyle.toLowerCase().split(/\s+/);
    const matched = styleKeywords.filter((kw) => newPromptLower.includes(kw));
    const ratio = matched.length / styleKeywords.length;
    return Math.min(100, (1 - ratio) * 100);
  }

  detectCompositionConflict(newImage: IPImageResult, previousImages: IPImageResult[]): number {
    if (previousImages.length === 0) return 0;
    const sameProvider = previousImages.filter((img) => img.provider === newImage.provider);
    if (sameProvider.length === 0) return 20;
    return 0;
  }

  getOverallConsistency(
    newImage: IPImageResult,
    previousImages: IPImageResult[],
    channelDna: IPChannelDNA
  ): number {
    const characterDrift = this.detectCharacterDrift(newImage, previousImages);
    const lightInconsistency = this.detectLightingInconsistency(newImage, previousImages);
    const styleDeviation = this.detectArtStyleDeviation(newImage, channelDna);
    const compositionConflict = this.detectCompositionConflict(newImage, previousImages);

    const consistencyScore =
      characterDrift * 0.3 +
      (100 - lightInconsistency) * 0.2 +
      (100 - styleDeviation) * 0.3 +
      (100 - compositionConflict) * 0.2;

    return Math.round(Math.max(0, Math.min(100, consistencyScore)));
  }
}
