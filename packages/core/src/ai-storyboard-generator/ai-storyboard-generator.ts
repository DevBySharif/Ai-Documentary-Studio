import { StoryboardScene } from "./storyboard-types";
import { SceneDecomposer } from "./scene-decomposer";
import { CinematicLanguageEngine } from "./cinematic-language-engine";
import { BrollAndMotionPlanner } from "./broll-and-motion-planner";
import { ImageGenerationPlanner } from "./image-generation-planner";
import { ShotListGenerator, FlatShotListItem } from "./shot-list-generator";

export interface CompleteStoryboard {
  readonly storyboardId: string;
  readonly scenes: ReadonlyArray<StoryboardScene>;
  readonly productionShotList: ReadonlyArray<FlatShotListItem>;
  readonly totalProjectDurationSecs: number;
}

/**
 * Master AI Storyboard Generator Engine (Main Vol 04 Part 04).
 * Drives workflow: Script -> Scene Analysis -> Shot Planning -> Visual Selection -> Timing -> Director Review -> Storyboard.
 */
export class AiStoryboardGenerator {
  public readonly decomposer = new SceneDecomposer();
  public readonly cinematicLanguage = new CinematicLanguageEngine();
  public readonly brollPlanner = new BrollAndMotionPlanner();
  public readonly imageGenPlanner = new ImageGenerationPlanner();
  public readonly shotListGenerator = new ShotListGenerator();

  public async generateStoryboard(
    scriptScenes: ReadonlyArray<{ sceneIndex: number; title: string; narrationText: string; visualIntent: string }>
  ): Promise<CompleteStoryboard> {
    // 1. Decompose script scenes into visual shot plans
    const scenes: StoryboardScene[] = scriptScenes.map((sc) =>
      this.decomposer.decomposeScriptScene(sc.sceneIndex, sc.title, sc.narrationText, sc.visualIntent)
    );

    // 2. Generate Production Shot List
    const productionShotList = this.shotListGenerator.generateShotList(scenes);
    const totalProjectDurationSecs = scenes.reduce((sum, sc) => sum + sc.totalDurationSecs, 0);

    return {
      storyboardId: `sb_${Math.random().toString(36).substring(2, 9)}`,
      scenes,
      productionShotList,
      totalProjectDurationSecs,
    };
  }
}
