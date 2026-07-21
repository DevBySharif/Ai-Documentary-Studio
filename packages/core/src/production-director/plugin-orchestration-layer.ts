import type { PDPluginCatalog } from "./types.js";

export class PDPluginOrchestrationLayer {
  private catalog: PDPluginCatalog = {
    llmProviders: ["openai", "gemini", "anthropic", "local"],
    imageGenerators: ["dalle", "midjourney", "stable_diffusion", "flux"],
    ttsEngines: ["piper", "kokoro", "coqui", "edge", "google_cloud", "elevenlabs"],
    transcriptionEngines: ["whisper", "whisperx"],
    renderBackends: ["ffmpeg", "remotion", "webgpu", "opengl"],
    qaModules: ["built_in", "custom"]
  };

  getCatalog(): PDPluginCatalog {
    return { ...this.catalog };
  }

  getLLMProviders(): string[] {
    return [...this.catalog.llmProviders];
  }

  getImageGenerators(): string[] {
    return [...this.catalog.imageGenerators];
  }

  getTTSEngines(): string[] {
    return [...this.catalog.ttsEngines];
  }

  replaceProvider(category: keyof PDPluginCatalog, newProvider: string, index: number): boolean {
    if (index < 0 || index >= this.catalog[category].length) return false;
    this.catalog[category][index] = newProvider;
    return true;
  }
}
