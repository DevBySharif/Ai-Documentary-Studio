import { VPProviderName } from "./types";

export interface VPSSMLOptions {
  pauses?: { after: string; duration: number }[];
  emphasis?: { text: string; level: "strong" | "moderate" | "reduced" }[];
  breaks?: { position: number; time: string }[];
  pitch?: number;
  volume?: number;
  rate?: number;
}

const SSML_SUPPORT: Set<VPProviderName> = new Set([
  "edge_tts",
  "google_cloud_tts",
  "azure_speech",
  "elevenlabs",
  "openai_tts",
  "kokoro",
  "amazon_polly",
]);

export class VPSSMLSupport {
  generateSSML(script: string, options: VPSSMLOptions): string {
    const escaped = this.escapeXML(script);
    let prosodyAttrs = "";
    if (options.pitch !== undefined) {
      const pitchStr = options.pitch >= 0 ? `+${options.pitch}%` : `${options.pitch}%`;
      prosodyAttrs += ` pitch="${pitchStr}"`;
    }
    if (options.volume !== undefined) {
      const volStr = options.volume >= 0 ? `+${options.volume}dB` : `${options.volume}dB`;
      prosodyAttrs += ` volume="${volStr}"`;
    }
    if (options.rate !== undefined) {
      const rateStr = options.rate >= 0 ? `+${options.rate}%` : `${options.rate}%`;
      prosodyAttrs += ` rate="${rateStr}"`;
    }

    let content = escaped;
    if (options.emphasis) {
      for (const em of options.emphasis) {
        const emEscaped = this.escapeXML(em.text);
        content = content.replace(
          emEscaped,
          `<emphasis level="${em.level}">${emEscaped}</emphasis>`
        );
      }
    }

    if (options.breaks) {
      const breakInserts: { pos: number; tag: string }[] = [];
      for (const br of options.breaks) {
        breakInserts.push({
          pos: br.position,
          tag: `<break time="${br.time}"/>`,
        });
      }
      breakInserts.sort((a, b) => b.pos - a.pos);
      for (const bi of breakInserts) {
        if (bi.pos < content.length) {
          content = content.slice(0, bi.pos) + bi.tag + content.slice(bi.pos);
        }
      }
    }

    if (options.pauses) {
      for (const p of options.pauses) {
        const pEscaped = this.escapeXML(p.after);
        const pauseTag = `<break time="${p.duration}ms"/>`;
        content = content.replace(pEscaped, pEscaped + pauseTag);
      }
    }

    if (prosodyAttrs) {
      content = `<prosody${prosodyAttrs}>${content}</prosody>`;
    }

    return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis">${content}</speak>`;
  }

  supportsSSML(provider: VPProviderName): boolean {
    return SSML_SUPPORT.has(provider);
  }

  stripSSML(ssml: string): string {
    return ssml
      .replace(/<speak[^>]*>/gi, "")
      .replace(/<\/speak>/gi, "")
      .replace(/<prosody[^>]*>/gi, "")
      .replace(/<\/prosody>/gi, "")
      .replace(/<emphasis[^>]*>/gi, "")
      .replace(/<\/emphasis>/gi, "")
      .replace(/<break[^>]*\/>/gi, "")
      .replace(/<[^>]+>/g, "")
      .trim();
  }

  private escapeXML(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }
}
