import { FrameIndex, Timebase, framesPerSecond } from "../timeline-engine/time";

/**
 * Sample Index is the single authoritative source of truth for audio calculations (IB Part 17 - Section 20).
 * Never perform authoritative DSP calculations in video frame units.
 */
export type SampleIndex = number;

export const DEFAULT_SAMPLE_RATE = 48000;

export function samplesToSeconds(sample: SampleIndex, sampleRate = DEFAULT_SAMPLE_RATE): number {
  return sample / sampleRate;
}

export function secondsToSamples(seconds: number, sampleRate = DEFAULT_SAMPLE_RATE): SampleIndex {
  return Math.round(seconds * sampleRate);
}

export function frameToSamples(
  frame: FrameIndex,
  timebase: Timebase,
  sampleRate = DEFAULT_SAMPLE_RATE
): SampleIndex {
  const fps = framesPerSecond(timebase);
  const seconds = frame / fps;
  return secondsToSamples(seconds, sampleRate);
}

export function samplesToFrame(
  sample: SampleIndex,
  timebase: Timebase,
  sampleRate = DEFAULT_SAMPLE_RATE
): FrameIndex {
  const fps = framesPerSecond(timebase);
  const seconds = samplesToSeconds(sample, sampleRate);
  return Math.floor(seconds * fps);
}
