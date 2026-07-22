import { AIProviderManager, FallbackAttemptLog } from './ai-provider-manager.js';
import { DocumentaryPromptOutput } from './prompt-service.js';

export interface ScriptNarrationCue {
  id: string;
  sceneIndex: number;
  speaker: string;
  text: string;
  startTimeMs: number;
  durationMs: number;
}

export interface ScriptImagePromptCue {
  id: string;
  sceneIndex: number;
  prompt: string;
  artStyle: string;
  aspectRatio: string;
}

export interface ScriptVoiceCue {
  id: string;
  sceneIndex: number;
  voiceId: string;
  narratorType: string;
  speedMultiplier: number;
  pitchAdjustment: number;
}

export interface ScriptTimelineMarker {
  id: string;
  timeMs: number;
  label: string;
  markerType: 'SCENE_TRANSITION' | 'AUDIO_BEAT' | 'CHAPTER_START';
}

export interface ScriptSubtitleCue {
  id: string;
  startTimeMs: number;
  endTimeMs: number;
  text: string;
}

export interface ScriptSceneDocument {
  sceneIndex: number;
  title: string;
  summary: string;
  startTimeMs: number;
  durationMs: number;
  narrationCues: ScriptNarrationCue[];
  imagePrompts: ScriptImagePromptCue[];
  voiceCues: ScriptVoiceCue[];
}

export interface DocumentaryScriptDocument {
  id: string;
  topic: string;
  tone: string;
  language: string;
  totalDurationMs: number;
  scenes: ScriptSceneDocument[];
  timelineMarkers: ScriptTimelineMarker[];
  subtitleCues: ScriptSubtitleCue[];
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
  metadata: {
    generatedAt: string;
    version: number;
  };
}

export class ScriptService {
  constructor(private readonly providerManager: AIProviderManager) {}

  public async generateScript(promptPack: DocumentaryPromptOutput): Promise<DocumentaryScriptDocument> {
    const userPrompt = `Formulate complete documentary narration text and scene structure for topic "${promptPack.topic}". Hook: "${promptPack.narrativeStructure.hook}".`;
    const systemPrompt = `You are a documentary lead writer. Return valid JSON narration script.`;

    const telemetryResult = await this.providerManager.generateTextWithTelemetry(
      userPrompt,
      { systemPrompt, maxTokens: 2000 },
      promptPack.telemetry?.providerUsed
    );

    const { result, attempts } = telemetryResult;

    const scriptId = `script-${Date.now()}`;
    const scenes: ScriptSceneDocument[] = promptPack.scenePrompts.map((sp, idx) => {
      const sceneIndex = idx + 1;
      const startTimeMs = idx * 15000;
      const durationMs = 15000;

      const narrationCue: ScriptNarrationCue = {
        id: `narr-${scriptId}-${sceneIndex}`,
        sceneIndex,
        speaker: 'Historian Narrator',
        text: `Scene ${sceneIndex}: ${sp.title}. In this pivotal chapter of ${promptPack.topic}, history was dramatically rewritten.`,
        startTimeMs,
        durationMs
      };

      const imagePromptCue: ScriptImagePromptCue = {
        id: `img-${scriptId}-${sceneIndex}`,
        sceneIndex,
        prompt: sp.imagePrompt,
        artStyle: sp.suggestedArtStyle,
        aspectRatio: promptPack.globalStyleRules.aspectRatio
      };

      const voiceCue: ScriptVoiceCue = {
        id: `voice-${scriptId}-${sceneIndex}`,
        sceneIndex,
        voiceId: 'deep-british-male',
        narratorType: 'Historical Narrator',
        speedMultiplier: 1.0,
        pitchAdjustment: 0.0
      };

      return {
        sceneIndex,
        title: sp.title,
        summary: sp.visualConcept,
        startTimeMs,
        durationMs,
        narrationCues: [narrationCue],
        imagePrompts: [imagePromptCue],
        voiceCues: [voiceCue]
      };
    });

    const totalDurationMs = scenes.length * 15000;

    const timelineMarkers: ScriptTimelineMarker[] = scenes.map(s => ({
      id: `mark-${scriptId}-${s.sceneIndex}`,
      timeMs: s.startTimeMs,
      label: s.title,
      markerType: 'CHAPTER_START'
    }));

    const subtitleCues: ScriptSubtitleCue[] = scenes.flatMap(s =>
      s.narrationCues.map(n => ({
        id: `sub-${n.id}`,
        startTimeMs: n.startTimeMs,
        endTimeMs: n.startTimeMs + n.durationMs,
        text: n.text
      }))
    );

    return {
      id: scriptId,
      topic: promptPack.topic,
      tone: promptPack.tone,
      language: promptPack.language,
      totalDurationMs,
      scenes,
      timelineMarkers,
      subtitleCues,
      telemetry: {
        providerUsed: result.provider,
        model: result.model,
        latencyMs: result.latencyMs,
        costEstimateUsd: result.costEstimateUsd,
        responseId: result.responseId,
        usage: result.usage,
        fallbackAttempts: attempts
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        version: 1
      }
    };
  }
}
