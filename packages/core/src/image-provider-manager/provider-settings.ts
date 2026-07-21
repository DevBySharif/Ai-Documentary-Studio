import { IPProviderName } from "./types";

export interface IPProviderSettingValues {
  resolution: string;
  guidanceStrength: number;
  seedControl: boolean;
  styleStrength: number;
  inferenceQuality: string;
  timeout: number;
  retryPolicy: "none" | "basic" | "aggressive";
}

export class IPProviderSettings {
  private settings: Map<IPProviderName, Map<string, unknown>> = new Map();
  private defaults: Map<IPProviderName, IPProviderSettingValues> = new Map();

  constructor() {
    for (const provider of [
      "google_flow",
      "google_imagen",
      "flux",
      "stable_diffusion",
      "comfyui",
      "fal_ai",
      "replicate",
      "midjourney",
      "black_forest_labs",
      "ideogram",
      "reve",
      "openai_image",
    ] as IPProviderName[]) {
      this.defaults.set(provider, {
        resolution: "1024x1024",
        guidanceStrength: 7.0,
        seedControl: true,
        styleStrength: 1.0,
        inferenceQuality: "standard",
        timeout: 60000,
        retryPolicy: "basic",
      });
    }
  }

  set(provider: IPProviderName, key: string, value: unknown): void {
    if (!this.settings.has(provider)) {
      this.settings.set(provider, new Map());
    }
    this.settings.get(provider)!.set(key, value);
  }

  get(provider: IPProviderName, key: string): unknown {
    const overrides = this.settings.get(provider);
    if (overrides?.has(key)) {
      return overrides.get(key);
    }
    const defaults = this.defaults.get(provider);
    if (defaults && key in defaults) {
      return (defaults as unknown as Record<string, unknown>)[key];
    }
    return undefined;
  }

  getDefaults(provider: IPProviderName): IPProviderSettingValues {
    const defaults = this.defaults.get(provider);
    if (!defaults) {
      return {
        resolution: "1024x1024",
        guidanceStrength: 7.0,
        seedControl: true,
        styleStrength: 1.0,
        inferenceQuality: "standard",
        timeout: 60000,
        retryPolicy: "basic",
      };
    }
    return { ...defaults };
  }

  getAllSettings(provider: IPProviderName): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    const defaults = this.defaults.get(provider);
    if (defaults) {
      Object.assign(result, defaults);
    }
    const overrides = this.settings.get(provider);
    if (overrides) {
      for (const [key, value] of overrides) {
        result[key] = value;
      }
    }
    return result;
  }

  reset(provider: IPProviderName): void {
    this.settings.delete(provider);
  }
}
