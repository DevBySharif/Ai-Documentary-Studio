import type { MasterTimeline, TimelineBlock, TimelineLayer } from "./types.js";

export interface TimelineValidationIssue {
  type: string;
  severity: "error" | "warning";
  description: string;
  time?: number;
  scene?: number;
}

export class TimelineValidator {
  validate(timeline: MasterTimeline): { passed: boolean; issues: TimelineValidationIssue[] } {
    const issues: TimelineValidationIssue[] = [];

    issues.push(...this.checkMissingImages(timeline));
    issues.push(...this.checkMissingAudio(timeline));
    issues.push(...this.checkOverlappingMotion(timeline));
    issues.push(...this.checkSubtitleCollisions(timeline));
    issues.push(...this.checkImageCollisions(timeline));
    issues.push(...this.checkTimingConflicts(timeline));
    issues.push(...this.checkBlockOrder(timeline));
    issues.push(...this.checkDurationAlignment(timeline));
    issues.push(...this.checkPriorityBalance(timeline));

    const errors = issues.filter((i) => i.severity === "error").length;

    return {
      passed: errors === 0,
      issues,
    };
  }

  private checkMissingImages(timeline: MasterTimeline): TimelineValidationIssue[] {
    const issues: TimelineValidationIssue[] = [];
    for (const block of timeline.blocks) {
      if (!block.imageId) {
        issues.push({
          type: "missing_image",
          severity: "error",
          description: `Block ${block.id} (scene ${block.scene}) has no image assigned`,
          time: block.start,
          scene: block.scene,
        });
      }
    }
    return issues;
  }

  private checkMissingAudio(timeline: MasterTimeline): TimelineValidationIssue[] {
    const issues: TimelineValidationIssue[] = [];
    if (timeline.blocks.length === 0) {
      issues.push({
        type: "missing_audio",
        severity: "error",
        description: "No blocks in timeline — missing audio entirely",
      });
    }
    return issues;
  }

  private checkOverlappingMotion(timeline: MasterTimeline): TimelineValidationIssue[] {
    const issues: TimelineValidationIssue[] = [];
    for (let i = 1; i < timeline.blocks.length; i++) {
      const prev = timeline.blocks[i - 1];
      const curr = timeline.blocks[i];
      if (prev.end > curr.start + 0.1) {
        issues.push({
          type: "overlapping_motion",
          severity: "error",
          description: `Block ${prev.id} (end ${prev.end}) overlaps with ${curr.id} (start ${curr.start})`,
          time: curr.start,
          scene: curr.scene,
        });
      }
    }
    return issues;
  }

  private checkSubtitleCollisions(timeline: MasterTimeline): TimelineValidationIssue[] {
    const issues: TimelineValidationIssue[] = [];
    const subtitleLayer = timeline.layers.find((l) => l.type === "subtitle");
    if (!subtitleLayer) return issues;

    for (let i = 1; i < subtitleLayer.blocks.length; i++) {
      const prev = subtitleLayer.blocks[i - 1];
      const curr = subtitleLayer.blocks[i];
      if (prev.end > curr.start) {
        issues.push({
          type: "subtitle_collision",
          severity: "warning",
          description: `Subtitle overlap between block ${prev.id} and ${curr.id}`,
          time: curr.start,
        });
      }
    }
    return issues;
  }

  private checkImageCollisions(timeline: MasterTimeline): TimelineValidationIssue[] {
    const issues: TimelineValidationIssue[] = [];
    const imageByScene = new Map<number, TimelineBlock[]>();

    for (const block of timeline.blocks) {
      const existing = imageByScene.get(block.scene) ?? [];
      existing.push(block);
      imageByScene.set(block.scene, existing);
    }

    for (const [scene, blocks] of imageByScene) {
      for (let i = 1; i < blocks.length; i++) {
        if (blocks[i].imageId === blocks[i - 1].imageId && blocks[i].start - blocks[i - 1].end > 0.5) {
          issues.push({
            type: "image_collision",
            severity: "warning",
            description: `Same image ${blocks[i].imageId} reused non-consecutively in scene ${scene}`,
            scene,
          });
        }
      }
    }

    return issues;
  }

  private checkTimingConflicts(timeline: MasterTimeline): TimelineValidationIssue[] {
    const issues: TimelineValidationIssue[] = [];

    for (const block of timeline.blocks) {
      if (block.end <= block.start) {
        issues.push({
          type: "timing_conflict",
          severity: "error",
          description: `Block ${block.id} has end (${block.end}) <= start (${block.start})`,
          time: block.start,
          scene: block.scene,
        });
      }

      const blockDuration = block.end - block.start;
      if (blockDuration <= 0) {
        issues.push({
          type: "timing_conflict",
          severity: "error",
          description: `Block ${block.id} has non-positive duration (${blockDuration}s)`,
          time: block.start,
          scene: block.scene,
        });
      }
    }

    return issues;
  }

  private checkBlockOrder(timeline: MasterTimeline): TimelineValidationIssue[] {
    const issues: TimelineValidationIssue[] = [];
    for (let i = 1; i < timeline.blocks.length; i++) {
      if (timeline.blocks[i].scene < timeline.blocks[i - 1].scene) {
        issues.push({
          type: "block_order",
          severity: "error",
          description: `Block ${timeline.blocks[i].id} scene ${timeline.blocks[i].scene} appears after scene ${timeline.blocks[i - 1].scene}`,
          time: timeline.blocks[i].start,
          scene: timeline.blocks[i].scene,
        });
      }
    }
    return issues;
  }

  private checkDurationAlignment(timeline: MasterTimeline): TimelineValidationIssue[] {
    const issues: TimelineValidationIssue[] = [];
    const lastBlock = timeline.blocks[timeline.blocks.length - 1];
    if (lastBlock && Math.abs(lastBlock.end - timeline.totalDuration) > 2) {
      issues.push({
        type: "duration_alignment",
        severity: "warning",
        description: `Last block ends at ${lastBlock.end}s but total duration is ${timeline.totalDuration}s`,
        time: lastBlock.end,
      });
    }
    return issues;
  }

  private checkPriorityBalance(timeline: MasterTimeline): TimelineValidationIssue[] {
    const issues: TimelineValidationIssue[] = [];
    const criticalCount = timeline.blocks.filter((b) => b.priority === "critical").length;
    const totalCount = timeline.blocks.length;

    if (totalCount > 0 && criticalCount > totalCount * 0.3) {
      issues.push({
        type: "priority_balance",
        severity: "warning",
        description: `${criticalCount}/${totalCount} blocks marked critical — too many high-priority blocks dilutes emphasis`,
      });
    }

    return issues;
  }
}
