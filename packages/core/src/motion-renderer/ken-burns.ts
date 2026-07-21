import type { MRKenBurnsPlan, MRCurveType } from "./types.js";

export class MRKenBurnsEngine {
  generate(imageWidth: number, imageHeight: number, subjectX: number, subjectY: number, subjectWidth: number, subjectHeight: number, duration: number): MRKenBurnsPlan {
    const margin = 0.1;
    const entryZoom = Math.max(imageWidth / (subjectWidth * 3), imageHeight / (subjectHeight * 3));
    const entryX = Math.max(0, Math.min(imageWidth, subjectX - imageWidth / (2 * entryZoom)));
    const entryY = Math.max(0, Math.min(imageHeight, subjectY - imageHeight / (2 * entryZoom)));

    const exitZoom = Math.min(entryZoom * 1.3, 2.0);
    const exitX = imageWidth / 2 - imageWidth / (2 * exitZoom);
    const exitY = imageHeight / 2 - imageHeight / (2 * exitZoom);

    const curve: MRCurveType = duration > 8 ? "ease_in_out" : "ease_out";

    return {
      entryPoint: { x: entryX, y: entryY, zoom: Math.max(1, entryZoom) },
      exitPoint: { x: Math.max(0, exitX), y: Math.max(0, exitY), zoom: exitZoom },
      subjectPriority: 0.8,
      curve
    };
  }

  interpolate(plan: MRKenBurnsPlan, t: number): { x: number; y: number; zoom: number } {
    return {
      x: plan.entryPoint.x + (plan.exitPoint.x - plan.entryPoint.x) * t,
      y: plan.entryPoint.y + (plan.exitPoint.y - plan.entryPoint.y) * t,
      zoom: plan.entryPoint.zoom + (plan.exitPoint.zoom - plan.entryPoint.zoom) * t
    };
  }
}
