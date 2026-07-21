export type RenderNodeType =
  | "VideoInput"
  | "ColorCorrection"
  | "Transform"
  | "Overlay"
  | "Effect"
  | "Composite"
  | "Output";

export interface RenderNode {
  readonly id: string;
  readonly type: RenderNodeType;
  readonly inputs: ReadonlyArray<string>; // Node IDs
  readonly isDirty: boolean;
  readonly hasFailed?: boolean;
}

export type RenderNodeExecutionFn = (nodeId: string, inputResults: unknown[]) => Promise<unknown>;

/**
 * Directed Acyclic Graph (DAG) for frame rendering with Effect Isolation (IB Part 15 - Section 23).
 * Nodes execute only when their inputs change, and failed effects degrade gracefully.
 */
export class RenderGraph {
  private nodes = new Map<string, RenderNode>();

  public addNode(node: RenderNode): void {
    this.nodes.set(node.id, node);
  }

  public markDirty(nodeId: string): void {
    const node = this.nodes.get(nodeId);
    if (!node) return;

    this.nodes.set(nodeId, { ...node, isDirty: true });

    // Mark downstream nodes dirty
    for (const [id, n] of Array.from(this.nodes.entries())) {
      if (n.inputs.includes(nodeId)) {
        this.markDirty(id);
      }
    }
  }

  public getExecutionOrder(outputNodeId: string): ReadonlyArray<string> {
    const executionOrder: string[] = [];
    const visited = new Set<string>();

    const traverse = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);

      const node = this.nodes.get(id);
      if (!node) return;

      for (const inputId of node.inputs) {
        traverse(inputId);
      }
      executionOrder.push(id);
    };

    traverse(outputNodeId);
    return executionOrder;
  }

  /**
   * Executes the DAG with isolated node error handling (Effect Isolation).
   * A failed effect node is bypassed or degrades gracefully without crashing preview.
   */
  public async executeGraphIsolated(
    outputNodeId: string,
    executor: RenderNodeExecutionFn
  ): Promise<Map<string, unknown>> {
    const order = this.getExecutionOrder(outputNodeId);
    const nodeOutputs = new Map<string, unknown>();

    for (const nodeId of order) {
      const node = this.nodes.get(nodeId);
      if (!node) continue;

      const inputValues = node.inputs.map((inpId) => nodeOutputs.get(inpId));

      try {
        const result = await executor(nodeId, inputValues);
        nodeOutputs.set(nodeId, result);
        this.nodes.set(nodeId, { ...node, isDirty: false, hasFailed: false });
      } catch (err) {
        console.warn(`[RenderGraph] Node '${nodeId}' failed. Degrading gracefully (Effect Isolation).`, err);
        // Fallback to first input or null if effect fails
        const fallback = inputValues[0] ?? null;
        nodeOutputs.set(nodeId, fallback);
        this.nodes.set(nodeId, { ...node, isDirty: false, hasFailed: true });
      }
    }

    return nodeOutputs;
  }
}
