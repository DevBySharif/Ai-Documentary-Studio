import type { QAStyleGuardianReport, QAStyleDimension } from "./types.js";

export class QAAIStyleGuardian {
  private channelDNA: Record<string, number> = {};

  setChannelDNA(dna: Record<string, number>): void {
    this.channelDNA = { ...dna };
  }

  inspect(sceneName: string, sceneDNA: Record<string, number>): { deviation: number; flagged: boolean } {
    let totalDeviation = 0;
    let count = 0;

    for (const [key, refValue] of Object.entries(this.channelDNA)) {
      const sceneValue = sceneDNA[key] ?? 0;
      totalDeviation += Math.abs(refValue - sceneValue);
      count++;
    }

    const deviation = count > 0 ? totalDeviation / count : 0;
    return { deviation, flagged: deviation > 0.2 };
  }

  getOverallReport(sceneReports: Array<{ name: string; dna: Record<string, number> }>): QAStyleGuardianReport {
    const flaggedScenes: string[] = [];
    let totalScore = 0;

    for (const scene of sceneReports) {
      const result = this.inspect(scene.name, scene.dna);
      const score = Math.round((1 - result.deviation) * 100);
      totalScore += score;
      if (result.flagged) flaggedScenes.push(scene.name);
    }

    const overall = sceneReports.length > 0 ? Math.round(totalScore / sceneReports.length) : 100;
    return {
      artStyle: overall, characterConsistency: overall, colorPalette: overall,
      cameraLanguage: overall, motionLanguage: overall, typography: overall,
      overall, flaggedScenes, deviations: flaggedScenes.map((s) => `Scene ${s} deviates from channel DNA`)
    };
  }
}
