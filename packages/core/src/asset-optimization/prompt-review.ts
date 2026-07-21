import type { PromptReview } from "./types.js";

export class PromptQualityReviewer {
  review(prompts: Array<{ id: string; text: string; successRate: number }>): PromptReview[] {
    return prompts.map((p) => {
      let classification: PromptReview["classification"];
      let score: number;

      if (p.successRate >= 90 && p.text.length > 20) {
        classification = "excellent";
        score = 90;
      } else if (p.successRate >= 70) {
        classification = "good";
        score = 70;
      } else if (p.successRate >= 50) {
        classification = "average";
        score = 50;
      } else if (p.successRate >= 30) {
        classification = "weak";
        score = 30;
      } else {
        classification = "obsolete";
        score = 10;
      }

      return { promptId: p.id, prompt: p.text, classification, score };
    });
  }

  getWeakPrompts(reviews: PromptReview[]): PromptReview[] {
    return reviews.filter((r) => r.classification === "weak" || r.classification === "obsolete");
  }
}
