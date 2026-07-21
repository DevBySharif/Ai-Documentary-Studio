import type { AMMasterProfile, AMExportProfile } from "./types.js";

export class AMMultiProfileMastering {
  private readonly profiles: Record<AMExportProfile, AMMasterProfile> = {
    youtube_long: { format: "aac", codec: "aac-lc", sampleRate: 48000, bitDepth: 16, bitrate: "256k", loudness: { integratedLUFS: -14, shortTermLUFS: -16, truePeak: -1 } },
    youtube_shorts: { format: "aac", codec: "aac-lc", sampleRate: 48000, bitDepth: 16, bitrate: "192k", loudness: { integratedLUFS: -13, shortTermLUFS: -15, truePeak: -1 } },
    podcast: { format: "mp3", codec: "mp3", sampleRate: 44100, bitDepth: 16, bitrate: "128k", loudness: { integratedLUFS: -16, shortTermLUFS: -18, truePeak: -1.5 } },
    instagram_reels: { format: "aac", codec: "aac-lc", sampleRate: 48000, bitDepth: 16, bitrate: "128k", loudness: { integratedLUFS: -12, shortTermLUFS: -14, truePeak: -0.5 } },
    tiktok: { format: "aac", codec: "aac-lc", sampleRate: 48000, bitDepth: 16, bitrate: "128k", loudness: { integratedLUFS: -11, shortTermLUFS: -13, truePeak: -0.5 } },
    local_archive_lossless: { format: "wav", codec: "pcm-f32le", sampleRate: 96000, bitDepth: 32, bitrate: "lossless", loudness: { integratedLUFS: -18, shortTermLUFS: -20, truePeak: -3 } }
  };

  getProfile(profile: AMExportProfile): AMMasterProfile {
    return { ...this.profiles[profile] };
  }

  getAllProfiles(): AMMasterProfile[] {
    return Object.values(this.profiles).map((p) => ({ ...p }));
  }

  getSupportedProfiles(): AMExportProfile[] {
    return Object.keys(this.profiles) as AMExportProfile[];
  }

  master(samples: Float64Array, fromProfile: AMExportProfile, toProfile: AMExportProfile): Float64Array {
    const target = this.profiles[toProfile];
    const { integratedLUFS: current } = this.measure(samples);
    const gain = target.loudness.integratedLUFS - current;
    const gainLinear = Math.pow(10, gain / 20);

    const result = new Float64Array(samples.length);
    for (let i = 0; i < samples.length; i++) {
      result[i] = samples[i] * gainLinear;
    }
    return result;
  }

  private measure(samples: Float64Array): { integratedLUFS: number } {
    let sum = 0;
    for (let i = 0; i < samples.length; i++) {
      sum += samples[i] * samples[i];
    }
    const rms = Math.sqrt(sum / samples.length);
    return { integratedLUFS: 20 * Math.log10(rms) };
  }
}
