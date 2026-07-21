export type ResolutionScale = 1.0 | 0.5 | 0.25 | 0.125;

export type ProfileName = "Performance" | "Balanced" | "Quality";

export interface PreviewQualityProfile {
  readonly name: ProfileName;
  readonly scale: ResolutionScale;
  readonly renderAheadBufferFrames: number;
  readonly enableComplexEffects: boolean;
  readonly maxGpuMemoryMb: number;
}

export const PERFORMANCE_PROFILE: PreviewQualityProfile = {
  name: "Performance",
  scale: 0.25,
  renderAheadBufferFrames: 5,
  enableComplexEffects: false,
  maxGpuMemoryMb: 512,
};

export const BALANCED_PROFILE: PreviewQualityProfile = {
  name: "Balanced",
  scale: 0.5,
  renderAheadBufferFrames: 15,
  enableComplexEffects: true,
  maxGpuMemoryMb: 1024,
};

export const QUALITY_PROFILE: PreviewQualityProfile = {
  name: "Quality",
  scale: 1.0,
  renderAheadBufferFrames: 30,
  enableComplexEffects: true,
  maxGpuMemoryMb: 2048,
};
