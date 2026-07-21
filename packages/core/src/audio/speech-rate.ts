import type { SpeechRateMetrics } from "./types.js";

export class SpeechRateAnalyzer {
  analyze(words: Array<{ start: number; end: number }>, totalDuration: number): SpeechRateMetrics {
    const wordCount = words.length;
    const pauses = this.calculatePauses(words);
    const totalPauseDuration = pauses.reduce((s, p) => s + (p.end - p.start), 0);
    const speechDuration = totalDuration - totalPauseDuration;

    const wpm = speechDuration > 0 ? Math.round((wordCount / speechDuration) * 60) : 0;
    const wps = speechDuration > 0 ? Math.round((wordCount / speechDuration) * 100) / 100 : 0;
    const avgPause = pauses.length > 0 ? pauses.reduce((s, p) => s + (p.end - p.start), 0) / pauses.length : 0;

    const speakingSpeed: "slow" | "normal" | "fast" =
      wpm < 120 ? "slow" : wpm > 180 ? "fast" : "normal";

    const rhythm = this.detectRhythm(words);

    return {
      wordsPerMinute: wpm,
      wordsPerSecond: wps,
      speakingSpeed,
      averagePauseLength: Math.round(avgPause * 100) / 100,
      speechRhythm: rhythm,
    };
  }

  private calculatePauses(words: Array<{ start: number; end: number }>): Array<{ start: number; end: number }> {
    const pauses: Array<{ start: number; end: number }> = [];
    for (let i = 0; i < words.length - 1; i++) {
      const gap = words[i + 1].start - words[i].end;
      if (gap > 0.15) {
        pauses.push({ start: words[i].end, end: words[i + 1].start });
      }
    }
    return pauses;
  }

  private detectRhythm(words: Array<{ start: number; end: number }>): "steady" | "varied" | "irregular" {
    if (words.length < 5) return "steady";
    const durations = [];
    for (let i = 1; i < words.length; i++) {
      durations.push(words[i].start - words[i - 1].start);
    }
    const avg = durations.reduce((s, d) => s + d, 0) / durations.length;
    const variance = durations.reduce((s, d) => s + Math.pow(d - avg, 2), 0) / durations.length;
    if (variance < 0.01) return "steady";
    if (variance < 0.05) return "varied";
    return "irregular";
  }
}
