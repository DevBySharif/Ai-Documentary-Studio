export class TimelineSimulator {
  simulate(blockCount: number, totalDuration: number): {
    attentionScore: number;
    cognitiveLoad: number;
    visualRhythm: string;
    motionFlow: string;
    subtitleReadability: string;
    syncQuality: number;
    issues: string[];
  } {
    const issues: string[] = [];
    const density = totalDuration > 0 ? blockCount / totalDuration : 0;

    let attentionScore = 85;
    let cognitiveLoad = 40;

    if (density > 0.5) {
      issues.push("High block density may overwhelm viewer");
      attentionScore -= 15;
      cognitiveLoad += 20;
    }

    if (density < 0.1 && blockCount > 3) {
      issues.push("Sparse timeline — consider adding visual interest");
      attentionScore -= 10;
    }

    if (blockCount > 100) {
      issues.push("Large timeline — verify performance");
    }

    const rhythm = density > 0.3 ? "fast" : density > 0.15 ? "medium" : "calm";
    const motionFlow = density > 0.4 ? "busy" : "smooth";
    const subtitleReadability = density > 0.4 ? "crowded" : "clear";

    return {
      attentionScore: Math.max(0, attentionScore),
      cognitiveLoad: Math.min(100, cognitiveLoad),
      visualRhythm: rhythm,
      motionFlow,
      subtitleReadability,
      syncQuality: Math.round(Math.max(0, 90 - density * 30)),
      issues,
    };
  }
}
