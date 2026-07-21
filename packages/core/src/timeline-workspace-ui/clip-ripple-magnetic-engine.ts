import { NleClipItem, EditingMode } from "./timeline-ui-types";

/**
 * Clip Manager, Ripple & Magnetic Engine (Vol 05 Part 11 - Section 6, Section 8, Section 9, Section 14).
 * Manages NLE clip trimming, ripple editing downstream shifts, magnetic gap closure, and timeline snapping.
 */
export class ClipRippleMagneticEngine {
  private activeEditingMode: EditingMode = "Ripple";

  public setEditingMode(mode: EditingMode): void {
    this.activeEditingMode = mode;
  }

  public getEditingMode(): EditingMode {
    return this.activeEditingMode;
  }

  public trimClip(
    clip: NleClipItem,
    newDurationFrames: number,
    allDownstreamClips: ReadonlyArray<NleClipItem>
  ): { trimmedClip: NleClipItem; shiftedDownstreamClips: ReadonlyArray<NleClipItem> } {
    const deltaFrames = newDurationFrames - clip.durationFrames;
    const trimmedClip: NleClipItem = { ...clip, durationFrames: newDurationFrames };

    let shiftedDownstreamClips = allDownstreamClips;
    if (this.activeEditingMode === "Ripple") {
      shiftedDownstreamClips = allDownstreamClips.map((c) =>
        c.startFrame > clip.startFrame ? { ...c, startFrame: c.startFrame + deltaFrames } : c
      );
    }

    return { trimmedClip, shiftedDownstreamClips };
  }
}
