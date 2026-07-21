import { StoryboardScene, ShotPlan } from "./storyboard-types";

export interface FlatShotListItem {
  readonly shotNumberGlobal: number;
  readonly sceneId: string;
  readonly recommendedDurationSecs: number;
  readonly visualSource: string;
  readonly camera: string;
  readonly motion: string;
  readonly transition: string;
  readonly priority: "High" | "Medium" | "Low";
}

/**
 * Shot List & Director Notes Generator (Vol 04 Part 04 - Section 13, Section 16, Section 17).
 * Exports production-ready shot lists with timing and priority.
 */
export class ShotListGenerator {
  public generateShotList(scenes: ReadonlyArray<StoryboardScene>): ReadonlyArray<FlatShotListItem> {
    const shotList: FlatShotListItem[] = [];
    let globalCounter = 1;

    scenes.forEach((sc) => {
      sc.shots.forEach((sh) => {
        shotList.push({
          shotNumberGlobal: globalCounter++,
          sceneId: sc.sceneId,
          recommendedDurationSecs: sh.recommendedDurationSecs,
          visualSource: sh.visualSource,
          camera: sh.camera,
          motion: sh.motion,
          transition: sh.transitionSuggestion,
          priority: sh.visualSource === "ArchivalFootage" ? "High" : "Medium",
        });
      });
    });

    return shotList;
  }
}
