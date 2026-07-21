import {
  VPProviderName,
  VPNarrationRequest,
  VPNarrationResult,
  VPLanguage,
  VPTimingData,
} from "./types";

export interface VPProviderInterface {
  generate(request: VPNarrationRequest): Promise<VPNarrationResult>;
  isAvailable(): boolean;
  getName(): VPProviderName;
  supportsSSML(): boolean;
  supportsEmotion(): boolean;
}

function generateTiming(script: string, duration: number): VPTimingData {
  const words = script.split(/\s+/).filter(Boolean);
  const sentences = script.split(/[.!?]+/).filter(Boolean);
  const wordCount = words.length;
  const sentenceCount = sentences.length;
  const avgWordDuration = duration / Math.max(wordCount, 1);
  const avgSentenceDuration = duration / Math.max(sentenceCount, 1);

  let wordCursor = 0;
  const wordTimestamps = words.map((word) => {
    const start = wordCursor;
    const end = start + avgWordDuration;
    wordCursor = end;
    return { start: Math.round(start * 1000) / 1000, end: Math.round(end * 1000) / 1000, word };
  });

  let sentenceCursor = 0;
  const sentenceTimestamps = sentences.map((sentence) => {
    const start = sentenceCursor;
    const end = start + avgSentenceDuration;
    sentenceCursor = end;
    return { start: Math.round(start * 1000) / 1000, end: Math.round(end * 1000) / 1000, text: sentence.trim() };
  });

  const phraseCount = Math.min(sentenceCount * 2, wordCount);
  const avgPhraseDuration = duration / Math.max(phraseCount, 1);
  let phraseCursor = 0;
  const phraseTimestamps = [];
  for (let i = 0; i < phraseCount && i < wordCount; i++) {
    const start = phraseCursor;
    const end = start + avgPhraseDuration;
    phraseCursor = end;
    phraseTimestamps.push({
      start: Math.round(start * 1000) / 1000,
      end: Math.round(end * 1000) / 1000,
      text: words.slice(i * Math.floor(wordCount / phraseCount), (i + 1) * Math.floor(wordCount / phraseCount)).join(" "),
    });
  }

  return { sentenceTimestamps, phraseTimestamps, wordTimestamps };
}

function calculateDuration(script: string, speed: number): number {
  const wordCount = script.split(/\s+/).filter(Boolean).length;
  const baseRate = 150;
  const wpm = baseRate * speed;
  return Math.max((wordCount / wpm) * 60, 0.5);
}

function generateNarrationId(provider: VPProviderName): string {
  return `nar_${provider}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

class BaseAdapter implements VPProviderInterface {
  protected name: VPProviderName;
  protected ssml: boolean;
  protected emotion: boolean;
  protected available: boolean;

  constructor(name: VPProviderName, ssml: boolean, emotion: boolean, available = true) {
    this.name = name;
    this.ssml = ssml;
    this.emotion = emotion;
    this.available = available;
  }

  async generate(request: VPNarrationRequest): Promise<VPNarrationResult> {
    const duration = calculateDuration(request.script, request.speed);
    const timingData = generateTiming(request.script, duration);
    const cost = this.calculateCost(duration);
    return {
      narrationId: generateNarrationId(this.name),
      provider: this.name,
      voiceId: request.voiceId,
      language: request.language,
      duration,
      timingData,
      ssml: request.ssml || "",
      validated: false,
      status: "completed",
      cost,
    };
  }

  protected calculateCost(_duration: number): number {
    return 0;
  }

  isAvailable(): boolean {
    return this.available;
  }

  getName(): VPProviderName {
    return this.name;
  }

  supportsSSML(): boolean {
    return this.ssml;
  }

  supportsEmotion(): boolean {
    return this.emotion;
  }
}

export class VPEdgeTTSAdapter extends BaseAdapter {
  constructor() {
    super("edge_tts", true, false);
  }
}

export class VPPiperAdapter extends BaseAdapter {
  constructor() {
    super("piper", false, false);
  }

  protected calculateCost(duration: number): number {
    return 0;
  }
}

export class VPKokoroAdapter extends BaseAdapter {
  constructor() {
    super("kokoro", true, true);
  }
}

export class VPGoogleCloudTTSAdapter extends BaseAdapter {
  constructor() {
    super("google_cloud_tts", true, true);
  }

  protected calculateCost(duration: number): number {
    return duration * 0.000004;
  }
}

export class VPAzureSpeechAdapter extends BaseAdapter {
  constructor() {
    super("azure_speech", true, true);
  }

  protected calculateCost(duration: number): number {
    return duration * 0.000015;
  }
}

export class VPElevenLabsAdapter extends BaseAdapter {
  constructor() {
    super("elevenlabs", true, true);
  }

  protected calculateCost(duration: number): number {
    return duration * 0.0003;
  }
}

export class VPOpenAITTSAdapter extends BaseAdapter {
  constructor() {
    super("openai_tts", true, true);
  }

  protected calculateCost(duration: number): number {
    return duration * 0.000015;
  }
}

export class VPProviderAbstraction {
  private providers: Map<VPProviderName, VPProviderInterface> = new Map();

  constructor() {
    this.register(new VPEdgeTTSAdapter());
    this.register(new VPPiperAdapter());
    this.register(new VPKokoroAdapter());
    this.register(new VPGoogleCloudTTSAdapter());
    this.register(new VPAzureSpeechAdapter());
    this.register(new VPElevenLabsAdapter());
    this.register(new VPOpenAITTSAdapter());
  }

  get(name: VPProviderName): VPProviderInterface | undefined {
    return this.providers.get(name);
  }

  getAvailable(): VPProviderInterface[] {
    return Array.from(this.providers.values()).filter((p) => p.isAvailable());
  }

  register(adapter: VPProviderInterface): void {
    this.providers.set(adapter.getName(), adapter);
  }

  getAll(): VPProviderInterface[] {
    return Array.from(this.providers.values());
  }
}
