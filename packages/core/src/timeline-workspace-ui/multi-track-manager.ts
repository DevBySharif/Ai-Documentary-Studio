import { NleTrackDescriptor, TrackType } from "./timeline-ui-types";

/**
 * Multi-Track Manager (Vol 05 Part 11 - Section 4, Section 5).
 * Configures and manages 11 NLE track types (Video, Images, Narration, Music, FX, Titles, Subtitles, etc.) with lock/mute/solo controls.
 */
export class MultiTrackManager {
  private tracks: NleTrackDescriptor[] = [
    { trackId: "tr_v1", trackName: "V1 - Background Visuals", trackType: "Images", isLocked: false, isMuted: false, isSolo: false, isCollapsed: false, colorHex: "#3b82f6", clips: [] },
    { trackId: "tr_a1", trackName: "A1 - Main Narration", trackType: "Narration", isLocked: false, isMuted: false, isSolo: false, isCollapsed: false, colorHex: "#10b981", clips: [] },
    { trackId: "tr_a2", trackName: "A2 - Background Music", trackType: "Music", isLocked: false, isMuted: false, isSolo: false, isCollapsed: false, colorHex: "#8b5cf6", clips: [] },
    { trackId: "tr_sub", trackName: "SUB - Subtitles", trackType: "Subtitles", isLocked: false, isMuted: false, isSolo: false, isCollapsed: false, colorHex: "#f59e0b", clips: [] },
  ];

  public getTracks(): ReadonlyArray<NleTrackDescriptor> {
    return this.tracks;
  }

  public addTrack(name: string, type: TrackType, colorHex = "#64748b"): NleTrackDescriptor {
    const track: NleTrackDescriptor = {
      trackId: `tr_${Math.random().toString(36).substring(2, 7)}`,
      trackName: name,
      trackType: type,
      isLocked: false,
      isMuted: false,
      isSolo: false,
      isCollapsed: false,
      colorHex,
      clips: [],
    };
    this.tracks.push(track);
    return track;
  }

  public toggleMute(trackId: string): void {
    const tr = this.tracks.find((t) => t.trackId === trackId);
    if (tr) {
      const idx = this.tracks.indexOf(tr);
      this.tracks[idx] = { ...tr, isMuted: !tr.isMuted };
    }
  }

  public toggleSolo(trackId: string): void {
    const tr = this.tracks.find((t) => t.trackId === trackId);
    if (tr) {
      const idx = this.tracks.indexOf(tr);
      this.tracks[idx] = { ...tr, isSolo: !tr.isSolo };
    }
  }
}
