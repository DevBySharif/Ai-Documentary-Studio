import type { RuleOfThirdsResult } from "./types.js";

export class RuleOfThirdsEngine {
  evaluate(subjectX: number, subjectY: number, frameWidth: number, frameHeight: number): RuleOfThirdsResult {
    const thirdW = frameWidth / 3;
    const thirdH = frameHeight / 3;

    const points = [
      { x: thirdW, y: thirdH },
      { x: thirdW * 2, y: thirdH },
      { x: thirdW, y: thirdH * 2 },
      { x: thirdW * 2, y: thirdH * 2 }
    ];

    const distances = points.map((p) => Math.sqrt((subjectX - p.x) ** 2 + (subjectY - p.y) ** 2));
    const minDist = Math.min(...distances);
    const subjectOnThird = minDist < Math.min(thirdW, thirdH) * 0.5;
    const score = subjectOnThird ? 90 : Math.max(0, 100 - minDist / 10);

    return { intersectionPoints: points, subjectOnThird, compositionScore: Math.round(score) };
  }

  suggestAdjustment(subjectX: number, subjectY: number, frameWidth: number, frameHeight: number): { dx: number; dy: number } {
    const thirdW = frameWidth / 3;
    const thirdH = frameHeight / 3;
    const nearest = [
      { x: thirdW, y: thirdH },
      { x: thirdW * 2, y: thirdH },
      { x: thirdW, y: thirdH * 2 },
      { x: thirdW * 2, y: thirdH * 2 }
    ].reduce((a, b) =>
      Math.sqrt((subjectX - a.x) ** 2 + (subjectY - a.y) ** 2) < Math.sqrt((subjectX - b.x) ** 2 + (subjectY - b.y) ** 2) ? a : b
    );
    return { dx: nearest.x - subjectX, dy: nearest.y - subjectY };
  }
}
