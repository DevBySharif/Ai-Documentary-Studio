import { FrameIndex } from "./time";
import { Clip } from "./clip";
import { Marker } from "./marker";

export interface SnapTarget {
  readonly frame: FrameIndex;
  readonly type: "ClipIn" | "ClipOut" | "Playhead" | "Marker" | "TimelineStart" | "TimelineEnd";
  readonly sourceId: string;
}

/**
 * Snapping Engine — finds the nearest snap target within tolerance.
 */
export class SnappingEngine {
  constructor(private readonly toleranceFrames: number = 5) {}

  /**
   * Given a set of clips, markers, and playhead, collects all snap targets.
   */
  public buildSnapTargets(
    clips: ReadonlyArray<Clip>,
    markers: ReadonlyArray<Marker>,
    playheadFrame: FrameIndex,
    timelineDuration: FrameIndex
  ): SnapTarget[] {
    const targets: SnapTarget[] = [];

    for (const clip of clips) {
      targets.push({ frame: clip.timelineInFrame, type: "ClipIn", sourceId: clip.id });
      targets.push({ frame: clip.timelineOutFrame, type: "ClipOut", sourceId: clip.id });
    }

    for (const marker of markers) {
      targets.push({ frame: marker.frame, type: "Marker", sourceId: marker.id });
    }

    targets.push({ frame: playheadFrame, type: "Playhead", sourceId: "playhead" });
    targets.push({ frame: 0, type: "TimelineStart", sourceId: "timeline" });
    targets.push({ frame: timelineDuration, type: "TimelineEnd", sourceId: "timeline" });

    return targets;
  }

  /**
   * Snaps a frame to the nearest target within tolerance.
   * Returns the original frame if no target is close enough.
   */
  public snap(
    frame: FrameIndex,
    targets: ReadonlyArray<SnapTarget>,
    excludeSourceId?: string
  ): FrameIndex {
    let nearest: SnapTarget | undefined;
    let nearestDistance = Infinity;

    for (const target of targets) {
      if (target.sourceId === excludeSourceId) continue;
      const distance = Math.abs(target.frame - frame);
      if (distance < nearestDistance && distance <= this.toleranceFrames) {
        nearestDistance = distance;
        nearest = target;
      }
    }

    return nearest ? nearest.frame : frame;
  }
}
