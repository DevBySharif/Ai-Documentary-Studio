import type { FocusTarget } from "./types.js";

export class SceneFocusEngine {
  private priority: FocusTarget["type"][] = ["face", "symbol", "object", "background"];

  determineFocus(targets: FocusTarget[]): FocusTarget | null {
    for (const type of this.priority) {
      const found = targets.find((t) => t.type === type);
      if (found) return found;
    }
    return targets[0] ?? null;
  }

  setPriority(priority: FocusTarget["type"][]): void {
    if (priority.length > 0) this.priority = priority;
  }

  shouldSoftenBackground(targets: FocusTarget[]): boolean {
    const focus = this.determineFocus(targets);
    return focus?.type === "face" || focus?.type === "symbol";
  }
}
