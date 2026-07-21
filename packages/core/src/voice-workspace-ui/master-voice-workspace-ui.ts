import { VoiceLibrarySpeakerManager } from "./voice-library-speaker-manager";
import { PronunciationEmotionPauseEditor } from "./pronunciation-emotion-pause-editor";
import { AudioWaveformCleanupDsp } from "./audio-waveform-cleanup-dsp";
import { VoiceComparisonVersioning } from "./voice-comparison-versioning";
import { NarrationTimelineApproval } from "./narration-timeline-approval";

/**
 * Master Voice Workspace UI Engine (Main Vol 05 Part 10).
 * Orchestrates 4-panel audio studio layout: Left Voice Library/Speakers -> Center Waveform & Narration Timeline -> Right Voice Settings/Inspector -> Bottom Versions/AI Suggestions/Queue.
 */
export class MasterVoiceWorkspaceUI {
  public readonly libraryManager = new VoiceLibrarySpeakerManager();
  public readonly pronunciationEmotionEditor = new PronunciationEmotionPauseEditor();
  public readonly audioDsp = new AudioWaveformCleanupDsp();
  public readonly comparisonVersioning = new VoiceComparisonVersioning();
  public readonly timelineApproval = new NarrationTimelineApproval();

  public selectSegmentAndHighlightScript(segmentId: string): { segmentId: string; highlightedScriptParagraphIndex: number } {
    const segment = this.timelineApproval.getTimelineSegments().find((s) => s.segmentId === segmentId);
    return {
      segmentId,
      highlightedScriptParagraphIndex: segment ? segment.scriptParagraphIndex : 0,
    };
  }
}
