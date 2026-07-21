import type { MPProvider, MPProviderCategory } from "./types.js";

export class MPProviderAbstraction {
  private providers: Map<string, MPProvider> = new Map();

  register(category: MPProviderCategory, name: string, capabilities: string[]): void {
    this.providers.set(`${category}:${name}`, { category, name, enabled: true, capabilities });
  }

  getProviders(category: MPProviderCategory): MPProvider[] {
    return Array.from(this.providers.values()).filter((p) => p.category === category);
  }

  getEnabledProviders(category: MPProviderCategory): MPProvider[] {
    return this.getProviders(category).filter((p) => p.enabled);
  }

  enable(category: MPProviderCategory, name: string): void {
    const key = `${category}:${name}`;
    const p = this.providers.get(key);
    if (p) p.enabled = true;
  }

  disable(category: MPProviderCategory, name: string): void {
    const key = `${category}:${name}`;
    const p = this.providers.get(key);
    if (p) p.enabled = false;
  }

  getDefaultCapabilities(category: MPProviderCategory): string[] {
    const map: Record<MPProviderCategory, string[]> = {
      llm: ["text_generation", "analysis"],
      image_generator: ["text_to_image"],
      tts: ["text_to_speech"],
      stt: ["speech_to_text"],
      renderer: ["video_encoding"],
      storage: ["file_read", "file_write"]
    };
    return map[category];
  }
}
