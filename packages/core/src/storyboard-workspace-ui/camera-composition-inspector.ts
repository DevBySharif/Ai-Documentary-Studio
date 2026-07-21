import { CompositionOverlayType } from "./storyboard-ui-types";

export interface CameraSettingsDescriptor {
  readonly framing: string;
  readonly lensType: string;
  readonly perspective: string;
  readonly composition: string;
}

/**
 * Camera Preview & Composition Overlay Inspector (Vol 05 Part 06 - Section 7, Section 8).
 * Provides camera parameters (framing, lens, perspective) and composition overlays (Rule of Thirds, Safe Area, etc.).
 */
export class CameraCompositionInspector {
  private activeOverlay: CompositionOverlayType = "RuleOfThirds";

  public getCameraSettings(shotId: string): CameraSettingsDescriptor {
    return {
      framing: "Medium Long Shot",
      lensType: "35mm Prime",
      perspective: "Eye Level",
      composition: "Rule of Thirds Right Anchor",
    };
  }

  public setCompositionOverlay(overlay: CompositionOverlayType): void {
    this.activeOverlay = overlay;
  }

  public getActiveCompositionOverlay(): CompositionOverlayType {
    return this.activeOverlay;
  }
}
