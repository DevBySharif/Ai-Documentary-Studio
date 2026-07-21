import { ScriptMode, HookStyle, ScriptScene, ScriptOutput } from "./script-types";
import { HookGenerator } from "./hook-generator";
import { VoiceOverOptimizer } from "./voice-over-optimizer";
import { ScriptQualityAnalyzer, ScriptQualityReport } from "./script-quality-analyzer";
import { CoWritingEngine } from "./co-writing-engine";

/**
 * Master AI Script Writer Engine (Main Vol 04 Part 03).
 * Orchestrates the full writing workflow: Research -> Narrative Planning -> Scene Writing -> Voiceover Optimization -> Quality Review -> Final Script.
 */
export class AiScriptWriter {
  public readonly hookGenerator = new HookGenerator();
  public readonly voiceOptimizer = new VoiceOverOptimizer();
  public readonly qualityAnalyzer = new ScriptQualityAnalyzer();
  public readonly coWriter = new CoWritingEngine();

  public async generateScript(
    topic: string,
    researchSummary: string,
    mode: ScriptMode = "Documentary",
    hookStyle: HookStyle = "SurprisingFact"
  ): Promise<{ script: ScriptOutput; qualityReport: ScriptQualityReport }> {
    // 1. Generate Hook
    const hook = this.hookGenerator.generateHook(topic, hookStyle);

    // 2. Draft Scene Sequence with Visual-Aware Writing (Section 8, Section 12)
    const rawScenes: ScriptScene[] = [
      {
        sceneIndex: 1,
        title: "Introduction & Hook",
        sceneObjective: "Establish historical tension and introduce main topic.",
        narrationText: `${hook} Research shows: ${researchSummary.substring(0, 100)}...`,
        visualIntent: "Archival footage fading in, atmospheric map overlay of region.",
        transitionNotes: "Slow cross-dissolve to Scene 2",
        estimatedDurationSeconds: 45,
      },
      {
        sceneIndex: 2,
        title: "Core Narrative & Evidence",
        sceneObjective: "Present factual evidence and development.",
        narrationText: `As the situation unfolded, key figures gathered to address the emerging challenges.`,
        visualIntent: "Historical photographs panning over primary document excerpts.",
        transitionNotes: "Cut to Scene 3",
        estimatedDurationSeconds: 60,
      },
      {
        sceneIndex: 3,
        title: "Climax & Resolution",
        sceneObjective: "Synthesize findings and deliver historical impact.",
        narrationText: `The legacy of these events continues to resonate through modern documentary study.`,
        visualIntent: "Cinematic drone shot over modern landscape contrasted with archival imagery.",
        transitionNotes: "Fade to black",
        estimatedDurationSeconds: 50,
      },
    ];

    // 3. Optimize Voice-Over & Pacing (Section 9, Section 10)
    const optimizedScenes = rawScenes.map((sc) => {
      const optimizedText = this.voiceOptimizer.optimizeNarration(sc.narrationText);
      const estDuration = this.voiceOptimizer.estimateSpeakingDurationSeconds(optimizedText);
      return { ...sc, narrationText: optimizedText, estimatedDurationSeconds: estDuration };
    });

    const totalDurationSeconds = optimizedScenes.reduce((sum, sc) => sum + sc.estimatedDurationSeconds, 0);

    const script: ScriptOutput = {
      scriptId: `script_${Math.random().toString(36).substring(2, 9)}`,
      title: `Documentary Script: ${topic}`,
      mode,
      hook,
      hookStyle,
      scenes: optimizedScenes,
      endingSummary: `In conclusion, ${topic} remains a testament to historical transformation.`,
      creditSuggestions: ["Archival Footage Courtesy of National Archives", "Special Thanks to Historical Consultants"],
      totalDurationSeconds,
    };

    // 4. Quality Analysis (Section 16)
    const qualityReport = this.qualityAnalyzer.analyzeScript(script);

    return { script, qualityReport };
  }
}
