import { IPProviderName, IPImageRequest, IPImageResult } from "./types";

export interface IPRetryStrategyOptions {
  maxRetries: number;
  maxFallbacks: number;
  requestReviewAfter: number;
}

export class IPRetryStrategy {
  private retryCounts: Map<IPProviderName, number> = new Map();
  private options: IPRetryStrategyOptions;

  constructor(options?: Partial<IPRetryStrategyOptions>) {
    this.options = {
      maxRetries: 3,
      maxFallbacks: 2,
      requestReviewAfter: 3,
      ...options,
    };
  }

  private getFallbackOrder(provider: IPProviderName): IPProviderName[] {
    const fallbackMap: Record<IPProviderName, IPProviderName[]> = {
      google_flow: ["google_imagen", "fal_ai", "replicate"],
      google_imagen: ["google_flow", "fal_ai", "replicate"],
      flux: ["stable_diffusion", "fal_ai", "replicate"],
      stable_diffusion: ["flux", "comfyui", "replicate"],
      comfyui: ["stable_diffusion", "flux", "fal_ai"],
      fal_ai: ["replicate", "google_flow", "flux"],
      replicate: ["fal_ai", "google_flow", "stable_diffusion"],
      midjourney: ["google_imagen", "flux", "ideogram"],
      black_forest_labs: ["flux", "stable_diffusion", "fal_ai"],
      ideogram: ["midjourney", "google_imagen", "flux"],
      reve: ["flux", "google_flow", "fal_ai"],
      openai_image: ["google_imagen", "fal_ai", "replicate"],
    };
    return fallbackMap[provider] ?? ["google_flow", "flux", "fal_ai"];
  }

  private modifyParameters(provider: IPProviderName, request: IPImageRequest, attempt: number): IPImageRequest {
    const modified = { ...request };
    if (attempt === 1) {
      modified.seed = Math.floor(Math.random() * 2147483647);
    } else if (attempt === 2) {
      modified.seed = Math.floor(Math.random() * 2147483647);
      if (provider === "stable_diffusion" || provider === "flux") {
        modified.quality = modified.quality === "ultra" ? "high" : modified.quality;
      }
    }
    return modified;
  }

  async execute(
    provider: IPProviderName,
    request: IPImageRequest,
    fn: (p: IPProviderName, r: IPImageRequest) => Promise<IPImageResult>
  ): Promise<IPImageResult> {
    const currentRetries = this.retryCounts.get(provider) ?? 0;

    for (let attempt = 0; attempt <= this.options.maxRetries; attempt++) {
      try {
        const req = attempt > 0 ? this.modifyParameters(provider, request, attempt) : request;
        const result = await fn(provider, req);
        this.retryCounts.set(provider, currentRetries + attempt);
        if (result.status === "failed" && attempt < this.options.maxRetries) {
          continue;
        }
        return result;
      } catch (err) {
        if (attempt >= this.options.maxRetries) {
          const fallbacks = this.getFallbackOrder(provider);
          for (let f = 0; f < Math.min(fallbacks.length, this.options.maxFallbacks); f++) {
            try {
              const result = await fn(fallbacks[f], request);
              this.retryCounts.set(fallbacks[f], (this.retryCounts.get(fallbacks[f]) ?? 0) + 1);
              return result;
            } catch {
              continue;
            }
          }
          const totalRetries = currentRetries + attempt;
          const fallbacksTried = this.options.maxFallbacks;
          if (totalRetries >= this.options.requestReviewAfter) {
            return {
              imageId: `review_${Date.now()}`,
              provider,
              promptUsed: request.prompt,
              seed: request.seed ?? 0,
              validated: false,
              status: "review",
              cost: 0,
              generationTime: 0,
            };
          }
          throw err;
        }
      }
    }

    return {
      imageId: `failed_${Date.now()}`,
      provider,
      promptUsed: request.prompt,
      seed: request.seed ?? 0,
      validated: false,
      status: "failed",
      cost: 0,
      generationTime: 0,
    };
  }

  getRetryCount(provider: IPProviderName): number {
    return this.retryCounts.get(provider) ?? 0;
  }

  resetRetryCount(provider: IPProviderName): void {
    this.retryCounts.delete(provider);
  }

  resetAll(): void {
    this.retryCounts.clear();
  }
}
