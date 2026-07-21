import type { EEVideoCodec } from "./types.js";

export class EEVideoCodecs {
  private readonly codecs: EEVideoCodec[] = ["h264", "h265", "av1", "prores", "dnxhr"];

  isSupported(codec: EEVideoCodec): boolean {
    return this.codecs.includes(codec);
  }

  getCodecs(): EEVideoCodec[] {
    return [...this.codecs];
  }

  getCodecName(codec: EEVideoCodec): string {
    const map: Record<EEVideoCodec, string> = {
      h264: "H.264 / AVC", h265: "H.265 / HEVC", av1: "AV1",
      prores: "Apple ProRes", dnxhr: "Avid DNxHR"
    };
    return map[codec];
  }

  getFallback(codec: EEVideoCodec): EEVideoCodec {
    if (this.isSupported(codec)) return codec;
    return "h264";
  }
}
