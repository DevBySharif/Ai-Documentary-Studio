import type { RhythmSignature, RhythmSignatureProfile, VisualTempo } from "./types.js";

const SIGNATURES: Record<RhythmSignature, RhythmSignatureProfile> = {
  documentary: {
    name: "documentary", baseTempo: "slow", holdMultiplier: 1.3,
    motionDensity: 0.3, breathingFrequency: 0.4, cutThreshold: 0.3, emphasisLevel: "moderate",
  },
  educational: {
    name: "educational", baseTempo: "medium", holdMultiplier: 1.0,
    motionDensity: 0.5, breathingFrequency: 0.25, cutThreshold: 0.5, emphasisLevel: "high",
  },
  motivational: {
    name: "motivational", baseTempo: "dynamic", holdMultiplier: 0.8,
    motionDensity: 0.7, breathingFrequency: 0.15, cutThreshold: 0.6, emphasisLevel: "very_high",
  },
  storytelling: {
    name: "storytelling", baseTempo: "dynamic", holdMultiplier: 1.1,
    motionDensity: 0.5, breathingFrequency: 0.3, cutThreshold: 0.4, emphasisLevel: "high",
  },
  news: {
    name: "news", baseTempo: "fast", holdMultiplier: 0.7,
    motionDensity: 0.6, breathingFrequency: 0.1, cutThreshold: 0.7, emphasisLevel: "moderate",
  },
};

export class RhythmSignatureSystem {
  getProfile(signature: RhythmSignature): RhythmSignatureProfile {
    return SIGNATURES[signature] ?? SIGNATURES.documentary;
  }

  getAvailableSignatures(): RhythmSignature[] {
    return Object.keys(SIGNATURES) as RhythmSignature[];
  }
}
