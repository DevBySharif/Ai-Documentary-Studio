import type { SyncEvent, SyncLayer, SyncPriority, MasterSyncTimeline, AdaptiveSyncProfile } from "./types.js";
import type { SemanticSegment } from "../segmentation/types.js";
import type { AudioIntelligenceResult } from "../audio/types.js";
import type { ImageDecision } from "../image-decision/types.js";
import { SyncMasterClock } from "./master-clock.js";
import { CognitiveSyncEngine } from "./cognitive-sync.js";
import { DriftCorrector } from "./drift-corrector.js";
import { AdaptiveSyncProfileManager } from "./adaptive-profile.js";

export class SyncOrchestrator {
  private clock: SyncMasterClock;
  private cognitive: CognitiveSyncEngine;
  private drift: DriftCorrector;
  private profiles: AdaptiveSyncProfileManager;

  constructor() {
    this.clock = new SyncMasterClock();
    this.cognitive = new CognitiveSyncEngine();
    this.drift = new DriftCorrector();
    this.profiles = new AdaptiveSyncProfileManager();
  }

  buildTimeline(
    segments: SemanticSegment[],
    audio: AudioIntelligenceResult,
    decisions: ImageDecision[],
    profile: AdaptiveSyncProfile = "documentary"
  ): MasterSyncTimeline {
    this.clock.setDuration(audio.metadata.duration);
    const rules = this.profiles.getProfile(profile);
    const events: SyncEvent[] = [];
    const layers = new Map<SyncLayer, SyncEvent[]>();
    let eventId = 0;

    const layerOrder: SyncLayer[] = ["audio", "meaning", "image", "motion", "subtitle", "effects", "camera"];
    for (const layer of layerOrder) layers.set(layer, []);

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const decision = decisions.find((d) => d.segment === seg.index);

      const meaningEvent: SyncEvent = {
        id: `sync_${eventId++}`,
        start: seg.start,
        end: seg.end,
        layer: "meaning",
        type: seg.isReveal ? "reveal" : "concept_shift",
        priority: seg.importance >= 7 ? "high" : "medium",
        dependencies: [],
        data: { concept: seg.concept.primary, emotion: seg.emotion },
      };
      events.push(meaningEvent);
      layers.get("meaning")!.push(meaningEvent);

      if (decision && decision.strategy !== "hold") {
        const imageEvent: SyncEvent = {
          id: `sync_${eventId++}`,
          start: this.cognitive.alignToUnderstanding(seg.start, seg.start, seg.text.length, seg.complexity === "highly_abstract"),
          end: seg.end,
          layer: "image",
          type: "image_change",
          priority: decision.confidence >= 0.85 ? "high" : "medium",
          dependencies: [meaningEvent.id],
          data: { strategy: decision.strategy, imageId: decision.imageId },
        };
        events.push(imageEvent);
        layers.get("image")!.push(imageEvent);

        const motionEvent: SyncEvent = {
          id: `sync_${eventId++}`,
          start: seg.start + 0.1,
          end: seg.end,
          layer: "motion",
          type: "motion_start",
          priority: seg.isReveal ? "critical" : "high",
          dependencies: [imageEvent.id],
          data: { motion: decision.motion, transition: decision.transition },
        };
        events.push(motionEvent);
        layers.get("motion")!.push(motionEvent);
      }

      if (seg.isQuestion || seg.isReveal) {
        const event: SyncEvent = {
          id: `sync_${eventId++}`,
          start: seg.start,
          end: seg.end,
          layer: "camera",
          type: seg.isReveal ? "reveal" : "emphasis",
          priority: seg.isReveal ? "critical" : "high",
          dependencies: [],
        };
        events.push(event);
        layers.get("camera")!.push(event);
      }
    }

    for (const word of audio.whisper.words) {
      if (word.isEmphasized) {
        const highlightEvent: SyncEvent = {
          id: `sync_${eventId++}`,
          start: word.start,
          end: word.end,
          layer: "subtitle",
          type: "word_highlight",
          priority: "medium",
          dependencies: [],
          data: { word: word.word },
        };
        events.push(highlightEvent);
        layers.get("subtitle")!.push(highlightEvent);
      }
    }

    for (const pause of audio.whisper.pauses) {
      const pauseEvent: SyncEvent = {
        id: `sync_${eventId++}`,
        start: pause.start,
        end: pause.end,
        layer: "audio",
        type: "pause",
        priority: "low",
        dependencies: [],
      };
      events.push(pauseEvent);
      layers.get("audio")!.push(pauseEvent);
    }

    const sorted = events.sort((a, b) => a.start - b.start);

    return {
      events: sorted,
      layers,
      totalDuration: this.clock.getDuration(),
      clock: "audio",
      metadata: {
        profile,
        eventCount: sorted.length,
        driftCorrections: this.drift.getCorrectionCount(),
        latencyCompensations: 0,
        generatedAt: new Date().toISOString(),
      },
    };
  }

  getClock(): SyncMasterClock {
    return this.clock;
  }

  getDriftCorrector(): DriftCorrector {
    return this.drift;
  }
}
