import { IPProviderName } from "./types";

export type IPPromptAdapter = (prompt: string) => string;

export class IPPromptAdaptationEngine {
  private adapters: Map<IPProviderName, IPPromptAdapter> = new Map();

  constructor() {
    this.adapters.set("google_flow", (p) => `${p}`);
    this.adapters.set("google_imagen", (p) => `${p}`);
    this.adapters.set("flux", (p) => `FLUX style: ${p}`);
    this.adapters.set("stable_diffusion", (p) => `masterpiece, best quality, ${p}`);
    this.adapters.set("comfyui", (p) => `${p}`);
    this.adapters.set("fal_ai", (p) => `${p}`);
    this.adapters.set("replicate", (p) => `${p}`);
    this.adapters.set("midjourney", (p) => `imagine: ${p} --ar 16:9 --v 6`);
    this.adapters.set("black_forest_labs", (p) => `${p}`);
    this.adapters.set("ideogram", (p) => `${p}`);
    this.adapters.set("reve", (p) => `${p}`);
    this.adapters.set("openai_image", (p) => `${p}`);
  }

  adapt(masterPrompt: string, provider: IPProviderName): string {
    const adapter = this.adapters.get(provider);
    if (!adapter) {
      return masterPrompt;
    }
    return adapter(masterPrompt);
  }

  getAdapter(provider: IPProviderName): IPPromptAdapter {
    const adapter = this.adapters.get(provider);
    if (!adapter) {
      return (p: string) => p;
    }
    return adapter;
  }

  registerAdapter(provider: IPProviderName, adapter: IPPromptAdapter): void {
    this.adapters.set(provider, adapter);
  }
}
