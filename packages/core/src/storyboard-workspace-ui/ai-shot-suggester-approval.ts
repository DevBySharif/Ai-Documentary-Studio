import { ShotApprovalStage } from "./storyboard-ui-types";

export interface ShotRecommendation {
  readonly recommendationId: string;
  readonly sceneId: string;
  readonly type: "EstablishingShot" | "CloseUp" | "Cutaway" | "BRoll" | "TransitionShot" | "EmotionalInsert";
  readonly description: string;
}

/**
 * AI Shot Suggestion Engine & Shot Approval Workflow (Vol 05 Part 06 - Section 10, Section 17).
 * Recommends non-destructive shot additions and controls approval progression (Planned -> AISuggested -> UnderReview -> Approved -> Locked).
 */
export class AiShotSuggesterApproval {
  public generateShotSuggestions(sceneId: string): ReadonlyArray<ShotRecommendation> {
    return [
      {
        recommendationId: "rec_1",
        sceneId,
        type: "EstablishingShot",
        description: "Wide aerial shot of London steam railway terminal at dawn.",
      },
      {
        recommendationId: "rec_2",
        sceneId,
        type: "CloseUp",
        description: "Macro close-up of iron gears interlocking in locomotion engine.",
      },
    ];
  }

  public promoteShotApprovalStage(current: ShotApprovalStage): ShotApprovalStage {
    const order: ShotApprovalStage[] = ["Planned", "AISuggested", "UnderReview", "Approved", "Locked"];
    const idx = order.indexOf(current);
    if (idx >= 0 && idx < order.length - 1) {
      return order[idx + 1];
    }
    return current;
  }
}
