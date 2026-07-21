import type { ViewerAttentionPrediction } from "./types.js";
import type { AttentionCurvePoint } from "./types.js";

export class ViewerAttentionAI {
  predict(time: number, attentionCurve: AttentionCurvePoint[], segmentImportance: number): ViewerAttentionPrediction {
    const current = attentionCurve.find((p) => p.time <= time + 0.1 && p.time >= time - 0.1) ??
      attentionCurve.reduce((prev, curr) =>
        Math.abs(curr.time - time) < Math.abs(prev.time - time) ? curr : prev
      );

    const recentPoints = attentionCurve.filter((p) => p.time <= time && p.time >= time - 10);
    const trend = recentPoints.length >= 2
      ? recentPoints[recentPoints.length - 1].score - recentPoints[0].score
      : 0;

    const predictedDrop = trend < -10;
    const boredomRisk = current.score < 30 ? 80 : current.score < 50 ? 50 : current.score < 70 ? 20 : 5;

    let recommendation: string;
    if (predictedDrop || boredomRisk > 60) {
      recommendation = "Increase visual interest: camera movement, new image, or stronger emphasis";
    } else if (boredomRisk > 30) {
      recommendation = "Subtle motion adjustment to maintain engagement";
    } else {
      recommendation = "Maintain current pacing";
    }

    return {
      time,
      currentAttention: current.score,
      predictedDrop,
      boredomRisk,
      recommendation,
    };
  }
}
