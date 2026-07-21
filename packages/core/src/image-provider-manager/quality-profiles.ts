import { IPQualityLevel } from "./types";

export interface IPQualityProfile {
  resolution: string;
  steps: number;
  cfgScale: number;
  sampler: string;
}

export class IPQualityProfiles {
  private profiles: Map<IPQualityLevel, IPQualityProfile> = new Map([
    [
      "draft",
      {
        resolution: "512x512",
        steps: 12,
        cfgScale: 5.0,
        sampler: "euler",
      },
    ],
    [
      "standard",
      {
        resolution: "1024x1024",
        steps: 25,
        cfgScale: 7.0,
        sampler: "euler_a",
      },
    ],
    [
      "high",
      {
        resolution: "1536x1536",
        steps: 40,
        cfgScale: 7.5,
        sampler: "dpmpp_2m",
      },
    ],
    [
      "ultra",
      {
        resolution: "2048x2048",
        steps: 60,
        cfgScale: 8.0,
        sampler: "dpmpp_3m_sde",
      },
    ],
  ]);

  getProfile(level: IPQualityLevel): IPQualityProfile {
    const profile = this.profiles.get(level);
    if (!profile) {
      return this.profiles.get("standard")!;
    }
    return { ...profile };
  }

  setProfile(level: IPQualityLevel, profile: IPQualityProfile): void {
    this.profiles.set(level, { ...profile });
  }

  getAllProfiles(): Map<IPQualityLevel, IPQualityProfile> {
    return new Map(this.profiles);
  }
}
