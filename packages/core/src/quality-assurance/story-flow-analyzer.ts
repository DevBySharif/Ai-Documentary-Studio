import type { QAStoryFlowReport } from "./types.js";

export class QAStoryFlowAnalyzer {
  analyze(transitions: number, pacing: number, density: number, rhythm: number, pauses: number, attention: number): QAStoryFlowReport {
    const overall = Math.round((transitions + pacing + density + rhythm + pauses + attention) / 6 * 100);
    const recommendations: string[] = [];

    if (pacing < 0.6) recommendations.push("Consider adjusting emotional pacing — scenes may feel rushed");
    if (density > 0.8) recommendations.push("Information density is high — consider adding more pauses");
    if (rhythm < 0.6) recommendations.push("Visual rhythm is uneven — review scene timing");
    if (attention < 0.6) recommendations.push("Viewer attention may drift — add engaging elements");
    if (transitions < 0.7) recommendations.push("Scene transitions feel abrupt — consider longer fades");

    return {
      sceneTransitions: Math.round(transitions * 100), emotionalPacing: Math.round(pacing * 100),
      informationDensity: Math.round(density * 100), visualRhythm: Math.round(rhythm * 100),
      pausePlacement: Math.round(pauses * 100), viewerAttention: Math.round(attention * 100),
      overall, recommendations
    };
  }

  feelsRushed(report: QAStoryFlowReport): boolean {
    return report.emotionalPacing < 60 || report.visualRhythm < 60;
  }

  feelsRepetitive(report: QAStoryFlowReport): boolean {
    return report.informationDensity < 30;
  }
}
