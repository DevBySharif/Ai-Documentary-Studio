import type { GRHardwareEncoder, GRHardwareProfile } from "./types.js";

export class GRHardwareEncoders {
  private readonly encoders: GRHardwareEncoder[] = ["nvenc", "qsv", "amf", "videotoolbox", "software"];

  selectBest(profile: GRHardwareProfile): GRHardwareEncoder {
    if (profile.vendor === "nvidia" && this.isAvailable("nvenc")) return "nvenc";
    if (profile.vendor === "intel" && this.isAvailable("qsv")) return "qsv";
    if (profile.vendor === "amd" && this.isAvailable("amf")) return "amf";
    if (profile.vendor === "apple" && this.isAvailable("videotoolbox")) return "videotoolbox";
    return "software";
  }

  isAvailable(encoder: GRHardwareEncoder): boolean {
    switch (encoder) {
      case "nvenc": return true;
      case "qsv": return true;
      case "amf": return true;
      case "videotoolbox": return true;
      case "software": return true;
    }
  }

  getEncoderName(encoder: GRHardwareEncoder): string {
    const names: Record<GRHardwareEncoder, string> = {
      nvenc: "NVIDIA NVENC",
      qsv: "Intel Quick Sync",
      amf: "AMD AMF",
      videotoolbox: "Apple VideoToolbox",
      software: "Software (x264)"
    };
    return names[encoder];
  }

  getAllEncoders(): GRHardwareEncoder[] {
    return [...this.encoders];
  }
}
