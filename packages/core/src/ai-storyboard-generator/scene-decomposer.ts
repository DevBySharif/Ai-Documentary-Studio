import { StoryboardScene, ShotPlan } from "./storyboard-types";

/**
 * Scene Decomposer & Shot Planner (Vol 04 Part 04 - Section 5, Section 6).
 * Divides script narration into visual production units & cinematic shot sequences.
 */
export class SceneDecomposer {
  public decomposeScriptScene(
    sceneIndex: number,
    title: string,
    narrationText: string,
    visualIntent: string
  ): StoryboardScene {
    const shots: ShotPlan[] = [
      {
        shotNumber: 1,
        shotObjective: `Establish environment for ${title}`,
        rationale: "Immerse audience in historical location.",
        minDurationSecs: 3,
        recommendedDurationSecs: 5,
        maxDurationSecs: 8,
        visualSource: "ArchivalFootage",
        camera: "WideShot",
        composition: "RuleOfThirds",
        motion: "SlowZoom",
        transitionSuggestion: "CrossDissolve",
      },
      {
        shotNumber: 2,
        shotObjective: "Focus on primary subject/document",
        rationale: "Provide supporting evidence for narration.",
        minDurationSecs: 4,
        recommendedDurationSecs: 6,
        maxDurationSecs: 10,
        visualSource: "HistoricalPhotograph",
        camera: "CloseUp",
        composition: "ForegroundInterest",
        motion: "KenBurns",
        transitionSuggestion: "HardCut",
      },
    ];

    const totalDurationSecs = shots.reduce((sum, s) => sum + s.recommendedDurationSecs, 0);

    return {
      sceneId: `sc_${sceneIndex}_${Math.random().toString(36).substring(2, 7)}`,
      sceneIndex,
      narrativePurpose: `Visual breakdown of script scene #${sceneIndex}: ${title}`,
      emotionalIntent: "Informative and Cinematic",
      shots,
      directorsNotes: [
        "Hold the close-up shot for two additional seconds to ensure legibility.",
        "Prefer authentic archival material over AI generation when available.",
      ],
      totalDurationSecs,
    };
  }
}
