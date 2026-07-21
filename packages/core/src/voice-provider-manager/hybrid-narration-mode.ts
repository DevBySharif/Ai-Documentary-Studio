import {
  VPProviderName,
  VPNarrationRequest,
  VPNarrationResult,
  VPLanguage,
} from "./types";
import { VPProviderAbstraction } from "./provider-abstraction";

export interface VPHybridSegment {
  segmentId: string;
  script: string;
  provider: VPProviderName;
  request: Partial<VPNarrationRequest>;
}

export class VPHybridNarrationMode {
  private segments: Map<string, VPHybridSegment> = new Map();
  private providerAbstraction: VPProviderAbstraction;

  constructor(providerAbstraction: VPProviderAbstraction) {
    this.providerAbstraction = providerAbstraction;
  }

  setSegment(segmentId: string, provider: VPProviderName): void {
    const existing = this.segments.get(segmentId);
    if (existing) {
      existing.provider = provider;
    } else {
      this.segments.set(segmentId, {
        segmentId,
        script: "",
        provider,
        request: {},
      });
    }
  }

  removeSegment(segmentId: string): boolean {
    return this.segments.delete(segmentId);
  }

  async generateHybrid(
    script: string,
    segments: VPHybridSegment[]
  ): Promise<VPNarrationResult[]> {
    const results: VPNarrationResult[] = [];

    for (const segment of segments) {
      this.segments.set(segment.segmentId, { ...segment });
      const provider = this.providerAbstraction.get(segment.provider);
      if (!provider || !provider.isAvailable()) {
        results.push(this.createFailedResult(segment));
        continue;
      }

      const request: VPNarrationRequest = {
        script: segment.script || script,
        language: segment.request.language || "english",
        voiceId: (segment.request.voiceId as string) || "default",
        speakingStyle: (segment.request.speakingStyle as any) || "neutral",
        speed: (segment.request.speed as number) || 1.0,
        pitch: (segment.request.pitch as number) || 0,
        emotionProfile: (segment.request.emotionProfile as any) || "neutral",
        ssml: (segment.request.ssml as string) || "",
        channelDnaVersion: (segment.request.channelDnaVersion as string) || "",
        outputFormat: (segment.request.outputFormat as string) || "mp3",
      };

      try {
        const result = await provider.generate(request);
        results.push(result);
      } catch {
        results.push(this.createFailedResult(segment));
      }
    }

    return results;
  }

  mergeNarration(segments: VPNarrationResult[]): VPNarrationResult {
    if (segments.length === 0) {
      return {
        narrationId: `hybrid_empty_${Date.now()}`,
        provider: "edge_tts",
        voiceId: "default",
        language: "english",
        duration: 0,
        timingData: {
          sentenceTimestamps: [],
          phraseTimestamps: [],
          wordTimestamps: [],
        },
        ssml: "",
        validated: false,
        status: "completed",
        cost: 0,
      };
    }

    if (segments.length === 1) {
      return { ...segments[0] };
    }

    let totalDuration = 0;
    let totalCost = 0;
    const allSentences: { start: number; end: number; text: string }[] = [];
    const allPhrases: { start: number; end: number; text: string }[] = [];
    const allWords: { start: number; end: number; word: string }[] = [];
    let offset = 0;

    for (const seg of segments) {
      totalDuration += seg.duration;
      totalCost += seg.cost;

      for (const st of seg.timingData.sentenceTimestamps) {
        allSentences.push({
          start: st.start + offset,
          end: st.end + offset,
          text: st.text,
        });
      }
      for (const pt of seg.timingData.phraseTimestamps) {
        allPhrases.push({
          start: pt.start + offset,
          end: pt.end + offset,
          text: pt.text,
        });
      }
      for (const wt of seg.timingData.wordTimestamps) {
        allWords.push({
          start: wt.start + offset,
          end: wt.end + offset,
          word: wt.word,
        });
      }
      offset += seg.duration;
    }

    const ssml = segments
      .map((s) => s.ssml)
      .filter(Boolean)
      .join("");

    return {
      narrationId: `hybrid_merged_${Date.now()}`,
      provider: "edge_tts",
      voiceId: segments[0].voiceId,
      language: segments[0].language,
      duration: totalDuration,
      timingData: {
        sentenceTimestamps: allSentences,
        phraseTimestamps: allPhrases,
        wordTimestamps: allWords,
      },
      ssml,
      validated: segments.every((s) => s.validated),
      status: segments.every((s) => s.status === "completed")
        ? "completed"
        : "partial",
      cost: totalCost,
    };
  }

  async regenerateSegment(
    segmentId: string,
    newScript: string
  ): Promise<VPNarrationResult> {
    const segment = this.segments.get(segmentId);
    if (!segment) {
      return {
        narrationId: `segment_not_found_${segmentId}`,
        provider: "edge_tts",
        voiceId: "default",
        language: "english",
        duration: 0,
        timingData: {
          sentenceTimestamps: [],
          phraseTimestamps: [],
          wordTimestamps: [],
        },
        ssml: "",
        validated: false,
        status: "failed",
        cost: 0,
      };
    }

    segment.script = newScript;
    const provider = this.providerAbstraction.get(segment.provider);
    if (!provider || !provider.isAvailable()) {
      return this.createFailedResult(segment);
    }

    const request: VPNarrationRequest = {
      script: newScript,
      language: segment.request.language || "english",
      voiceId: (segment.request.voiceId as string) || "default",
      speakingStyle: (segment.request.speakingStyle as any) || "neutral",
      speed: (segment.request.speed as number) || 1.0,
      pitch: (segment.request.pitch as number) || 0,
      emotionProfile: (segment.request.emotionProfile as any) || "neutral",
      ssml: (segment.request.ssml as string) || "",
      channelDnaVersion: (segment.request.channelDnaVersion as string) || "",
      outputFormat: (segment.request.outputFormat as string) || "mp3",
    };

    return provider.generate(request);
  }

  getSegments(): VPHybridSegment[] {
    return Array.from(this.segments.values());
  }

  private createFailedResult(segment: VPHybridSegment): VPNarrationResult {
    return {
      narrationId: `hybrid_failed_${segment.segmentId}_${Date.now()}`,
      provider: segment.provider,
      voiceId: (segment.request.voiceId as string) || "default",
      language: (segment.request.language as VPLanguage) || "english",
      duration: 0,
      timingData: {
        sentenceTimestamps: [],
        phraseTimestamps: [],
        wordTimestamps: [],
      },
      ssml: "",
      validated: false,
      status: "failed",
      cost: 0,
    };
  }

  clear(): void {
    this.segments.clear();
  }
}
