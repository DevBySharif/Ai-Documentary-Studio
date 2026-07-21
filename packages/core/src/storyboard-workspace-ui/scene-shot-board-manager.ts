import { SceneBoardItem, ShotCardItem } from "./storyboard-ui-types";

/**
 * Scene Board & Shot Card Manager (Vol 05 Part 06 - Section 4, Section 5, Section 6).
 * Manages scene boards, shot cards, and supports drag-and-drop shot reordering across scenes.
 */
export class SceneShotBoardManager {
  private scenes: SceneBoardItem[] = [
    {
      sceneId: "scene_1",
      title: "Prologue: The Dawn of Steam",
      durationSecs: 62,
      narrativeObjective: "Establish historical scale of industrial boom.",
      emotionalTone: "Awe and Dramatic Tension",
      shots: [
        {
          shotId: "shot_1_1",
          sceneId: "scene_1",
          shotNumber: 1,
          thumbnailUrl: "https://assets.studio.internal/shots/shot1.png",
          cameraAngle: "Extreme Wide Aerial Shot",
          durationSecs: 4.5,
          motionType: "Slow Zoom In",
          assetStatus: "ImageReady",
          colorStatus: "Green",
          approvalStage: "Approved",
          directorNotes: "High contrast lighting on foundry smokestacks.",
          scriptParagraphIndex: 0,
        },
      ],
    },
  ];

  public getSceneBoards(): ReadonlyArray<SceneBoardItem> {
    return this.scenes;
  }

  public reorderShotsInScene(sceneId: string, sourceIndex: number, targetIndex: number): void {
    const sc = this.scenes.find((s) => s.sceneId === sceneId);
    if (sc) {
      const updatedShots = [...sc.shots];
      const [moved] = updatedShots.splice(sourceIndex, 1);
      updatedShots.splice(targetIndex, 0, moved);

      const idx = this.scenes.indexOf(sc);
      this.scenes[idx] = { ...sc, shots: updatedShots };
    }
  }
}
