export interface AiEditingRecommendation {
  readonly recommendationId: string;
  readonly category: "CutPoint" | "Pacing" | "TransitionAlternative" | "MissingBRoll" | "NarrationSync";
  readonly framePosition: number;
  readonly explanation: string;
}

export interface ShortcutMapping {
  readonly actionName: string; // e.g. "Ripple Cut", "Split Clip", "Add Marker"
  readonly keyCombo: string;
}

/**
 * AI Editing Assistant & Shortcut Manager (Vol 05 Part 11 - Section 18, Section 20).
 * Generates non-destructive AI editing recommendations (cut points, pacing, missing B-roll) and maps professional NLE keyboard shortcuts.
 */
export class AiEditingAssistantShortcuts {
  private shortcuts: ShortcutMapping[] = [
    { actionName: "Play/Pause", keyCombo: "Space" },
    { actionName: "Split Clip", keyCombo: "Ctrl+K" },
    { actionName: "Ripple Delete", keyCombo: "Shift+Delete" },
    { actionName: "Add Marker", keyCombo: "M" },
    { actionName: "Step 1 Frame Forward", keyCombo: "RightArrow" },
    { actionName: "Step 1 Frame Backward", keyCombo: "LeftArrow" },
  ];

  public getEditingRecommendations(): ReadonlyArray<AiEditingRecommendation> {
    return [
      {
        recommendationId: "rec_edit_1",
        category: "CutPoint",
        framePosition: 144,
        explanation: "Cut to Shot 2 at narration pause to improve visual pacing.",
      },
      {
        recommendationId: "rec_edit_2",
        category: "MissingBRoll",
        framePosition: 320,
        explanation: "Insert archival map B-roll during geographic description.",
      },
    ];
  }

  public getShortcuts(): ReadonlyArray<ShortcutMapping> {
    return this.shortcuts;
  }
}
