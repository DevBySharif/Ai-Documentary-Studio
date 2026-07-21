import { VPProviderName } from "./types";

export interface VPProviderSettingsMap {
  sampleRate: number;
  outputFormat: string;
  speed: number;
  pitch: number;
  volume: number;
  emotion: string;
  stability: number;
  similarity: number;
}

const DEFAULT_SETTINGS: Record<VPProviderName, VPProviderSettingsMap> = {
  edge_tts: {
    sampleRate: 24000,
    outputFormat: "audio-24khz-48kbitrate-mono-mp3",
    speed: 1.0,
    pitch: 0,
    volume: 0,
    emotion: "neutral",
    stability: 0.8,
    similarity: 0.7,
  },
  piper: {
    sampleRate: 22050,
    outputFormat: "wav",
    speed: 1.0,
    pitch: 0,
    volume: 0,
    emotion: "neutral",
    stability: 0.9,
    similarity: 0.5,
  },
  kokoro: {
    sampleRate: 24000,
    outputFormat: "wav",
    speed: 1.0,
    pitch: 0,
    volume: 0,
    emotion: "neutral",
    stability: 0.85,
    similarity: 0.75,
  },
  google_cloud_tts: {
    sampleRate: 24000,
    outputFormat: "mp3",
    speed: 1.0,
    pitch: 0,
    volume: 0,
    emotion: "neutral",
    stability: 0.9,
    similarity: 0.8,
  },
  azure_speech: {
    sampleRate: 24000,
    outputFormat: "riff-24khz-16bit-mono-pcm",
    speed: 1.0,
    pitch: 0,
    volume: 0,
    emotion: "neutral",
    stability: 0.85,
    similarity: 0.75,
  },
  elevenlabs: {
    sampleRate: 44100,
    outputFormat: "mp3_44100_128",
    speed: 1.0,
    pitch: 0,
    volume: 0,
    emotion: "neutral",
    stability: 0.5,
    similarity: 0.75,
  },
  openai_tts: {
    sampleRate: 24000,
    outputFormat: "mp3",
    speed: 1.0,
    pitch: 0,
    volume: 0,
    emotion: "neutral",
    stability: 0.7,
    similarity: 0.7,
  },
  amazon_polly: {
    sampleRate: 24000,
    outputFormat: "mp3",
    speed: 1.0,
    pitch: 0,
    volume: 0,
    emotion: "neutral",
    stability: 0.85,
    similarity: 0.7,
  },
  coqui: {
    sampleRate: 24000,
    outputFormat: "wav",
    speed: 1.0,
    pitch: 0,
    volume: 0,
    emotion: "neutral",
    stability: 0.8,
    similarity: 0.6,
  },
  cartesia: {
    sampleRate: 44100,
    outputFormat: "wav",
    speed: 1.0,
    pitch: 0,
    volume: 0,
    emotion: "neutral",
    stability: 0.75,
    similarity: 0.8,
  },
  playht: {
    sampleRate: 24000,
    outputFormat: "mp3",
    speed: 1.0,
    pitch: 0,
    volume: 0,
    emotion: "neutral",
    stability: 0.7,
    similarity: 0.7,
  },
  local_neural: {
    sampleRate: 24000,
    outputFormat: "wav",
    speed: 1.0,
    pitch: 0,
    volume: 0,
    emotion: "neutral",
    stability: 0.9,
    similarity: 0.5,
  },
};

export class VPProviderSettings {
  private overrides: Map<string, Record<string, unknown>> = new Map();

  private makeKey(provider: VPProviderName, key: string): string {
    return `${provider}:${key}`;
  }

  set(provider: VPProviderName, key: string, value: unknown): void {
    const mapKey = this.makeKey(provider, key);
    const existing = this.overrides.get(mapKey) || {};
    (existing as Record<string, unknown>)[key] = value;
    this.overrides.set(mapKey, existing);
  }

  get(provider: VPProviderName, key: string): unknown {
    const defaults = DEFAULT_SETTINGS[provider];
    const mapKey = this.makeKey(provider, key);
    const override = this.overrides.get(mapKey);
    if (override && key in override) {
      return (override as Record<string, unknown>)[key];
    }
    if (defaults && key in defaults) {
      return (defaults as unknown as Record<string, unknown>)[key];
    }
    return undefined;
  }

  getDefaults(provider: VPProviderName): Record<string, unknown> {
    const defaults = DEFAULT_SETTINGS[provider];
    if (!defaults) return {};
    return { ...(defaults as unknown as Record<string, unknown>) };
  }

  getNumber(provider: VPProviderName, key: string): number {
    const val = this.get(provider, key);
    return typeof val === "number" ? val : 0;
  }

  getString(provider: VPProviderName, key: string): string {
    const val = this.get(provider, key);
    return typeof val === "string" ? val : "";
  }

  reset(provider: VPProviderName, key?: string): void {
    if (key) {
      const mapKey = this.makeKey(provider, key);
      this.overrides.delete(mapKey);
    } else {
      for (const mapKey of this.overrides.keys()) {
        if (mapKey.startsWith(`${provider}:`)) {
          this.overrides.delete(mapKey);
        }
      }
    }
  }

  resetAll(): void {
    this.overrides.clear();
  }

  getAllSettings(provider: VPProviderName): VPProviderSettingsMap {
    const defaults = DEFAULT_SETTINGS[provider];
    if (!defaults) {
      return {
        sampleRate: 24000,
        outputFormat: "mp3",
        speed: 1.0,
        pitch: 0,
        volume: 0,
        emotion: "neutral",
        stability: 0.8,
        similarity: 0.7,
      };
    }
    const result = { ...defaults };
    for (const key of Object.keys(result)) {
      const val = this.get(provider, key);
      if (val !== undefined) {
        (result as Record<string, unknown>)[key] = val;
      }
    }
    return result;
  }
}
