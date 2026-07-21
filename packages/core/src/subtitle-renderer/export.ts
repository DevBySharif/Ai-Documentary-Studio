import type { SRSubtitleLine, SRExportFormat } from "./types.js";

export class SRBurnInExport {
  render(line: SRSubtitleLine): string {
    return `<subtitle start="${line.start}" end="${line.end}" pos="${line.position}">${line.text}</subtitle>`;
  }
}

export class SRSRTExport {
  private index = 0;

  render(lines: SRSubtitleLine[]): string {
    return lines.map((l) => {
      this.index++;
      return `${this.index}\n${this.formatTime(l.start)} --> ${this.formatTime(l.end)}\n${l.text}\n`;
    }).join("\n");
  }

  private formatTime(ms: number): string {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const ms2 = Math.floor(ms % 1000);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")},${ms2.toString().padStart(3, "0")}`;
  }
}

export class SRASSExport {
  render(lines: SRSubtitleLine[]): string {
    const header = "[Script Info]\nScriptType: v4.00+\n\n[Events]\nFormat: Layer, Start, End, Style, Text\n";
    const events = lines.map((l) => {
      const start = this.formatTime(l.start);
      const end = this.formatTime(l.end);
      return `Dialogue: 0,${start},${end},Default,${l.text}`;
    }).join("\n");
    return header + events;
  }

  private formatTime(ms: number): string {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = (ms % 60000) / 1000;
    return `${h}:${m.toString().padStart(2, "0")}:${s.toFixed(2)}`;
  }
}

export class SRVTTExport {
  render(lines: SRSubtitleLine[]): string {
    const header = "WEBVTT\n\n";
    return header + lines.map((l) => {
      return `${this.formatTime(l.start)} --> ${this.formatTime(l.end)}\n${l.text}\n`;
    }).join("\n");
  }

  private formatTime(ms: number): string {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const ms2 = Math.floor(ms % 1000);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms2.toString().padStart(3, "0")}`;
  }
}

export class SRJSONTimelineExport {
  render(lines: SRSubtitleLine[]): string {
    return JSON.stringify(lines.map((l) => ({
      text: l.text,
      startMs: l.start,
      endMs: l.end,
      position: l.position,
      animation: l.animation,
      highlightedWord: l.highlightedWord
    })), null, 2);
  }
}

export class SRExportManager {
  export(lines: SRSubtitleLine[], format: SRExportFormat): string {
    switch (format) {
      case "burn_in": return new SRBurnInExport().render(lines[0]);
      case "srt": return new SRSRTExport().render(lines);
      case "ass": return new SRASSExport().render(lines);
      case "vtt": return new SRVTTExport().render(lines);
      case "json_timeline": return new SRJSONTimelineExport().render(lines);
    }
  }
}
