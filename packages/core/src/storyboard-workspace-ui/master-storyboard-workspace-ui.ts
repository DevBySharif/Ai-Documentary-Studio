import { SceneShotBoardManager } from "./scene-shot-board-manager";
import { CameraCompositionInspector } from "./camera-composition-inspector";
import { AssetReadinessColorTracker } from "./asset-readiness-color-tracker";
import { CinematicPreviewPresentation } from "./cinematic-preview-presentation";
import { AiShotSuggesterApproval } from "./ai-shot-suggester-approval";

/**
 * Master Storyboard Workspace UI Engine (Main Vol 05 Part 06).
 * Orchestrates the 4-panel storyboard layout: Left Scene Navigator -> Center Storyboard Board -> Right Shot Inspector -> Bottom Timeline Link/AI Suggestions/Notes.
 */
export class MasterStoryboardWorkspaceUI {
  public readonly boardManager = new SceneShotBoardManager();
  public readonly cameraInspector = new CameraCompositionInspector();
  public readonly readinessTracker = new AssetReadinessColorTracker();
  public readonly presentationController = new CinematicPreviewPresentation();
  public readonly aiShotSuggester = new AiShotSuggesterApproval();

  public selectShotAndLinkTimeline(shotId: string): { shotId: string; linkedTimelinePositionSecs: number } {
    return {
      shotId,
      linkedTimelinePositionSecs: 14.5,
    };
  }
}
