import type { CameraPath, CameraDirectorPlan, CognitiveCameraTarget } from "./types.js";
import type { SemanticSegment } from "../segmentation/types.js";
import { CameraPathPlanner } from "./camera-path-planner.js";
import { CameraDirectorAI } from "./camera-director-ai.js";
import { CognitiveCameraEngine } from "./cognitive-camera.js";
import { MultiStagePathBuilder } from "./multi-stage-path.js";
import { MotionSafetyChecker } from "./motion-safety.js";

export interface MotionTimelineEngineInput {
  segments: SemanticSegment[];
  imageDurations: Map<number, number>;
}

export interface MotionTimelineOutput {
  paths: CameraPath[];
  safety: boolean;
  warnings: string[];
}

export class MotionTimelineEngine {
  private pathPlanner: CameraPathPlanner;
  private director: CameraDirectorAI;
  private cognitive: CognitiveCameraEngine;
  private multiStage: MultiStagePathBuilder;
  private safety: MotionSafetyChecker;

  constructor() {
    this.pathPlanner = new CameraPathPlanner();
    this.director = new CameraDirectorAI();
    this.cognitive = new CognitiveCameraEngine();
    this.multiStage = new MultiStagePathBuilder();
    this.safety = new MotionSafetyChecker();
  }

  generate(input: MotionTimelineEngineInput): MotionTimelineOutput {
    const paths: CameraPath[] = [];
    const warnings: string[] = [];
    let lastEmotion = "";

    for (const segment of input.segments) {
      const imageDuration = input.imageDurations.get(segment.index) ?? (segment.end - segment.start);

      const cognitiveTargets = this.cognitive.evaluateTargets(segment);
      const directorPlan = this.director.direct(segment, cognitiveTargets);
      const cameraPath = this.pathPlanner.plan(segment, lastEmotion, imageDuration);

      const multiStagePath = this.multiStage.build(segment, imageDuration);
      if (multiStagePath.stages.length > 1) {
        cameraPath.segments = multiStagePath.stages.map((s) => ({
          motion: s.motion,
          start: s.start,
          end: s.end,
          easing: s.easing,
          speed: s.motion === "hold" ? 0 : 0.3,
          intensity: s.motion === "push_in" ? "medium" : "low",
          target: directorPlan.target,
          targetLabel: directorPlan.targetLabel,
        }));
      }

      for (const seg of cameraPath.segments) {
        const safetyReport = this.safety.check(seg.motion, seg.intensity, seg.end - seg.start);
        if (!safetyReport.passed) {
          warnings.push(...safetyReport.warnings);
        }
      }

      paths.push(cameraPath);
      lastEmotion = segment.emotion;
    }

    return {
      paths,
      safety: warnings.length === 0,
      warnings,
    };
  }
}

export { CameraPathPlanner, CameraDirectorAI, CognitiveCameraEngine, MultiStagePathBuilder, MotionSafetyChecker };
