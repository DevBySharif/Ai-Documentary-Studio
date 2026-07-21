import type { AIntBreathEvent, AIntPause } from "./types.js";

export class AIntIntelligentBreathEngine {
  classify(pauses: AIntPause[], audioEnergy: number[]): AIntBreathEvent[] {
    const events: AIntBreathEvent[] = [];

    for (const pause of pauses) {
      const surroundingEnergy = this.getSurroundingEnergy(audioEnergy, pause.start, pause.end);
      const type = this.classifyBreath(pause.duration, surroundingEnergy);

      events.push({
        start: pause.start,
        end: pause.end,
        type,
        intensity: Math.min(1, pause.duration / 2)
      });
    }

    return events;
  }

  private getSurroundingEnergy(energy: number[], startSec: number, endSec: number): number {
    const startIdx = Math.floor(startSec);
    const endIdx = Math.floor(endSec);
    if (startIdx >= energy.length || endIdx <= 0) return 0.5;
    const slice = energy.slice(Math.max(0, startIdx), Math.min(energy.length, endIdx));
    return slice.length > 0 ? slice.reduce((s, v) => s + v, 0) / slice.length : 0.5;
  }

  private classifyBreath(duration: number, surroundingEnergy: number): AIntBreathEvent["type"] {
    if (duration > 1.0 && surroundingEnergy > 0.6) return "dramatic_inhale";
    if (duration > 0.7) return "reflection_pause";
    if (duration > 0.4 && surroundingEnergy < 0.3) return "emotional_pause";
    return "natural_breathing";
  }

  suggestVisualAction(breath: AIntBreathEvent): string {
    switch (breath.type) {
      case "dramatic_inhale": return "slow_camera_push_in";
      case "reflection_pause": return "extended_visual_hold";
      case "emotional_pause": return "gentle_transition";
      case "natural_breathing": return "image_change";
    }
  }
}
