import { ScriptSceneItem, ScriptApprovalStage } from "./script-ui-types";

/**
 * Scene Navigator Manager (Vol 05 Part 05 - Section 5).
 * Manages scene list, durations, word counts, completion states, and instant scene jumping.
 */
export class SceneNavigatorManager {
  private scenes: ScriptSceneItem[] = [
    {
      sceneId: "scene_1",
      sceneNumber: 1,
      title: "Prologue: The Dawn of Steam",
      contentText: "In the mid-1830s, Britain stood on the precipice of an unprecedented industrial revolution...",
      wordCount: 145,
      estimatedDurationSecs: 62,
      approvalStage: "Approved",
      linkedEvidenceIds: ["ev_1"],
    },
    {
      sceneId: "scene_2",
      sceneNumber: 2,
      title: "Act I: Brunel's Audacious Vision",
      contentText: "Isambard Kingdom Brunel envisioned a railway stretching seamlessly from London to New York...",
      wordCount: 220,
      estimatedDurationSecs: 94,
      approvalStage: "HumanReviewed",
      linkedEvidenceIds: ["ev_1", "ev_2"],
    },
  ];

  public getScenes(): ReadonlyArray<ScriptSceneItem> {
    return this.scenes;
  }

  public getTotalScriptWordCount(): number {
    return this.scenes.reduce((sum, s) => sum + s.wordCount, 0);
  }

  public getTotalEstimatedDurationSecs(): number {
    return this.scenes.reduce((sum, s) => sum + s.estimatedDurationSecs, 0);
  }

  public updateSceneStage(sceneId: string, stage: ScriptApprovalStage): void {
    const sc = this.scenes.find((s) => s.sceneId === sceneId);
    if (sc) {
      const idx = this.scenes.indexOf(sc);
      this.scenes[idx] = { ...sc, approvalStage: stage };
    }
  }
}
