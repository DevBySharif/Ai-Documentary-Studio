import type { SRCollisionEvent, SRPosition } from "./types.js";

export class SRVisualCollisionDetector {
  check(subtitleBox: { x: number; y: number; width: number; height: number }, elements: Array<{ type: string; x: number; y: number; width: number; height: number; label: string }>): SRCollisionEvent[] {
    const events: SRCollisionEvent[] = [];

    for (const elem of elements) {
      if (this.overlaps(subtitleBox, elem)) {
        const type = elem.type as SRCollisionEvent["type"];
        const severity = (type === "face" || type === "subject") ? "critical" : "warning";
        const suggestedPosition = subtitleBox.y < 0.5 ? "bottom" : "top";
        events.push({ element: elem.label, type, severity, suggestedPosition });
      }
    }

    return events;
  }

  private overlaps(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }): boolean {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }

  suggestAlternativePosition(events: SRCollisionEvent[], currentPos: SRPosition): SRPosition {
    const criticals = events.filter((e) => e.severity === "critical");
    if (criticals.length === 0) return currentPos;
    const criticalPositions = criticals.map((e) => e.suggestedPosition);
    return criticalPositions[0] === "bottom" ? "top" : "bottom";
  }
}
