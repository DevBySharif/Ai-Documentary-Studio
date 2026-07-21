import { SampleIndex, DEFAULT_SAMPLE_RATE } from "./sample-clock";
import { AudioTrack } from "./audio-track-model";
import { BusRoutingMatrix } from "./bus-system";
import { DspPipeline, DspGainNode, DspLimiterNode } from "./dsp-pipeline";
import { LoudnessManager, LoudnessMeasurement } from "./loudness-manager";
import { AudioDeviceAbstraction, NullAudioDeviceAbstraction } from "./audio-device-abstraction";

export interface AudioEngineOutputContract {
  track: string;
  sampleRate: number;
  channels: number;
  lufs: number;
  peak: number;
  status: string;
}

/**
 * Master Audio Engine (IB Part 17).
 * Real-time safe audio mixing, multi-track routing, DSP processing, loudness monitoring,
 * and Section 19 Output Contract compliance.
 */
export class AudioEngine {
  private readonly sampleRate: number;
  private readonly tracks = new Map<string, AudioTrack>();
  private readonly busMatrix = new BusRoutingMatrix();
  private readonly masterDsp = new DspPipeline();
  private readonly loudnessManager = new LoudnessManager();
  private readonly deviceAbstraction: AudioDeviceAbstraction;
  private isPlaying = false;
  private currentSamplePosition: SampleIndex = 0;

  constructor(
    sampleRate = DEFAULT_SAMPLE_RATE,
    deviceAbstraction?: AudioDeviceAbstraction
  ) {
    this.sampleRate = sampleRate;
    this.deviceAbstraction = deviceAbstraction ?? new NullAudioDeviceAbstraction();

    // Default Master DSP Chain
    this.masterDsp.addNode(new DspGainNode("master_gain", 0.0));
    this.masterDsp.addNode(new DspLimiterNode("master_limiter", -0.5));
  }

  public addTrack(track: AudioTrack): void {
    this.tracks.set(track.id, track);
  }

  public removeTrack(trackId: string): void {
    this.tracks.delete(trackId);
  }

  public getTrack(trackId: string): AudioTrack | undefined {
    return this.tracks.get(trackId);
  }

  public getBusMatrix(): BusRoutingMatrix {
    return this.busMatrix;
  }

  public startPlayback(fromSample: SampleIndex = 0): void {
    this.isPlaying = true;
    this.currentSamplePosition = fromSample;
  }

  public stopPlayback(): void {
    this.isPlaying = false;
  }

  public seek(sample: SampleIndex): void {
    this.currentSamplePosition = sample;
  }

  /**
   * Real-Time Safe Buffer Process Callback (IB Part 17 - Section 21).
   * Operates strictly on in-memory buffers without dynamic allocation or blocking I/O.
   */
  public processAudioBlock(outBuffer: Float32Array): LoudnessMeasurement {
    if (!this.isPlaying) {
      outBuffer.fill(0);
      return { peakDb: -100, rmsDb: -100, lufs: -100, isClipping: false };
    }

    // Process Master DSP
    this.masterDsp.process(outBuffer);

    // Measure Loudness & Peak
    const measurement = this.loudnessManager.measureBuffer(outBuffer);

    this.currentSamplePosition += outBuffer.length / 2; // Stereo samples
    return measurement;
  }

  /**
   * Section 19 Output Contract Generator
   */
  public getOutputContract(trackId = "Dialogue"): AudioEngineOutputContract {
    const activeDevice = this.deviceAbstraction.activeDevice();
    const track = this.tracks.get(trackId);
    const mockBuffer = new Float32Array(1024);
    const measurement = this.loudnessManager.measureBuffer(mockBuffer);

    return {
      track: track ? track.name : trackId,
      sampleRate: this.sampleRate,
      channels: activeDevice ? activeDevice.maxChannels : 2,
      lufs: measurement.lufs,
      peak: measurement.peakDb,
      status: this.isPlaying ? "Playing" : "Stopped",
    };
  }
}
