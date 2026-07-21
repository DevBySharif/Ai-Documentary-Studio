import type { MasterTimeline, TimelineDecision, TimelineBlock } from "./types.js";
import type { StoryScript } from "../story/types.js";
import type { AudioIntelligenceResult } from "../audio/types.js";

import { TimelineClock } from "./clock.js";
import { SemanticTimelineEngine } from "./semantic-engine.js";
import { MultiLayerTimelineBuilder } from "./multi-layer.js";
import { TimelineDecisionAI } from "./decision-ai.js";
import { TimelineValidator, type TimelineValidationIssue } from "./validator.js";
import { TimelineMemory } from "./memory.js";
import { ZennTimelineProfile } from "./zenn-profile.js";

export interface GenerateTimelineInput {
  script: StoryScript;
  audio: AudioIntelligenceResult;
  projectId: string;
  applyZennProfile?: boolean;
}

export interface TimelineInspectionResult {
  timeline: MasterTimeline;
  decisions: TimelineDecision[];
  validation: { passed: boolean; issues: TimelineValidationIssue[] };
  version: number;
}

export class TimelineIntelligenceEngine {
  private clock: TimelineClock;
  private semantic: SemanticTimelineEngine;
  private layerBuilder: MultiLayerTimelineBuilder;
  private decisionAI: TimelineDecisionAI;
  private validator: TimelineValidator;
  private memory: TimelineMemory;
  private zenn: ZennTimelineProfile;

  constructor() {
    this.clock = new TimelineClock();
    this.semantic = new SemanticTimelineEngine(this.clock);
    this.layerBuilder = new MultiLayerTimelineBuilder();
    this.decisionAI = new TimelineDecisionAI(this.clock);
    this.validator = new TimelineValidator();
    this.memory = new TimelineMemory();
    this.zenn = new ZennTimelineProfile();
  }

  generate(input: GenerateTimelineInput): TimelineInspectionResult {
    const { script, audio, projectId, applyZennProfile } = input;

    this.clock.setAudioSource(audio);

    const moments = this.semantic.buildSemanticMap(script, audio);
    const blocks = this.semantic.buildBlocks(moments);
    const markers = this.semantic.buildMarkers(moments);

    let timeline = this.layerBuilder.buildLayers(blocks, markers, audio, projectId);

    const decisions = this.decisionAI.decide(timeline.blocks, script, audio);
    timeline = { ...timeline, decisions };

    if (applyZennProfile !== false) {
      timeline = this.zenn.apply(timeline);
    }

    const validation = this.validator.validate(timeline);

    const versionEntry = this.memory.saveVersion(projectId, timeline, "Generated from script + audio");

    for (const block of timeline.blocks) {
      if (block.reuse && block.imageId) {
        this.memory.trackImageReuse(projectId, block.imageId);
      }
      this.memory.trackMotionPattern(projectId, block.motion);
    }

    return {
      timeline,
      decisions,
      validation,
      version: versionEntry.version,
    };
  }

  getMemory(): TimelineMemory {
    return this.memory;
  }

  getClock(): TimelineClock {
    return this.clock;
  }

  getValidator(): TimelineValidator {
    return this.validator;
  }

  getVersion(projectId: string, version?: number): MasterTimeline | undefined {
    return this.memory.getVersion(projectId, version);
  }
}
