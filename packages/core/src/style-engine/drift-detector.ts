import type { DriftReport, DriftThresholds, PermanentStyleDNA } from "./types.js";

interface DriftSnapshot {
  assetId: string;
  lineThickness: number;
  proportions: number;
  perspective: string;
  lighting: string;
  background: string;
  colorPalette: string[];
}

export const DEFAULT_DRIFT_THRESHOLDS: DriftThresholds = {
  lineThickness: 0.15,
  proportions: 0.1,
  perspective: 1,
  lighting: 1,
  background: 1,
  colorPalette: 2,
};

export class StyleDriftDetector {
  private snapshots: DriftSnapshot[] = [];

  record(assetId: string, snapshot: DriftSnapshot): void {
    this.snapshots.push(snapshot);
  }

  detect(projectId: string, thresholds: DriftThresholds = DEFAULT_DRIFT_THRESHOLDS): DriftReport {
    if (this.snapshots.length < 2) {
      return { projectId, driftDetected: false, score: 100, changes: [], affectedAssets: [], recommendation: "Need more samples to detect drift" };
    }

    const changes: DriftReport["changes"] = [];
    const affectedAssets: string[] = [];
    const baseline = this.snapshots[0];

    for (let i = 1; i < this.snapshots.length; i++) {
      const current = this.snapshots[i];

      const thicknessDrift = Math.abs(current.lineThickness - baseline.lineThickness);
      if (thicknessDrift > thresholds.lineThickness) {
        changes.push({ aspect: "line_thickness", severity: thicknessDrift > thresholds.lineThickness * 2 ? "major" : "moderate", detail: `Drift of ${thicknessDrift.toFixed(2)} from baseline ${baseline.lineThickness}` });
        affectedAssets.push(current.assetId);
      }

      const proportionDrift = Math.abs(current.proportions - baseline.proportions);
      if (proportionDrift > thresholds.proportions) {
        changes.push({ aspect: "proportions", severity: proportionDrift > thresholds.proportions * 2 ? "major" : "moderate", detail: `Proportion drift of ${proportionDrift.toFixed(2)}` });
        affectedAssets.push(current.assetId);
      }

      if (current.perspective !== baseline.perspective) {
        changes.push({ aspect: "perspective", severity: "major", detail: `Changed from ${baseline.perspective} to ${current.perspective}` });
        affectedAssets.push(current.assetId);
      }

      if (current.lighting !== baseline.lighting) {
        changes.push({ aspect: "lighting", severity: "moderate", detail: `Lighting changed from ${baseline.lighting} to ${current.lighting}` });
        affectedAssets.push(current.assetId);
      }

      if (current.background !== baseline.background) {
        changes.push({ aspect: "background", severity: "minor", detail: `Background changed from ${baseline.background} to ${current.background}` });
        affectedAssets.push(current.assetId);
      }

      const colorDrift = current.colorPalette.filter((c) => !baseline.colorPalette.includes(c)).length;
      if (colorDrift > thresholds.colorPalette) {
        changes.push({ aspect: "color_palette", severity: colorDrift > thresholds.colorPalette * 2 ? "major" : "minor", detail: `${colorDrift} new colors not in baseline` });
        affectedAssets.push(current.assetId);
      }
    }

    const uniqueAffected = [...new Set(affectedAssets)];
    const severityScores = { minor: 0.2, moderate: 0.5, major: 1 };
    const totalSeverity = changes.reduce((s, c) => s + (severityScores[c.severity] ?? 0), 0);

    const score = Math.max(0, Math.round(100 - (totalSeverity / Math.max(1, this.snapshots.length)) * 50));
    const driftDetected = changes.length > 0;

    const recommendation = driftDetected
      ? `Regenerate ${uniqueAffected.length} affected assets to restore consistency`
      : "No significant style drift detected";

    return {
      projectId,
      driftDetected,
      score,
      changes,
      affectedAssets: uniqueAffected,
      recommendation,
    };
  }

  clear(): void {
    this.snapshots = [];
  }

  getSnapshotCount(): number {
    return this.snapshots.length;
  }
}
