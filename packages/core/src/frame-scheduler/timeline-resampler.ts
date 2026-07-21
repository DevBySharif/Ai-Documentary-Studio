import type { FSFramerate } from "./types.js";

export class FSTimelineResampler {
  private readonly validFramerates: FSFramerate[] = [24, 25, 30, 50, 60];

  resample(frameNumber: number, fromFPS: FSFramerate, toFPS: FSFramerate): number {
    const timeMs = (frameNumber / fromFPS) * 1000;
    return Math.round((timeMs / 1000) * toFPS);
  }

  resampleBatch(frames: number[], fromFPS: FSFramerate, toFPS: FSFramerate): number[] {
    return frames.map((f) => this.resample(f, fromFPS, toFPS));
  }

  resampleTime(timeMs: number, toFPS: FSFramerate): number {
    return Math.round((timeMs / 1000) * toFPS);
  }

  isValidFramerate(fps: number): fps is FSFramerate {
    return this.validFramerates.includes(fps as FSFramerate);
  }

  getSupportedFramerates(): FSFramerate[] {
    return [...this.validFramerates];
  }

  convertDuration(durationMs: number, fps: FSFramerate): number {
    return Math.round((durationMs / 1000) * fps);
  }
}
