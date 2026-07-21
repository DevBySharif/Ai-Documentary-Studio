import type { EEAudioCodec } from "./types.js";

export class EEAudioCodecs {
  private readonly codecs: EEAudioCodec[] = ["aac", "opus", "pcm", "flac"];

  isSupported(codec: EEAudioCodec): boolean {
    return this.codecs.includes(codec);
  }

  getCodecs(): EEAudioCodec[] {
    return [...this.codecs];
  }

  getCodecName(codec: EEAudioCodec): string {
    const map: Record<EEAudioCodec, string> = {
      aac: "AAC", opus: "Opus", pcm: "PCM / WAV", flac: "FLAC"
    };
    return map[codec];
  }
}
