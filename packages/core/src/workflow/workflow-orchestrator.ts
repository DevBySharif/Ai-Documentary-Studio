import type { EngineNode, WorkflowEdge, WorkflowStep, WorkflowExecution } from "./types.js";

const DEFAULT_EDGES: WorkflowEdge[] = [
  { from: "research", to: "channel_dna" },
  { from: "channel_dna", to: "project_dna" },
  { from: "project_dna", to: "narrative_planner" },
  { from: "narrative_planner", to: "story_engine" },
  { from: "story_engine", to: "visual_storyboard" },
  { from: "visual_storyboard", to: "prompt_intelligence" },
  { from: "prompt_intelligence", to: "memory_manager" },
  { from: "memory_manager", to: "google_flow" },
  { from: "google_flow", to: "image_library" },
  { from: "image_library", to: "audio_intelligence" },
  { from: "audio_intelligence", to: "whisper" },
  { from: "whisper", to: "timeline_engine" },
  { from: "timeline_engine", to: "motion_engine" },
  { from: "motion_engine", to: "quality_engine" },
  { from: "quality_engine", to: "renderer" },
];

const PARALLEL_GROUPS: EngineNode[][] = [
  ["prompt_intelligence", "memory_manager"],
  ["google_flow", "image_library"],
  ["audio_intelligence", "whisper"],
];

export class WorkflowOrchestrator {
  private edges: WorkflowEdge[];
  private executions: Map<string, WorkflowExecution> = new Map();

  constructor(edges?: WorkflowEdge[]) {
    this.edges = edges ?? DEFAULT_EDGES;
  }

  createExecution(projectId: string): WorkflowExecution {
    const nodes = this.getTopologicalOrder();
    const execution: WorkflowExecution = {
      projectId,
      steps: nodes.map((node) => ({
        node,
        status: "pending",
        retryCount: 0,
      })),
      currentStep: null,
      status: "running",
      startedAt: new Date().toISOString(),
    };
    this.executions.set(projectId, execution);
    return execution;
  }

  getNextReady(projectId: string): EngineNode[] {
    const execution = this.executions.get(projectId);
    if (!execution || execution.status !== "running") return [];

    const completed = new Set(
      execution.steps.filter((s) => s.status === "completed").map((s) => s.node)
    );

    const running = execution.steps.filter((s) => s.status === "running").map((s) => s.node);
    if (running.length > 0) return [];

    const ready: EngineNode[] = [];

    for (const step of execution.steps) {
      if (step.status !== "pending") continue;
      const deps = this.getDependencies(step.node);
      const allDepsMet = deps.length === 0 || deps.every((d) => completed.has(d));
      if (allDepsMet) ready.push(step.node);
    }

    return this.groupParallel(ready);
  }

  markCompleted(projectId: string, node: EngineNode): void {
    const execution = this.executions.get(projectId);
    if (!execution) return;
    const step = execution.steps.find((s) => s.node === node);
    if (!step) return;
    step.status = "completed";
    step.completedAt = new Date().toISOString();
    execution.currentStep = null;

    const allDone = execution.steps.every((s) => s.status === "completed");
    if (allDone) {
      execution.status = "completed";
      execution.completedAt = new Date().toISOString();
    }
  }

  markFailed(projectId: string, node: EngineNode, error: string): void {
    const execution = this.executions.get(projectId);
    if (!execution) return;
    const step = execution.steps.find((s) => s.node === node);
    if (!step) return;
    step.status = "failed";
    step.error = error;
    execution.status = "failed";
  }

  markRunning(projectId: string, node: EngineNode): void {
    const execution = this.executions.get(projectId);
    if (!execution) return;
    const step = execution.steps.find((s) => s.node === node);
    if (!step) return;
    step.status = "running";
    step.startedAt = new Date().toISOString();
    execution.currentStep = node;
  }

  retry(projectId: string, node: EngineNode): boolean {
    const execution = this.executions.get(projectId);
    if (!execution) return false;
    const step = execution.steps.find((s) => s.node === node);
    if (!step || step.retryCount >= 3) return false;
    step.retryCount++;
    step.status = "pending";
    step.error = undefined;
    execution.status = "running";
    return true;
  }

  validateDependencies(): string[] {
    const warnings: string[] = [];

    for (const [i, group] of PARALLEL_GROUPS.entries()) {
      for (let j = 0; j < group.length; j++) {
        for (let k = j + 1; k < group.length; k++) {
          const a = group[j];
          const b = group[k];
          if (this.getDependencies(a).includes(b)) {
            warnings.push(`${a} depends on ${b} but they're in the same parallel group ${i}`);
          }
          if (this.getDependencies(b).includes(a)) {
            warnings.push(`${b} depends on ${a} but they're in the same parallel group ${i}`);
          }
        }
      }
    }

    return warnings;
  }

  getExecution(projectId: string): WorkflowExecution | undefined {
    return this.executions.get(projectId);
  }

  getProgress(projectId: string): number {
    const execution = this.executions.get(projectId);
    if (!execution) return 0;
    const total = execution.steps.length;
    const done = execution.steps.filter((s) => s.status === "completed").length;
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }

  private getTopologicalOrder(): EngineNode[] {
    const visited = new Set<EngineNode>();
    const order: EngineNode[] = [];
    const nodes = new Set<EngineNode>();
    for (const e of this.edges) {
      nodes.add(e.from);
      nodes.add(e.to);
    }

    const visit = (node: EngineNode): void => {
      if (visited.has(node)) return;
      visited.add(node);
      for (const e of this.edges) {
        if (e.to === node) visit(e.from);
      }
      order.push(node);
    };

    for (const node of nodes) visit(node);
    return order;
  }

  private getDependencies(node: EngineNode): EngineNode[] {
    return this.edges.filter((e) => e.to === node).map((e) => e.from);
  }

  private groupParallel(ready: EngineNode[]): EngineNode[] {
    const used = new Set<EngineNode>();
    const result: EngineNode[] = [];

    for (const group of PARALLEL_GROUPS) {
      const inGroup = group.filter((n) => ready.includes(n) && !used.has(n));
      if (inGroup.length > 0) {
        result.push(...inGroup);
        inGroup.forEach((n) => used.add(n));
      }
    }

    for (const node of ready) {
      if (!used.has(node)) result.push(node);
    }

    return result;
  }
}
