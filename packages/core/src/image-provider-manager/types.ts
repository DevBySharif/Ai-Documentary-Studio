export type IPProviderName =
  | "google_flow"
  | "google_imagen"
  | "flux"
  | "stable_diffusion"
  | "comfyui"
  | "fal_ai"
  | "replicate"
  | "midjourney"
  | "black_forest_labs"
  | "ideogram"
  | "reve"
  | "openai_image";

export type IPAspectRatio = "16:9" | "4:3" | "1:1" | "9:16" | "3:2" | "2:3";

export type IPQualityLevel = "draft" | "standard" | "high" | "ultra";

export type IPHealthStatus = "healthy" | "degraded" | "unavailable";

export interface IPImageRequest {
  sceneId: string;
  prompt: string;
  negativePrompt?: string;
  aspectRatio: IPAspectRatio;
  styleLock?: string;
  characterLock?: string;
  seed?: number;
  quality: IPQualityLevel;
  resolution: string;
  channelDnaVersion?: string;
}

export interface IPImageResult {
  imageId: string;
  provider: IPProviderName;
  promptUsed: string;
  seed: number;
  styleLock?: string;
  characterLock?: string;
  validated: boolean;
  status: "pending" | "completed" | "failed" | "review";
  cost: number;
  generationTime: number;
}

export interface IPStyleLock {
  artStyle: string;
  colorPalette: string[];
  lighting: string;
  composition: string;
  brushStyle: string;
  renderingStyle: string;
}

export interface IPCharacterLock {
  face: string;
  hair: string;
  clothing: string;
  bodyShape: string;
  age: string;
  accessories: string[];
  expressions: string[];
}

export interface IPBenchmark {
  provider: IPProviderName;
  avgGenerationTime: number;
  promptFidelity: number;
  characterConsistency: number;
  styleAccuracy: number;
  failureRate: number;
  costEfficiency: number;
}

export interface IPOutputContract {
  provider: IPProviderName;
  style: string;
  resolution: string;
  validated: boolean;
  status: "pending" | "approved" | "rejected" | "flagged";
}
