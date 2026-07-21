import { CinematicPreviewMode } from "./storyboard-ui-types";

/**
 * Cinematic Preview & Storyboard Presentation Mode Controller (Vol 05 Part 06 - Section 15, Section 16).
 * Controls slideshow / animated / timed / narration-synchronized previews and clean presentation mode for client reviews.
 */
export class CinematicPreviewPresentation {
  private isPresentationModeActive = false;
  private previewMode: CinematicPreviewMode = "NarrationSynchronized";

  public togglePresentationMode(): boolean {
    this.isPresentationModeActive = !this.isPresentationModeActive;
    return this.isPresentationModeActive;
  }

  public setPreviewMode(mode: CinematicPreviewMode): void {
    this.previewMode = mode;
  }

  public getPreviewState(): { isPresentationMode: boolean; mode: CinematicPreviewMode } {
    return {
      isPresentationMode: this.isPresentationModeActive,
      mode: this.previewMode,
    };
  }
}
