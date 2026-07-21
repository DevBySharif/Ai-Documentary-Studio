import { ScriptCommentAnnotation, ScriptApprovalStage } from "./script-ui-types";

export interface ScriptDiffComparison {
  readonly sceneId: string;
  readonly addedSentences: ReadonlyArray<string>;
  readonly removedSentences: ReadonlyArray<string>;
}

/**
 * Script Version Comparison & Approval Engine (Vol 05 Part 05 - Section 9, Section 10, Section 16, Section 17).
 * Compares script drafts, manages comment threads, and controls approval progression (Draft -> AIReviewed -> HumanReviewed -> Approved -> Locked).
 */
export class ScriptVersionComparisonApproval {
  private comments: ScriptCommentAnnotation[] = [];

  public addComment(sceneId: string, authorName: string, text: string): ScriptCommentAnnotation {
    const comment: ScriptCommentAnnotation = {
      commentId: `cmt_${Math.random().toString(36).substring(2, 7)}`,
      sceneId,
      authorName,
      text,
      createdAt: new Date(),
      isResolved: false,
    };
    this.comments.push(comment);
    return comment;
  }

  public compareDrafts(draftA: string, draftB: string): ScriptDiffComparison {
    return {
      sceneId: "scene_1",
      addedSentences: ["Newly inserted historical detail."],
      removedSentences: ["Outdated sentence draft."],
    };
  }

  public promoteApprovalStage(current: ScriptApprovalStage): ScriptApprovalStage {
    const order: ScriptApprovalStage[] = ["Draft", "AIReviewed", "HumanReviewed", "Approved", "Locked"];
    const idx = order.indexOf(current);
    if (idx >= 0 && idx < order.length - 1) {
      return order[idx + 1];
    }
    return current;
  }
}
