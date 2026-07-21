import { NleMarkerItem, KeyframeTrack, KeyframePoint } from "./timeline-ui-types";

/**
 * Marker System & Multi-Property Keyframe Editor (Vol 05 Part 10 - Section 10, Section 11).
 * Manages timeline markers (Scene boundaries, cues, TODOs, export regions) and animatable multi-property keyframes (Position, Scale, Opacity, Volume).
 */
export class MarkerKeyframeEditor {
  private markers: NleMarkerItem[] = [
    { markerId: "mrk_1", framePosition: 0, category: "SceneBoundary", title: "Scene 1 Start", colorHex: "#3b82f6" },
  ];

  public addMarker(framePosition: number, category: NleMarkerItem["category"], title: string, colorHex = "#f59e0b"): NleMarkerItem {
    const marker: NleMarkerItem = {
      markerId: `mrk_${Math.random().toString(36).substring(2, 7)}`,
      framePosition,
      category,
      title,
      colorHex,
    };
    this.markers.push(marker);
    return marker;
  }

  public getMarkers(): ReadonlyArray<NleMarkerItem> {
    return this.markers;
  }

  public addKeyframe(
    track: KeyframeTrack,
    framePosition: number,
    value: number,
    easing: KeyframePoint["easing"] = "Linear"
  ): KeyframeTrack {
    const newPoint: KeyframePoint = { framePosition, value, easing };
    const updatedPoints = [...track.points, newPoint].sort((a, b) => a.framePosition - b.framePosition);
    return { ...track, points: updatedPoints };
  }
}
