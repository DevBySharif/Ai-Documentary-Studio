export type ImageProviderId =
  | "GPTImage"
  | "FLUX"
  | "SDXL"
  | "Imagen"
  | "Midjourney"
  | "Ideogram";

export type RefinementType =
  | "Upscaling"
  | "Inpainting"
  | "Outpainting"
  | "BackgroundCleanup"
  | "ObjectCorrection"
  | "FaceEnhancement"
  | "ColorRefinement";

export interface GenerationPolicy {
  readonly maxCostPerImageDollars: number;
  readonly preferParallelCandidates: boolean;
  readonly candidateCount: number;
  readonly autoApplyRefinements: boolean;
}

export interface ImageQualityScore {
  readonly compositionScore: number; // 0 to 100
  readonly detailScore: number;
  readonly sharpnessScore: number;
  readonly promptAlignmentScore: number;
  readonly visualStorytellingScore: number;
  readonly historicalAuthenticityScore: number;
  readonly overallScore: number;
}

export interface GenerationCandidate {
  readonly candidateId: string;
  readonly provider: ImageProviderId;
  readonly imageUrl: string;
  readonly qualityScore: ImageQualityScore;
  readonly appliedRefinements: ReadonlyArray<RefinementType>;
  readonly isApproved: boolean;
  readonly generatedAt: Date;
}
