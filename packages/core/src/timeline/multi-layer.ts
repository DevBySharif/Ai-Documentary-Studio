import type { TimelineLayer, TimelineBlock, TimelineMarker, MasterTimeline } from "./types.js";
import type { AudioIntelligenceResult } from "../audio/types.js";

export class MultiLayerTimelineBuilder {
  buildLayers(
    blocks: TimelineBlock[],
    markers: TimelineMarker[],
    audio: AudioIntelligenceResult,
    projectId: string
  ): MasterTimeline {
    const layers: TimelineLayer[] = [];

    layers.push(this.buildAudioLayer(audio, markers));
    layers.push(this.buildImageLayer(blocks, markers));
    layers.push(this.buildMotionLayer(blocks, markers));
    layers.push(this.buildSubtitleLayer(audio, blocks));
    layers.push(this.buildEffectsLayer(blocks));
    layers.push(this.buildMetadataLayer(blocks, markers));

    const wordInserts = blocks.filter((b) => b.wordInsert).length;
    const imageChanges = blocks.length;
    const transitions = blocks.filter((b) => b.transition !== "cut").length;

    return {
      projectId,
      layers,
      blocks,
      markers,
      totalDuration: audio.metadata.duration,
      clock: "audio",
      decisions: [],
      metadata: {
        version: 1,
        semanticSegments: blocks.length,
        wordInserts,
        imageChanges,
        transitions,
        generatedAt: new Date().toISOString(),
      },
    };
  }

  private buildAudioLayer(audio: AudioIntelligenceResult, markers: TimelineMarker[]): TimelineLayer {
    const audioBlocks: TimelineBlock[] = [];

    for (let i = 0; i < audio.whisper.phrases.length; i++) {
      const phrase = audio.whisper.phrases[i];
      audioBlocks.push({
        id: `audio_block_${i}`,
        start: phrase.start,
        end: phrase.end,
        scene: 0,
        concept: "audio",
        imageId: "",
        imageType: "master_scene",
        motion: "hold",
        motionIntensity: "low",
        transition: "cut",
        transitionVisibility: "invisible",
        priority: "high",
        subtitle: phrase.text,
        emotion: "calm" as any,
        effects: [],
      });
    }

    return { type: "audio", blocks: audioBlocks, markers };
  }

  private buildImageLayer(blocks: TimelineBlock[], markers: TimelineMarker[]): TimelineLayer {
    const imageBlocks = blocks.map((b) => ({
      ...b,
      motion: "hold",
      transition: b.transition,
    }));

    return { type: "image", blocks: imageBlocks, markers };
  }

  private buildMotionLayer(blocks: TimelineBlock[], markers: TimelineMarker[]): TimelineLayer {
    const motionBlocks = blocks.map((b) => ({
      ...b,
      motion: b.motion,
      motionIntensity: b.motionIntensity,
    }));

    return { type: "motion", blocks: motionBlocks, markers };
  }

  private buildSubtitleLayer(audio: AudioIntelligenceResult, blocks: TimelineBlock[]): TimelineLayer {
    const subtitleBlocks: TimelineBlock[] = blocks.map((b, i) => ({
      ...b,
      id: `subtitle_${i}`,
      motion: "hold",
      motionIntensity: "low",
      transition: "cut",
      transitionVisibility: "invisible",
      priority: "medium" as any,
      subtitle: b.subtitle,
    }));

    return { type: "subtitle", blocks: subtitleBlocks, markers: [] };
  }

  private buildEffectsLayer(blocks: TimelineBlock[]): TimelineLayer {
    const effectsBlocks = blocks
      .filter((b) => b.effects.length > 0 || b.transition !== "cut")
      .map((b) => ({
        ...b,
        id: `effect_${b.id}`,
        motion: "hold",
        motionIntensity: "low",
        priority: "low" as any,
      }));

    return { type: "effects", blocks: effectsBlocks, markers: [] };
  }

  private buildMetadataLayer(blocks: TimelineBlock[], markers: TimelineMarker[]): TimelineLayer {
    return { type: "metadata", blocks, markers };
  }
}
