import { AIProviderManager, FallbackAttemptLog } from './ai-provider-manager.js';

export interface DocumentaryPromptInput {
  topic: string;
  tone?: string;
  language?: string;
  channelDnaId?: string;
  preferredProvider?: string;
}

export interface ScenePromptSpec {
  sceneIndex: number;
  title: string;
  visualConcept: string;
  imagePrompt: string;
  suggestedArtStyle: string;
  cameraMotionPreset: string;
}

export interface DocumentaryPromptOutput {
  topic: string;
  tone: string;
  language: string;
  narrativeStructure: {
    hook: string;
    thesis: string;
    climax: string;
    resolution: string;
  };
  globalStyleRules: {
    visualPreset: string;
    aspectRatio: string;
    colorPalette: string;
  };
  scenePrompts: ScenePromptSpec[];
  telemetry: {
    providerUsed: string;
    model: string;
    latencyMs: number;
    costEstimateUsd: number;
    responseId?: string;
    usage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
    fallbackAttempts: FallbackAttemptLog[];
  };
  generatedAt: string;
}

export class PromptService {
  constructor(private readonly providerManager: AIProviderManager) {}

  public async generatePromptPack(input: DocumentaryPromptInput): Promise<DocumentaryPromptOutput> {
    const topic = input.topic || 'Historical Documentary';
    const tone = input.tone || 'Dramatic History';
    const language = input.language || 'en';

    const systemPrompt = `You are a documentary visual director. Return ONLY valid JSON with keys: narrativeStructure (hook, thesis, climax, resolution), globalStyleRules (visualPreset, aspectRatio, colorPalette), and scenePrompts (array of {sceneIndex, title, visualConcept, imagePrompt, suggestedArtStyle, cameraMotionPreset}). No markdown formatting, no code ticks.`;
    const userPrompt = `Formulate documentary prompt pack for topic "${topic}", tone "${tone}", language "${language}".`;

    const telemetryResult = await this.providerManager.generateTextWithTelemetry(
      userPrompt,
      { systemPrompt, maxTokens: 1500 },
      input.preferredProvider
    );

    const { result, attempts } = telemetryResult;

    let parsed: any = {};
    try {
      const cleanJsonText = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanJsonText);
    } catch (e) {
      parsed = {
        narrativeStructure: {
          hook: `In the shadow of historical archives, the secret story of ${topic} was forged...`,
          thesis: `Power, ambition, and strategic warfare defined ${topic}.`,
          climax: `The fateful turning point where the outcome of ${topic} hung in the balance.`,
          resolution: `How the legacy of ${topic} echoes in modern civilization.`
        },
        globalStyleRules: {
          visualPreset: `${tone} Cinematic 35mm Film Grain`,
          aspectRatio: "16:9",
          colorPalette: "Deep Amber, Shadowed Bronze, Muted Crimson"
        },
        scenePrompts: [
          {
            sceneIndex: 1,
            title: `Scene 1: Dawn of ${topic}`,
            visualConcept: `Wide establishing shot during the era of ${topic}`,
            imagePrompt: `Wide cinematic establishing shot of ${topic}, 35mm film texture, 8k resolution`,
            suggestedArtStyle: "Cinematic Archival",
            cameraMotionPreset: "SLOW_ZOOM_IN"
          }
        ]
      };
    }

    return {
      topic,
      tone,
      language,
      narrativeStructure: parsed.narrativeStructure || {
        hook: `Narrative hook for ${topic}`,
        thesis: `Thesis for ${topic}`,
        climax: `Climax for ${topic}`,
        resolution: `Resolution for ${topic}`
      },
      globalStyleRules: parsed.globalStyleRules || {
        visualPreset: `${tone} Cinematic`,
        aspectRatio: "16:9",
        colorPalette: "Cinematic Gold & Charcoal"
      },
      scenePrompts: parsed.scenePrompts || [
        {
          sceneIndex: 1,
          title: `Scene 1: ${topic}`,
          visualConcept: `Visual concept for ${topic}`,
          imagePrompt: `Cinematic image prompt for ${topic}`,
          suggestedArtStyle: "Cinematic",
          cameraMotionPreset: "SLOW_ZOOM_IN"
        }
      ],
      telemetry: {
        providerUsed: result.provider,
        model: result.model,
        latencyMs: result.latencyMs,
        costEstimateUsd: result.costEstimateUsd,
        responseId: result.responseId,
        usage: result.usage,
        fallbackAttempts: attempts
      },
      generatedAt: new Date().toISOString()
    };
  }
}
