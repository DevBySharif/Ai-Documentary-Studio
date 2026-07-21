import {
  IPProviderName,
  IPImageRequest,
  IPImageResult,
} from "./types";

export interface IPProviderInterface {
  generate(request: IPImageRequest): Promise<IPImageResult>;
  isAvailable(): boolean;
  getName(): IPProviderName;
}

export class IPGoogleFlowAdapter implements IPProviderInterface {
  private available = true;

  getName(): IPProviderName {
    return "google_flow";
  }

  isAvailable(): boolean {
    return this.available;
  }

  async generate(request: IPImageRequest): Promise<IPImageResult> {
    const imageId = `google_flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      imageId,
      provider: "google_flow",
      promptUsed: request.prompt,
      seed: request.seed ?? Math.floor(Math.random() * 2147483647),
      styleLock: request.styleLock,
      characterLock: request.characterLock,
      validated: true,
      status: "completed",
      cost: 0.005,
      generationTime: 2500 + Math.random() * 1500,
    };
  }
}

export class IPGoogleImagenAdapter implements IPProviderInterface {
  private available = true;

  getName(): IPProviderName {
    return "google_imagen";
  }

  isAvailable(): boolean {
    return this.available;
  }

  async generate(request: IPImageRequest): Promise<IPImageResult> {
    const imageId = `imagen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      imageId,
      provider: "google_imagen",
      promptUsed: request.prompt,
      seed: request.seed ?? Math.floor(Math.random() * 2147483647),
      styleLock: request.styleLock,
      characterLock: request.characterLock,
      validated: true,
      status: "completed",
      cost: 0.008,
      generationTime: 3000 + Math.random() * 2000,
    };
  }
}

export class IPFLUXAdapter implements IPProviderInterface {
  private available = true;

  getName(): IPProviderName {
    return "flux";
  }

  isAvailable(): boolean {
    return this.available;
  }

  async generate(request: IPImageRequest): Promise<IPImageResult> {
    const imageId = `flux_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      imageId,
      provider: "flux",
      promptUsed: `FLUX style: ${request.prompt}`,
      seed: request.seed ?? Math.floor(Math.random() * 2147483647),
      styleLock: request.styleLock,
      characterLock: request.characterLock,
      validated: true,
      status: "completed",
      cost: 0.003,
      generationTime: 1800 + Math.random() * 1200,
    };
  }
}

export class IPStableDiffusionAdapter implements IPProviderInterface {
  private available = true;

  getName(): IPProviderName {
    return "stable_diffusion";
  }

  isAvailable(): boolean {
    return this.available;
  }

  async generate(request: IPImageRequest): Promise<IPImageResult> {
    const imageId = `sd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      imageId,
      provider: "stable_diffusion",
      promptUsed: `masterpiece, best quality, ${request.prompt}`,
      seed: request.seed ?? Math.floor(Math.random() * 2147483647),
      styleLock: request.styleLock,
      characterLock: request.characterLock,
      validated: true,
      status: "completed",
      cost: 0.004,
      generationTime: 4000 + Math.random() * 3000,
    };
  }
}

export class IPComfyUIAdapter implements IPProviderInterface {
  private available = true;

  getName(): IPProviderName {
    return "comfyui";
  }

  isAvailable(): boolean {
    return this.available;
  }

  async generate(request: IPImageRequest): Promise<IPImageResult> {
    const imageId = `comfyui_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      imageId,
      provider: "comfyui",
      promptUsed: request.prompt,
      seed: request.seed ?? Math.floor(Math.random() * 2147483647),
      styleLock: request.styleLock,
      characterLock: request.characterLock,
      validated: true,
      status: "completed",
      cost: 0.002,
      generationTime: 8000 + Math.random() * 5000,
    };
  }
}

export class IPFalAIAdapter implements IPProviderInterface {
  private available = true;

  getName(): IPProviderName {
    return "fal_ai";
  }

  isAvailable(): boolean {
    return this.available;
  }

  async generate(request: IPImageRequest): Promise<IPImageResult> {
    const imageId = `falai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      imageId,
      provider: "fal_ai",
      promptUsed: request.prompt,
      seed: request.seed ?? Math.floor(Math.random() * 2147483647),
      styleLock: request.styleLock,
      characterLock: request.characterLock,
      validated: true,
      status: "completed",
      cost: 0.006,
      generationTime: 2200 + Math.random() * 1800,
    };
  }
}

export class IPReplicateAdapter implements IPProviderInterface {
  private available = true;

  getName(): IPProviderName {
    return "replicate";
  }

  isAvailable(): boolean {
    return this.available;
  }

  async generate(request: IPImageRequest): Promise<IPImageResult> {
    const imageId = `replicate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      imageId,
      provider: "replicate",
      promptUsed: request.prompt,
      seed: request.seed ?? Math.floor(Math.random() * 2147483647),
      styleLock: request.styleLock,
      characterLock: request.characterLock,
      validated: true,
      status: "completed",
      cost: 0.0035,
      generationTime: 3500 + Math.random() * 2000,
    };
  }
}

export class IPProviderAbstraction {
  private adapters: Map<IPProviderName, IPProviderInterface> = new Map();

  constructor() {
    this.register(new IPGoogleFlowAdapter());
    this.register(new IPGoogleImagenAdapter());
    this.register(new IPFLUXAdapter());
    this.register(new IPStableDiffusionAdapter());
    this.register(new IPComfyUIAdapter());
    this.register(new IPFalAIAdapter());
    this.register(new IPReplicateAdapter());
  }

  register(adapter: IPProviderInterface): void {
    this.adapters.set(adapter.getName(), adapter);
  }

  get(name: IPProviderName): IPProviderInterface | undefined {
    return this.adapters.get(name);
  }

  getAvailable(): IPProviderInterface[] {
    const available: IPProviderInterface[] = [];
    for (const adapter of this.adapters.values()) {
      if (adapter.isAvailable()) {
        available.push(adapter);
      }
    }
    return available;
  }

  getAll(): Map<IPProviderName, IPProviderInterface> {
    return new Map(this.adapters);
  }
}
