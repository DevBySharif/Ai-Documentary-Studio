import type { ContinuityReport, ContinuityCheck, ImageMemoryEntry } from "./types.js";

export class VisualContinuityEngine {
  check(
    sequence: Array<{
      sceneIndex: number;
      concept: string;
      camera: string;
      motion: string;
      emotion: string;
      colorMood: string;
      imageReused: boolean;
      image?: ImageMemoryEntry;
    }>
  ): ContinuityReport {
    const checks: ContinuityCheck[] = [];
    const issues: string[] = [];

    checks.push(this.checkAbruptJumps(sequence));
    checks.push(this.checkTransitionSmoothness(sequence));
    checks.push(this.checkColorContinuity(sequence));
    checks.push(this.checkCameraProgression(sequence));
    checks.push(this.checkRepeatedPatterns(sequence));
    checks.push(this.checkSymbolicConsistency(sequence));

    for (const c of checks) {
      if (c.status === "fail") issues.push(c.message);
    }

    const score = Math.round(
      checks.reduce((s, c) => {
        if (c.status === "pass") return s + 100;
        if (c.status === "warn") return s + 50;
        return s + 0;
      }, 0) / checks.length
    );

    return {
      passed: score >= 80,
      score,
      checks,
      issues,
    };
  }

  private checkAbruptJumps(
    sequence: Array<{ sceneIndex: number; concept: string; emotion: string }>
  ): ContinuityCheck {
    let abruptCount = 0;
    for (let i = 1; i < sequence.length; i++) {
      const prev = sequence[i - 1];
      const curr = sequence[i];
      if (prev.sceneIndex + 1 < curr.sceneIndex) {
        abruptCount++;
      }
    }
    if (abruptCount > 2) {
      return { name: "abrupt_jumps", status: "fail", message: `${abruptCount} abrupt scene jumps detected` };
    }
    return { name: "abrupt_jumps", status: "pass", message: "No abrupt jumps" };
  }

  private checkTransitionSmoothness(
    sequence: Array<{ imageReused: boolean; concept: string }>
  ): ContinuityCheck {
    let roughCount = 0;
    for (let i = 1; i < sequence.length; i++) {
      const prev = sequence[i - 1];
      const curr = sequence[i];
      if (!prev.imageReused && !curr.imageReused && prev.concept !== curr.concept) {
        roughCount++;
      }
    }
    if (roughCount > 3) {
      return { name: "transition_smoothness", status: "warn", message: `${roughCount} rough transitions between new images` };
    }
    return { name: "transition_smoothness", status: "pass", message: "Transitions are smooth" };
  }

  private checkColorContinuity(
    sequence: Array<{ colorMood: string }>
  ): ContinuityCheck {
    const moods = sequence.map((s) => s.colorMood);
    const unique = new Set(moods);
    if (unique.size > 3) {
      return { name: "color_continuity", status: "warn", message: `${unique.size} different color moods detected` };
    }
    return { name: "color_continuity", status: "pass", message: `Color mood consistent: ${Array.from(unique).join(", ")}` };
  }

  private checkCameraProgression(
    sequence: Array<{ camera: string }>
  ): ContinuityCheck {
    let repeated = 0;
    for (let i = 2; i < sequence.length; i++) {
      if (sequence[i].camera === sequence[i - 1].camera && sequence[i].camera === sequence[i - 2].camera) {
        repeated++;
      }
    }
    if (repeated > 1) {
      return { name: "camera_progression", status: "warn", message: `Same camera angle ${repeated + 2} times in a row` };
    }
    return { name: "camera_progression", status: "pass", message: "Camera angles vary appropriately" };
  }

  private checkRepeatedPatterns(
    sequence: Array<{ motion: string }>
  ): ContinuityCheck {
    let patternRepeat = 0;
    for (let i = 3; i < sequence.length; i++) {
      if (
        sequence[i].motion === sequence[i - 1].motion &&
        sequence[i - 1].motion === sequence[i - 2].motion &&
        sequence[i - 2].motion === sequence[i - 3].motion
      ) {
        patternRepeat++;
      }
    }
    if (patternRepeat > 0) {
      return { name: "repeated_patterns", status: "warn", message: `Motion pattern repeated ${patternRepeat + 4} times` };
    }
    return { name: "repeated_patterns", status: "pass", message: "No repetitive motion patterns" };
  }

  private checkSymbolicConsistency(
    sequence: Array<{ concept: string }>
  ): ContinuityCheck {
    const conceptCounts = new Map<string, number>();
    for (const s of sequence) {
      conceptCounts.set(s.concept, (conceptCounts.get(s.concept) || 0) + 1);
    }
    const repeatedConcepts = Array.from(conceptCounts.entries()).filter(([, c]) => c > 1);
    if (repeatedConcepts.length > 0) {
      return { name: "symbolic_consistency", status: "pass", message: `${repeatedConcepts.length} recurring concepts will use consistent symbols` };
    }
    return { name: "symbolic_consistency", status: "pass", message: "No recurring concepts detected" };
  }
}
