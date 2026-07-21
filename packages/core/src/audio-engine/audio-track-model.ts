import { SampleIndex } from "./sample-clock";

export type ChannelConfig = "Mono" | "Stereo" | "Surround51";

export interface AudioAutomationPoint {
  readonly sample: SampleIndex;
  readonly value: number;
}

export interface AudioAutomationTrack {
  readonly parameterName: "volume" | "pan" | "send" | string;
  readonly points: ReadonlyArray<AudioAutomationPoint>;
}

/**
 * Audio Track Model (IB Part 17 - Section 4).
 * Independent gain, panning, solo, mute, effect stack, and routing info.
 */
export interface AudioTrack {
  readonly id: string;
  readonly name: string;
  readonly channelConfig: ChannelConfig;
  readonly gainDb: number;
  readonly pan: number; // -1.0 (Left) to +1.0 (Right)
  readonly isMuted: boolean;
  readonly isSolo: boolean;
  readonly busId: string;
  readonly automations: ReadonlyArray<AudioAutomationTrack>;
  readonly effectIds: ReadonlyArray<string>;
}

export function createAudioTrack(
  id: string,
  name: string,
  busId = "master_bus",
  channelConfig: ChannelConfig = "Stereo"
): AudioTrack {
  return {
    id,
    name,
    channelConfig,
    gainDb: 0.0,
    pan: 0.0,
    isMuted: false,
    isSolo: false,
    busId,
    automations: [],
    effectIds: [],
  };
}
