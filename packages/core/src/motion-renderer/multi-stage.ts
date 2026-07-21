import type { MRMultiStageSegment, MRMotionPreset, MRCurveType } from "./types.js";

export class MRMultiStageCamera {
  private segments: MRMultiStageSegment[] = [];

  addSegment(type: MRMotionPreset, startFrame: number, endFrame: number, curve: MRCurveType = "ease_in_out", params: Record<string, number> = {}): void {
    this.segments.push({ type, startFrame, endFrame, curve, params });
    this.segments.sort((a, b) => a.startFrame - b.startFrame);
  }

  removeSegment(startFrame: number): void {
    this.segments = this.segments.filter((s) => s.startFrame !== startFrame);
  }

  getSegments(): MRMultiStageSegment[] {
    return [...this.segments];
  }

  clear(): void {
    this.segments = [];
  }

  getActiveSegment(frame: number): MRMultiStageSegment | null {
    return this.segments.find((s) => frame >= s.startFrame && frame < s.endFrame) ?? null;
  }

  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    for (let i = 1; i < this.segments.length; i++) {
      if (this.segments[i].startFrame < this.segments[i - 1].endFrame) {
        errors.push(`Overlap between segment ${i - 1} and ${i}`);
      }
    }
    return { valid: errors.length === 0, errors };
  }
}
