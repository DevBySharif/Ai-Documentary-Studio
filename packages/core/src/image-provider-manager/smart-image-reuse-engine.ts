import { IPImageRequest, IPImageResult } from "./types";

export interface IPReuseCandidate {
  result: IPImageResult;
  similarityScore: number;
}

export class IPSmartImageReuseEngine {
  private calculatePromptSimilarity(a: string, b: string): number {
    const tokensA = new Set(a.toLowerCase().split(/\s+/));
    const tokensB = new Set(b.toLowerCase().split(/\s+/));
    const intersection = new Set([...tokensA].filter((t) => tokensB.has(t)));
    const union = new Set([...tokensA, ...tokensB]);
    if (union.size === 0) return 0;
    return (intersection.size / union.size) * 100;
  }

  private calculateSceneSimilarity(request: IPImageRequest, existing: IPImageResult): number {
    let score = 0;
    if (request.styleLock && existing.styleLock) {
      const shared = request.styleLock === existing.styleLock ? 20 : 0;
      score += shared;
    }
    if (request.characterLock && existing.characterLock) {
      const shared = request.characterLock === existing.characterLock ? 20 : 0;
      score += shared;
    }
    if (request.seed !== undefined && existing.seed === request.seed) {
      score += 10;
    }
    return score;
  }

  private calculateCharacterSimilarity(request: IPImageRequest, existing: IPImageResult): number {
    if (!request.characterLock || !existing.characterLock) return 0;
    return request.characterLock === existing.characterLock ? 100 : 0;
  }

  private calculateBackgroundSimilarity(request: IPImageRequest, existing: IPImageResult): number {
    return 50;
  }

  findReusable(request: IPImageRequest, existingImages: IPImageResult[]): IPImageResult | undefined {
    const candidates: IPReuseCandidate[] = [];

    for (const img of existingImages) {
      if (img.status !== "completed") continue;

      const promptSim = this.calculatePromptSimilarity(request.prompt, img.promptUsed);
      const sceneSim = this.calculateSceneSimilarity(request, img);
      const charSim = this.calculateCharacterSimilarity(request, img);
      const bgSim = this.calculateBackgroundSimilarity(request, img);

      const totalScore =
        promptSim * 0.35 + sceneSim * 0.3 + charSim * 0.25 + bgSim * 0.1;

      if (totalScore >= 60) {
        candidates.push({ result: img, similarityScore: totalScore });
      }
    }

    if (candidates.length === 0) return undefined;

    candidates.sort((a, b) => b.similarityScore - a.similarityScore);
    return candidates[0].result;
  }

  findReusables(request: IPImageRequest, existingImages: IPImageResult[]): IPReuseCandidate[] {
    const candidates: IPReuseCandidate[] = [];

    for (const img of existingImages) {
      if (img.status !== "completed") continue;

      const promptSim = this.calculatePromptSimilarity(request.prompt, img.promptUsed);
      const sceneSim = this.calculateSceneSimilarity(request, img);
      const charSim = this.calculateCharacterSimilarity(request, img);
      const bgSim = this.calculateBackgroundSimilarity(request, img);

      const totalScore =
        promptSim * 0.35 + sceneSim * 0.3 + charSim * 0.25 + bgSim * 0.1;

      if (totalScore >= 40) {
        candidates.push({ result: img, similarityScore: totalScore });
      }
    }

    candidates.sort((a, b) => b.similarityScore - a.similarityScore);
    return candidates;
  }
}
