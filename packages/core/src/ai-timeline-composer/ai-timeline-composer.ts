import { ComposedTimeline, ComposedClip, SyncLevel, TimelineQualityReport } from "./composer-types";
import { NarrationSyncEngine } from "./narration-sync-engine";
import { MotionTransitionPlanner } from "./motion-transition-planner";
import { LayerOrganizer } from "./layer-organizer";
import { TimelineQualityAnalyzer } from "./timeline-quality-analyzer";
import { AutoRecomposer } from "./auto-recomposer";

/**
 * Master AI Timeline Composer Engine (Main Vol 04 Part 09).
 * Drives workflow: Script -> Narration -> Storyboard -> Visual Assets -> Timeline Planning -> Synchronization -> Editing Review -> Final Timeline.
 */
export class AiTimelineComposer {
  public readonly syncEngine = new NarrationSyncEngine();
  public readonly motionPlanner = new MotionTransitionPlanner();
  public readonly layerOrganizer = new LayerOrganizer();
  public readonly qualityAnalyzer = new TimelineQualityAnalyzer();
  public readonly recomposer = new AutoRecomposer();

  public async composeTimeline(
    narrationText: string,
    visualAssets: ReadonlyArray<{ assetId: string; durationSecs: number }>,
    fps = 24
  ): Promise<{ timeline: ComposedTimeline; qualityReport: TimelineQualityReport }> {
    const totalDurationSecs = visualAssets.reduce((sum, a) => sum + a.durationSecs, 0);
    const totalFrames = totalDurationSecs * fps;
    const syncLevel: SyncLevel = this.syncEngine.selectBestSyncLevel(narrationText.length);

    let currentFrame = 0;
    const clips: ComposedClip[] = visualAssets.map((ast, idx) => {
      const durationFrames = Math.round(ast.durationSecs * fps);
      const startFrame = currentFrame;
      currentFrame += durationFrames;

      const layerRole = "BackgroundVisuals";
      const trackIndex = this.layerOrganizer.getTrackIndexForRole(layerRole);
      const motion = this.motionPlanner.assignMotion(false, idx);
      const transitionIn = this.motionPlanner.selectTransition(idx > 0, false);

      return {
        clipId: `cmp_clip_${idx}_${ast.assetId}`,
        assetId: ast.assetId,
        layerRole,
        trackIndex,
        startFrame,
        durationFrames,
        motion,
        transitionIn,
        isUserLocked: false,
      };
    });

    const timeline: ComposedTimeline = {
      timelineId: `tl_${Math.random().toString(36).substring(2, 9)}`,
      fps,
      totalFrames,
      totalDurationSecs,
      clips,
      syncLevelUsed: syncLevel,
    };

    const qualityReport = this.qualityAnalyzer.analyzeTimeline(timeline);

    return {
      timeline,
      qualityReport,
    };
  }
}
