export interface AudioDeviceInfo {
  readonly id: string;
  readonly name: string;
  readonly maxChannels: number;
  readonly preferredSampleRate: number;
  readonly isDefault: boolean;
}

export type DeviceChangeCallback = (devices: ReadonlyArray<AudioDeviceInfo>) => void;

/**
 * Device Abstraction Layer (IB Part 17 - Section 23).
 * Responsibilities: Device enumeration, format negotiation, buffer configuration, hot-plug detection, output switching.
 */
export interface AudioDeviceAbstraction {
  enumerateDevices(): Promise<ReadonlyArray<AudioDeviceInfo>>;
  activeDevice(): AudioDeviceInfo | undefined;
  switchDevice(deviceId: string): Promise<boolean>;
  onDeviceChange(callback: DeviceChangeCallback): () => void;
}

export class NullAudioDeviceAbstraction implements AudioDeviceAbstraction {
  private devices: AudioDeviceInfo[] = [
    {
      id: "default_output",
      name: "Default Stereo Output",
      maxChannels: 2,
      preferredSampleRate: 48000,
      isDefault: true,
    },
  ];

  public async enumerateDevices(): Promise<ReadonlyArray<AudioDeviceInfo>> {
    return this.devices;
  }

  public activeDevice(): AudioDeviceInfo | undefined {
    return this.devices[0];
  }

  public async switchDevice(_deviceId: string): Promise<boolean> {
    return true;
  }

  public onDeviceChange(_callback: DeviceChangeCallback): () => void {
    return () => {};
  }
}
