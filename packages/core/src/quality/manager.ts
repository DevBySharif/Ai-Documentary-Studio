import type { QualityInspectionResult, AutoRepairAction, FailureReport, QualityMemoryEntry } from "./types.js";
import type { StoryScript } from "../story/types.js";
import type { PromptPlan } from "../prompt/types.js";
import type { MotionTimeline } from "../editor/types.js";
import type { AudioIntelligenceResult } from "../audio/types.js";
import type { VisualDNAProfile } from "../vda/types.js";
import type { NarrativeBlueprint } from "../narrative/types.js";

import { StoryQualityInspector, ScriptQualityInspector } from "./story.js";
import { PromptQualityInspector } from "./prompt.js";
import { ImageQualityInspector, VisualContinuityInspector } from "./image.js";
import { AudioQualityInspector } from "./audio.js";
import { SynchronizationQualityInspector } from "./sync.js";
import { MotionQualityInspector, TimelineQualityInspector } from "./motion.js";
import { RetentionPredictionEngine } from "./retention.js";
import { SelfCritiqueEngine } from "./self-critique.js";
import { CrossEngineValidator } from "./cross-engine.js";
import { AutoRepairEngine } from "./repair.js";
import { QualityGatesEngine } from "./gates.js";
import { ScorecardBuilder } from "./scorecard.js";
import { ProductionCommandCenterDashboard } from "./command-center.js";

export class QualityInspectionEngine {
  private storyInspector: StoryQualityInspector;
  private scriptInspector: ScriptQualityInspector;
  private promptInspector: PromptQualityInspector;
  private imageInspector: ImageQualityInspector;
  private continuityInspector: VisualContinuityInspector;
  private audioInspector: AudioQualityInspector;
  private syncInspector: SynchronizationQualityInspector;
  private motionInspector: MotionQualityInspector;
  private timelineInspector: TimelineQualityInspector;
  private retention: RetentionPredictionEngine;
  private selfCritique: SelfCritiqueEngine;
  private crossValidator: CrossEngineValidator;
  private repair: AutoRepairEngine;
  private gates: QualityGatesEngine;
  private scorecardBuilder: ScorecardBuilder;
  private commandCenter: ProductionCommandCenterDashboard;
  private memory: Map<string, QualityMemoryEntry> = new Map();

  constructor() {
    this.storyInspector = new StoryQualityInspector();
    this.scriptInspector = new ScriptQualityInspector();
    this.promptInspector = new PromptQualityInspector();
    this.imageInspector = new ImageQualityInspector();
    this.continuityInspector = new VisualContinuityInspector();
    this.audioInspector = new AudioQualityInspector();
    this.syncInspector = new SynchronizationQualityInspector();
    this.motionInspector = new MotionQualityInspector();
    this.timelineInspector = new TimelineQualityInspector();
    this.retention = new RetentionPredictionEngine();
    this.selfCritique = new SelfCritiqueEngine();
    this.crossValidator = new CrossEngineValidator();
    this.repair = new AutoRepairEngine();
    this.gates = new QualityGatesEngine();
    this.scorecardBuilder = new ScorecardBuilder();
    this.commandCenter = new ProductionCommandCenterDashboard();
  }

  inspect(
    script: StoryScript,
    blueprint: NarrativeBlueprint,
    promptPlan: PromptPlan,
    motionTimeline: MotionTimeline,
    audio: AudioIntelligenceResult,
    vda?: VisualDNAProfile
  ): QualityInspectionResult {
    const storyScore = this.storyInspector.inspect(script, blueprint);
    const scriptScore = this.scriptInspector.inspect(script);
    const promptScore = this.promptInspector.inspect(promptPlan);
    const imageScore = this.imageInspector.inspect(promptPlan, vda);
    const continuityScore = this.continuityInspector.inspect(promptPlan);
    const audioScore = this.audioInspector.inspect(audio);
    const syncScore = this.syncInspector.inspect(audio, motionTimeline);
    const motionScore = this.motionInspector.inspect(motionTimeline);
    const timelineScore = this.timelineInspector.inspect(motionTimeline, script.totalDuration);

    const categoryScores = {
      story: storyScore,
      script: scriptScore,
      prompt: promptScore,
      image: imageScore,
      visualContinuity: continuityScore,
      audio: audioScore,
      synchronization: syncScore,
      motion: motionScore,
      timeline: timelineScore,
    };

    const scorecard = this.scorecardBuilder.build(categoryScores);

    const retentionPrediction = this.retention.predict(script, motionTimeline);

    const selfCritiques = [
      this.selfCritique.critiqueStory(script),
      this.selfCritique.critiquePrompts(promptPlan),
      this.selfCritique.critiqueMotion(motionTimeline),
      this.selfCritique.critiqueAudio(audio),
    ];

    const crossEngineIssues = this.crossValidator.validateAll(script, promptPlan, motionTimeline, audio);

    const failures = this.buildFailures(categoryScores, crossEngineIssues as unknown as { description: string; severity: string }[]);

    const autoRepairs = this.repair.suggestRepairs(failures);

    const qualityGates = this.gates.evaluate(scorecard, autoRepairs);

    const commandCenter = this.commandCenter.build(
      scorecard,
      autoRepairs,
      qualityGates,
      this.estimateRenderTime(script, promptPlan),
      this.calculateReusePercentage(promptPlan),
      retentionPrediction.estimatedRetention
    );

    return {
      passed: scorecard.status === "ready",
      scorecard,
      retention: retentionPrediction,
      selfCritiques,
      crossEngineIssues,
      autoRepairs,
      failures,
      commandCenter,
      summary: this.commandCenter.getSummary(commandCenter),
    };
  }

  saveToMemory(projectId: string, result: QualityInspectionResult, renderSuccess: boolean): void {
    this.memory.set(projectId, {
      projectId,
      scorecard: result.scorecard,
      retentionPrediction: result.retention,
      renderSuccess,
      createdAt: new Date().toISOString(),
    });
  }

  getMemory(projectId: string): QualityMemoryEntry | undefined {
    return this.memory.get(projectId);
  }

  private buildFailures(
    categoryScores: Record<string, { passed: boolean; failures: string[]; score: number }>,
    crossEngineIssues: { description: string; severity: string }[]
  ): FailureReport[] {
    const failures: FailureReport[] = [];

    for (const [cat, score] of Object.entries(categoryScores)) {
      if (!score.passed) {
        for (const failure of score.failures) {
          failures.push({
            issue: failure,
            cause: `${cat} quality check`,
            affectedModule: cat,
            suggestedFix: `Review and improve ${cat} quality`,
            priority: score.score < 50 ? "high" : "medium",
          });
        }
      }
    }

    for (const issue of crossEngineIssues) {
      failures.push({
        issue: issue.description,
        cause: "Cross-engine validation",
        affectedModule: "cross-engine",
        suggestedFix: issue.description,
        priority: issue.severity === "high" ? "high" : issue.severity === "medium" ? "medium" : "low",
      });
    }

    return failures;
  }

  private estimateRenderTime(script: StoryScript, promptPlan: PromptPlan): number {
    const newImages = promptPlan.scenePrompts.filter((p) => !p.reuse).length;
    const totalDuration = script.totalDuration;
    return newImages * 15 + totalDuration * 0.5;
  }

  private calculateReusePercentage(promptPlan: PromptPlan): number {
    const total = promptPlan.scenePrompts.length;
    if (total === 0) return 0;
    const reused = promptPlan.scenePrompts.filter((p) => p.reuse).length;
    return Math.round((reused / total) * 100);
  }
}
