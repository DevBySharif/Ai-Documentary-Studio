import { SampleIndex } from "./sample-clock";

export type FadeCurveType = "Linear" | "EqualPower" | "Logarithmic" | "Exponential";

export interface FadeConfig {
  readonly durationSamples: number;
  readonly curve: FadeCurveType;
}

export interface ChannelMapping {
  readonly sourceChannel: number;
  readonly targetChannel: number;
  readonly gain: number;
}

/**
 * Audio Clip Model (IB Part 17 - Section 5).
 * References source asset with sample-accurate offsets, non-destructive fades, gain, and channel mapping.
 */
export interface AudioClip {
  readonly id: string;
  readonly assetId: string;
  readonly trackId: string;
  readonly sourceInSample: SampleIndex;
  readonly sourceOutSample: SampleIndex;
  readonly timelineInSample: SampleIndex;
  readonly timelineOutSample: SampleIndex;
  readonly gainOffsetDb: number;
  readonly fadeIn?: FadeConfig;
  readonly fadeOut?: FadeConfig;
  readonly speedRatio: number; // 1.0 = normal speed
  readonly channelMappings: ReadonlyArray<ChannelMapping>;
}

export function evaluateFadeGain(
  currentSampleOffset: number,
  fade: FadeConfig
): number {
  if (currentSampleOffset < 0) return 0;
  if (currentSampleOffset >= fade.durationSamples) return 1;

  const t = currentSampleOffset / fade.durationSamples;

  switch (fade.curve) {
    case "EqualPower":
      return Math.sin(t * (Math.PI / 2));
    case "Logarithmic":
      return Math.log10(1 + 9 * t);
    case "Exponential":
      return Math.pow(t, 2);
    case "Linear":
    default:
      return t;
  }
}
