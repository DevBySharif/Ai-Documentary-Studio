export interface StyleDriftResult {
  assetId: string;
  styleDrift: boolean;
  lightingDrift: boolean;
  colorDrift: boolean;
  compositionDrift: boolean;
  characterDrift: boolean;
  issues: string[];
}

export class StyleHealthCheck {
  check(assets: Array<{ id: string; styleScore: number; lightingScore: number; colorScore: number; compositionScore: number; characterScore: number }>, threshold = 60): StyleDriftResult[] {
    return assets.map((a) => {
      const issues: string[] = [];
      if (a.styleScore < threshold) { issues.push("Style Drift"); }
      if (a.lightingScore < threshold) { issues.push("Lighting Drift"); }
      if (a.colorScore < threshold) { issues.push("Color Drift"); }
      if (a.compositionScore < threshold) { issues.push("Composition Drift"); }
      if (a.characterScore < threshold) { issues.push("Character Drift"); }

      return {
        assetId: a.id,
        styleDrift: a.styleScore < threshold,
        lightingDrift: a.lightingScore < threshold,
        colorDrift: a.colorScore < threshold,
        compositionDrift: a.compositionScore < threshold,
        characterDrift: a.characterScore < threshold,
        issues
      };
    });
  }

  findInconsistent(results: StyleDriftResult[]): StyleDriftResult[] {
    return results.filter((r) => r.issues.length >= 2);
  }
}
