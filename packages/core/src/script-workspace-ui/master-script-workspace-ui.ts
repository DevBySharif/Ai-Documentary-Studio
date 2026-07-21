import { SceneNavigatorManager } from "./scene-navigator-manager";
import { AiCoWritingInlineEngine } from "./ai-co-writing-inline-engine";
import { ResearchLinkingSplitScreen } from "./research-linking-splitscreen";
import { ReadabilityVoiceTimingAnalyzer } from "./readability-voice-timing-analyzer";
import { ScriptVersionComparisonApproval } from "./script-version-comparison-approval";

/**
 * Master Script Workspace UI Engine (Main Vol 05 Part 05).
 * Orchestrates 4-panel script layout: Scene Navigator -> Professional Script Editor -> AI Assistant/Properties -> Voice Timing/Comments, plus Focus Mode toggle.
 */
export class MasterScriptWorkspaceUI {
  public readonly sceneNavigator = new SceneNavigatorManager();
  public readonly coWritingEngine = new AiCoWritingInlineEngine();
  public readonly splitScreenController = new ResearchLinkingSplitScreen();
  public readonly readabilityTiming = new ReadabilityVoiceTimingAnalyzer();
  public readonly versionApproval = new ScriptVersionComparisonApproval();

  private isFocusModeActive = false;

  public toggleFocusMode(): boolean {
    this.isFocusModeActive = !this.isFocusModeActive;
    return this.isFocusModeActive;
  }

  public getFocusModeState(): boolean {
    return this.isFocusModeActive;
  }
}
