import type { AIntTTSConfig } from "./types.js";

export interface AIntTTSProvider {
  name: string;
  synthesize(text: string, config: AIntTTSConfig): Promise<ArrayBuffer>;
  getVoices(): Promise<string[]>;
  isAvailable(): boolean;
}

export class AIntPiperProvider implements AIntTTSProvider {
  name = "piper";
  async synthesize(_text: string, _config: AIntTTSConfig): Promise<ArrayBuffer> { return new ArrayBuffer(0); }
  async getVoices(): Promise<string[]> { return ["default"]; }
  isAvailable(): boolean { return true; }
}

export class AIntKokoroProvider implements AIntTTSProvider {
  name = "kokoro";
  async synthesize(_text: string, _config: AIntTTSConfig): Promise<ArrayBuffer> { return new ArrayBuffer(0); }
  async getVoices(): Promise<string[]> { return ["kokoro_default"]; }
  isAvailable(): boolean { return true; }
}

export class AIntCoquiProvider implements AIntTTSProvider {
  name = "coqui";
  async synthesize(_text: string, _config: AIntTTSConfig): Promise<ArrayBuffer> { return new ArrayBuffer(0); }
  async getVoices(): Promise<string[]> { return ["coqui_default"]; }
  isAvailable(): boolean { return true; }
}

export class AIntEdgeTTSProvider implements AIntTTSProvider {
  name = "edge_tts";
  async synthesize(_text: string, _config: AIntTTSConfig): Promise<ArrayBuffer> { return new ArrayBuffer(0); }
  async getVoices(): Promise<string[]> { return ["en-US-JennyNeural", "en-US-GuyNeural"]; }
  isAvailable(): boolean { return true; }
}

export class AIntGoogleCloudProvider implements AIntTTSProvider {
  name = "google_cloud";
  async synthesize(_text: string, _config: AIntTTSConfig): Promise<ArrayBuffer> { return new ArrayBuffer(0); }
  async getVoices(): Promise<string[]> { return ["en-US-Wavenet-D", "en-US-Wavenet-J"]; }
  isAvailable(): boolean { return true; }
}

export class AIntElevenLabsProvider implements AIntTTSProvider {
  name = "elevenlabs";
  async synthesize(_text: string, _config: AIntTTSConfig): Promise<ArrayBuffer> { return new ArrayBuffer(0); }
  async getVoices(): Promise<string[]> { return ["21m00Tcm4TlvDq8ikWAM", "AZnzlk1XvdvUeBnXmlld"]; }
  isAvailable(): boolean { return true; }
}

export class AIntTTSManager {
  private providers = new Map<string, AIntTTSProvider>();

  constructor() {
    this.register(new AIntPiperProvider());
    this.register(new AIntKokoroProvider());
    this.register(new AIntCoquiProvider());
    this.register(new AIntEdgeTTSProvider());
    this.register(new AIntGoogleCloudProvider());
    this.register(new AIntElevenLabsProvider());
  }

  register(provider: AIntTTSProvider): void {
    this.providers.set(provider.name, provider);
  }

  getProvider(name: string): AIntTTSProvider | undefined {
    return this.providers.get(name);
  }

  getAvailableProviders(): AIntTTSProvider[] {
    return Array.from(this.providers.values()).filter((p) => p.isAvailable());
  }

  async synthesize(text: string, config: AIntTTSConfig): Promise<ArrayBuffer> {
    const provider = this.providers.get(config.provider);
    if (!provider) throw new Error(`TTS provider '${config.provider}' not found`);
    return provider.synthesize(text, config);
  }
}
