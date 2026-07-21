import type { HybridSimilarityInput, HybridSimilarityResult } from "./types.js";

export class HybridSimilarityAI {
  combine(input: HybridSimilarityInput): HybridSimilarityResult {
    if (!input) throw new Error("HybridSimilarityInput is required");

    const normalize = (v: unknown): number => (typeof v === "number" && !isNaN(v) ? Math.max(0, Math.min(100, v)) : 0);

    const embeddingScore = normalize(input.embeddingScore);
    const perceptualHashScore = normalize(input.perceptualHashScore);
    const objectOverlap = normalize(input.objectOverlap);
    const dnaMatch = normalize(input.dnaMatch);
    const promptSimilarity = normalize(input.promptSimilarity);

    const embeddingWeight = 0.3;
    const hashWeight = 0.2;
    const objectWeight = 0.15;
    const dnaWeight = 0.2;
    const promptWeight = 0.15;

    const combinedScore = Math.round(
      embeddingScore * embeddingWeight +
      perceptualHashScore * hashWeight +
      objectOverlap * objectWeight +
      dnaMatch * dnaWeight +
      promptSimilarity * promptWeight
    );

    return {
      combinedScore,
      embeddingWeight,
      hashWeight,
      objectWeight,
      dnaWeight,
      promptWeight,
      breakdown: `Embedding:${embeddingScore}(${Math.round(embeddingWeight * 100)}%) + Hash:${perceptualHashScore}(${Math.round(hashWeight * 100)}%) + Object:${objectOverlap}(${Math.round(objectWeight * 100)}%) + DNA:${dnaMatch}(${Math.round(dnaWeight * 100)}%) + Prompt:${promptSimilarity}(${Math.round(promptWeight * 100)}%) = ${combinedScore}`,
    };
  }
}
