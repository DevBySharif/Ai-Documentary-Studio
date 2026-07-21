import type { TTSProviderName, TTSConfig, VoiceDNAProfile } from "./types.js";

export interface TTSProvider {
  name: TTSProviderName;
  synthesize(text: string, config: TTSConfig): Promise<ArrayBuffer>;
  getAvailableVoices(): Promise<string[]>;
  isAvailable(): boolean;
}

class KokoroProvider implements TTSProvider {
  name: TTSProviderName = "kokoro";
  async synthesize(_text: string, _config: TTSConfig): Promise<ArrayBuffer> {
    throw new Error("Kokoro TTS not yet connected");
  }
  async getAvailableVoices(): Promise<string[]> {
    return ["kokoro_default"];
  }
  isAvailable(): boolean { return false; }
}

class PiperProvider implements TTSProvider {
  name: TTSProviderName = "piper";
  async synthesize(_text: string, _config: TTSConfig): Promise<ArrayBuffer> {
    throw new Error("Piper TTS not yet connected");
  }
  async getAvailableVoices(): Promise<string[]> {
    return ["piper_default"];
  }
  isAvailable(): boolean { return false; }
}

class EdgeTTSProvider implements TTSProvider {
  name: TTSProviderName = "edge_tts";
  async synthesize(_text: string, _config: TTSConfig): Promise<ArrayBuffer> {
    throw new Error("Edge-TTS not yet connected");
  }
  async getAvailableVoices(): Promise<string[]> {
    return ["en-US-JennyNeural", "en-US-GuyNeural"];
  }
  isAvailable(): boolean { return false; }
}

class OpenAIProvider implements TTSProvider {
  name: TTSProviderName = "openai";
  async synthesize(_text: string, _config: TTSConfig): Promise<ArrayBuffer> {
    throw new Error("OpenAI TTS not yet connected");
  }
  async getAvailableVoices(): Promise<string[]> {
    return ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
  }
  isAvailable(): boolean { return false; }
}

class GoogleProvider implements TTSProvider {
  name: TTSProviderName = "google";
  async synthesize(_text: string, _config: TTSConfig): Promise<ArrayBuffer> {
    throw new Error("Google TTS not yet connected");
  }
  async getAvailableVoices(): Promise<string[]> {
    return ["en-US-Wavenet-D", "en-US-Wavenet-F"];
  }
  isAvailable(): boolean { return false; }
}

class ElevenLabsProvider implements TTSProvider {
  name: TTSProviderName = "elevenlabs";
  async synthesize(_text: string, _config: TTSConfig): Promise<ArrayBuffer> {
    throw new Error("ElevenLabs TTS not yet connected");
  }
  async getAvailableVoices(): Promise<string[]> {
    return ["elevenlabs_default"];
  }
  isAvailable(): boolean { return false; }
}

export class TTSProviderFactory {
  private providers = new Map<TTSProviderName, TTSProvider>();
  private defaultProvider: TTSProviderName = "edge_tts";

  constructor() {
    this.register(new KokoroProvider());
    this.register(new PiperProvider());
    this.register(new EdgeTTSProvider());
    this.register(new OpenAIProvider());
    this.register(new GoogleProvider());
    this.register(new ElevenLabsProvider());
  }

  register(provider: TTSProvider): void {
    this.providers.set(provider.name, provider);
  }

  get(name?: TTSProviderName): TTSProvider {
    const provider = this.providers.get(name || this.defaultProvider);
    if (!provider) throw new Error(`TTS provider ${name || this.defaultProvider} not found`);
    return provider;
  }

  setDefault(name: TTSProviderName): void {
    this.defaultProvider = name;
  }

  listAvailable(): TTSProviderName[] {
    return Array.from(this.providers.keys());
  }

  createConfig(voiceDNA: VoiceDNAProfile): TTSConfig {
    return {
      provider: this.defaultProvider,
      voice: voiceDNA.voiceModel,
      speed: voiceDNA.speechRate,
      pitch: voiceDNA.pitch,
      language: "en",
    };
  }
}
