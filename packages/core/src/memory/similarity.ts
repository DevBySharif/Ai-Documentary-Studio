import type { ImageSimilarityScore, ImageMemoryEntry } from "./types.js";

export class ImageSimilarityEngine {
  compare(candidate: ImageMemoryEntry, query: {
    concept?: string;
    composition?: string;
    camera?: string;
    emotion?: string;
  }): ImageSimilarityScore {
    const conceptScore = query.concept
      ? (candidate.concept.toLowerCase() === query.concept.toLowerCase() ? 1.0 : 0.2)
      : 0.5;

    const compositionScore = 0.8;
    const cameraScore = query.camera
      ? (candidate.camera.toLowerCase() === query.camera.toLowerCase() ? 1.0 : 0.3)
      : 0.5;

    const emotionScore = query.emotion
      ? (candidate.emotion.toLowerCase() === query.emotion.toLowerCase() ? 1.0 : 0.3)
      : 0.5;

    const overall = Math.round(
      (conceptScore * 0.4 + compositionScore * 0.2 + cameraScore * 0.2 + emotionScore * 0.2) * 100
    ) / 100;

    return {
      imageId: candidate.imageId,
      concept: conceptScore,
      composition: compositionScore,
      camera: cameraScore,
      emotion: emotionScore,
      overall,
    };
  }

  findBestMatch(
    images: ImageMemoryEntry[],
    query: { concept?: string; composition?: string; camera?: string; emotion?: string },
    threshold: number
  ): { image: ImageMemoryEntry; score: ImageSimilarityScore } | null {
    let best: { image: ImageMemoryEntry; score: ImageSimilarityScore } | null = null;

    for (const img of images) {
      const score = this.compare(img, query);
      if (score.overall >= threshold) {
        if (!best || score.overall > best.score.overall) {
          best = { image: img, score };
        }
      }
    }

    return best;
  }
}
