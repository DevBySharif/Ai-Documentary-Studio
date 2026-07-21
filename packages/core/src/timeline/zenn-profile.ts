import type { TimelineBlock, TimelineMarker, MasterTimeline, TimelineDecision } from "./types.js";

export class ZennTimelineProfile {
  apply(timeline: MasterTimeline): MasterTimeline {
    const blocks = this.applyLongHolds(timeline.blocks);
    const semanticBlocks = this.applySemanticReuse(blocks);
    const reducedCuts = this.reduceUnnecessaryCuts(semanticBlocks);
    const rhythmBlocks = this.applyCinematicRhythm(reducedCuts);
    const motionBlocks = this.alignMotionToMeaning(rhythmBlocks, timeline.markers);
    const wordInsertBlocks = this.applyWordInsertPolicy(motionBlocks);
    const finalBlocks = this.ensureSmoothReturns(wordInsertBlocks);

    return {
      ...timeline,
      blocks: finalBlocks,
      layers: timeline.layers.map((l) => ({
        ...l,
        blocks: l.type === "image" || l.type === "motion"
          ? finalBlocks.filter((b) => !b.wordInsert || l.type === "motion")
          : l.blocks,
      })),
      metadata: {
        ...timeline.metadata,
        version: timeline.metadata.version,
      },
    };
  }

  private applyLongHolds(blocks: TimelineBlock[]): TimelineBlock[] {
    return blocks.map((b) => {
      if (b.priority === "critical" || b.priority === "high") {
        const extendedEnd = b.end + 1.5;
        return { ...b, end: extendedEnd };
      }
      return b;
    });
  }

  private applySemanticReuse(blocks: TimelineBlock[]): TimelineBlock[] {
    const conceptImageMap = new Map<string, string>();
    return blocks.map((b) => {
      if (conceptImageMap.has(b.concept)) {
        return { ...b, imageId: conceptImageMap.get(b.concept)!, imageType: "supporting_scene", reuse: true };
      }
      conceptImageMap.set(b.concept, b.imageId || `img_${b.concept}`);
      return { ...b, reuse: false };
    });
  }

  private reduceUnnecessaryCuts(blocks: TimelineBlock[]): TimelineBlock[] {
    const result: TimelineBlock[] = [];
    for (let i = 0; i < blocks.length; i++) {
      const current = blocks[i];
      const prev = result[result.length - 1];

      if (prev && current.concept === prev.concept && current.emotion === prev.emotion) {
        result[result.length - 1] = {
          ...prev,
          end: current.end,
          subtitle: prev.subtitle + " " + current.subtitle,
        };
      } else {
        result.push(current);
      }
    }
    return result;
  }

  private applyCinematicRhythm(blocks: TimelineBlock[]): TimelineBlock[] {
    return blocks.map((b, i) => {
      if (i > 0 && i % 3 === 0) {
        return { ...b, motion: "slow_push_in", motionIntensity: "low" };
      }
      if (i > 0 && i % 5 === 0) {
        return { ...b, motion: "gentle_pan", motionIntensity: "low" };
      }
      return b;
    });
  }

  private alignMotionToMeaning(blocks: TimelineBlock[], markers: TimelineMarker[]): TimelineBlock[] {
    const markerTimes = new Set(markers.filter((m) =>
      ["emotion_change", "concept_shift", "word_highlight"].includes(m.type)
    ).map((m) => m.time));

    return blocks.map((b) => {
      if (markerTimes.has(b.start)) {
        return { ...b, motion: "slow_push_in", motionIntensity: "medium" };
      }
      return b;
    });
  }

  private applyWordInsertPolicy(blocks: TimelineBlock[]): TimelineBlock[] {
    return blocks.map((b) => {
      if (b.priority === "critical" && !b.wordInsert) {
        return {
          ...b,
          wordInsert: { word: b.concept, start: b.start + 0.5, end: b.start + 2.5 },
        };
      }
      return b;
    });
  }

  private ensureSmoothReturns(blocks: TimelineBlock[]): TimelineBlock[] {
    return blocks.map((b, i) => {
      if (i > 0 && blocks[i - 1]?.wordInsert && !b.wordInsert) {
        return { ...b, motion: "hold", transition: "cross_fade", transitionVisibility: "subtle" };
      }
      return b;
    });
  }
}
