import type { AutoRepairAction, FailureReport } from "./types.js";

export class AutoRepairEngine {
  suggestRepairs(failures: FailureReport[]): AutoRepairAction[] {
    const actions: AutoRepairAction[] = [];

    const priorityMap: Record<string, number> = { low: 1, medium: 2, high: 3, critical: 4 };

    const sorted = [...failures].sort((a, b) => (priorityMap[b.priority] ?? 0) - (priorityMap[a.priority] ?? 0));

    for (const failure of sorted) {
      const action = this.mapFailureToAction(failure);
      if (action) actions.push(action);
    }

    return actions;
  }

  private mapFailureToAction(failure: FailureReport): AutoRepairAction | null {
    const issue = failure.issue.toLowerCase();
    const module = failure.affectedModule.toLowerCase();

    if (issue.includes("prompt") || module.includes("prompt")) {
      return {
        type: "regenerate_prompt",
        targetId: failure.affectedModule,
        description: `Regenerate prompt: ${failure.issue}`,
        priority: failure.priority === "critical" ? 1 : 2,
        automatic: failure.priority !== "critical",
      };
    }

    if (issue.includes("image") || module.includes("image") || module.includes("vda")) {
      return {
        type: "replace_image",
        targetId: failure.affectedModule,
        description: `Replace problematic image: ${failure.issue}`,
        priority: 2,
        automatic: true,
      };
    }

    if (issue.includes("motion") || module.includes("editor") || module.includes("motion")) {
      return {
        type: "adjust_motion",
        targetId: failure.affectedModule,
        description: `Adjust motion parameters: ${failure.issue}`,
        priority: 3,
        automatic: false,
      };
    }

    if (issue.includes("hook") || issue.includes("cta") || module.includes("story")) {
      return {
        type: "rewrite_hook",
        targetId: failure.affectedModule,
        description: `Rewrite narrative element: ${failure.issue}`,
        priority: 1,
        automatic: false,
      };
    }

    if (issue.includes("sync") || issue.includes("timing") || module.includes("sync")) {
      return {
        type: "retime_scene",
        targetId: failure.affectedModule,
        description: `Retime scene/sync: ${failure.issue}`,
        priority: 2,
        automatic: false,
      };
    }

    if (issue.includes("audio") || module.includes("audio")) {
      return {
        type: "adjust_audio",
        targetId: failure.affectedModule,
        description: `Adjust audio: ${failure.issue}`,
        priority: 2,
        automatic: false,
      };
    }

    if (issue.includes("transition") || module.includes("transition")) {
      return {
        type: "fix_transition",
        targetId: failure.affectedModule,
        description: `Fix transition: ${failure.issue}`,
        priority: 3,
        automatic: true,
      };
    }

    return {
      type: "retry_generation",
      targetId: failure.affectedModule,
      description: `Retry generation for: ${failure.issue}`,
      priority: 3,
      automatic: true,
    };
  }
}
