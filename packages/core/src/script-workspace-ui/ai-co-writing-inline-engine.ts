import { ScriptInlineSuggestion } from "./script-ui-types";

/**
 * Live AI Co-Writing & Inline Suggestion Engine (Vol 05 Part 05 - Section 6, Section 14).
 * Delivers inline AI suggestions (expanding ideas, rewriting, improving transitions) requiring explicit user acceptance.
 */
export class AiCoWritingInlineEngine {
  private activeSuggestions: ScriptInlineSuggestion[] = [];

  public generateInlineSuggestion(
    sceneId: string,
    paragraphIndex: number,
    originalText: string,
    type: ScriptInlineSuggestion["suggestionType"]
  ): ScriptInlineSuggestion {
    const proposedText =
      type === "ImproveTransition"
        ? `Furthermore, ${originalText.toLowerCase()}`
        : `${originalText} Historical records further substantiate this pivot.`;

    const suggestion: ScriptInlineSuggestion = {
      suggestionId: `sug_${Math.random().toString(36).substring(2, 7)}`,
      sceneId,
      targetParagraphIndex: paragraphIndex,
      suggestionType: type,
      originalText,
      proposedText,
      rationale: `Enhanced dramatic pacing and narrative flow for documentary tone.`,
    };

    this.activeSuggestions.push(suggestion);
    return suggestion;
  }

  public getActiveSuggestions(sceneId: string): ReadonlyArray<ScriptInlineSuggestion> {
    return this.activeSuggestions.filter((s) => s.sceneId === sceneId);
  }
}
