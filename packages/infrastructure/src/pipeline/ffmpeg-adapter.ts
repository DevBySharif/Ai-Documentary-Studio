/**
 * Media metadata extracted by the analysis stage.
 */
export interface MediaMetadata {
  readonly format: string;
  readonly mimeType: string;
  readonly durationSeconds?: number;
  readonly sizeBytes: number;
  readonly width?: number;
  readonly height?: number;
  readonly frameRate?: number;
  readonly codec?: string;
  readonly bitrate?: number;
  readonly colorSpace?: string;
  readonly orientation?: number;
  readonly audioStreams: ReadonlyArray<AudioStreamInfo>;
  readonly hasSubtitles: boolean;
}

export interface AudioStreamInfo {
  readonly index: number;
  readonly codec: string;
  readonly channels: number;
  readonly sampleRate: number;
}

/**
 * FFmpeg-specific command contract.
 * The real implementation invokes the FFmpeg binary via child_process
 * and parses its JSON probe output. This abstraction keeps the rest
 * of the pipeline driver-agnostic.
 */
export interface FfmpegAdapter {
  probe(filePath: string): Promise<MediaMetadata>;
  extractThumbnail(
    filePath: string,
    outputPath: string,
    offsetSeconds: number
  ): Promise<void>;
  generateProxy(
    filePath: string,
    outputPath: string,
    quality: ProxyQuality
  ): Promise<void>;
  extractWaveform(
    filePath: string,
    outputPath: string,
    resolution: number
  ): Promise<WaveformData>;
}

export type ProxyQuality = "low" | "medium" | "high";

export interface WaveformData {
  readonly sampleRate: number;
  readonly durationSeconds: number;
  readonly peaks: ReadonlyArray<number>;
  readonly rms: ReadonlyArray<number>;
}

/**
 * Null adapter — safe for environments without FFmpeg installed.
 * Returns plausible empty metadata so the pipeline never crashes.
 */
export class NullFfmpegAdapter implements FfmpegAdapter {
  public async probe(filePath: string): Promise<MediaMetadata> {
    return {
      format: "unknown",
      mimeType: "application/octet-stream",
      sizeBytes: 0,
      audioStreams: [],
      hasSubtitles: false,
    };
  }

  public async extractThumbnail(
    _filePath: string,
    _outputPath: string,
    _offsetSeconds: number
  ): Promise<void> {}

  public async generateProxy(
    _filePath: string,
    _outputPath: string,
    _quality: ProxyQuality
  ): Promise<void> {}

  public async extractWaveform(
    _filePath: string,
    _outputPath: string,
    _resolution: number
  ): Promise<WaveformData> {
    return { sampleRate: 44100, durationSeconds: 0, peaks: [], rms: [] };
  }
}
