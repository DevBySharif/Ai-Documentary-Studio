import type { AdaptiveRenderProfile, SceneLightingConfig, SafeAreaBounds } from "./types.js";

export class AdaptiveRenderProfileManager {
  private profiles = new Map<string, AdaptiveRenderProfile>();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults(): void {
    this.profiles.set("documentary", {
      channelId: "documentary", name: "Documentary", composition: "calm", lighting: "soft",
      subtitleSafeArea: 0.1, motionIntensity: 0.3, effectsLevel: "minimal"
    });
    this.profiles.set("educational", {
      channelId: "educational", name: "Educational", composition: "clear", lighting: "neutral",
      subtitleSafeArea: 0.15, motionIntensity: 0.4, effectsLevel: "moderate"
    });
    this.profiles.set("storytelling", {
      channelId: "storytelling", name: "Storytelling", composition: "dramatic", lighting: "dramatic",
      subtitleSafeArea: 0.1, motionIntensity: 0.6, effectsLevel: "strong"
    });
    this.profiles.set("shorts", {
      channelId: "shorts", name: "Shorts", composition: "tight", lighting: "dramatic",
      subtitleSafeArea: 0.12, motionIntensity: 0.7, effectsLevel: "moderate"
    });
  }

  register(profile: AdaptiveRenderProfile): void {
    this.profiles.set(profile.channelId, profile);
  }

  get(channelId: string): AdaptiveRenderProfile | undefined {
    return this.profiles.get(channelId);
  }

  getLightingConfig(profile: AdaptiveRenderProfile): SceneLightingConfig {
    const intensityMap = { soft: 0.2, neutral: 0.4, dramatic: 0.7 };
    return {
      vignette: profile.lighting === "dramatic" ? 0.5 : 0.3,
      directionalLight: { angle: 45, intensity: intensityMap[profile.lighting] },
      glow: profile.lighting === "dramatic" ? 0.15 : 0.05,
      ambientLight: 0.8,
      fog: 0
    };
  }

  getSafeAreaBounds(profile: AdaptiveRenderProfile): SafeAreaBounds {
    return {
      top: 0.05, bottom: 0.1, left: 0.05, right: 0.05,
      subtitleZone: { x: 0.1, y: 1 - profile.subtitleSafeArea - 0.05, width: 0.8, height: profile.subtitleSafeArea }
    };
  }

  getAllProfiles(): AdaptiveRenderProfile[] {
    return Array.from(this.profiles.values());
  }
}
