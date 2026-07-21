export interface RenderWorkerNode {
  readonly nodeName: string;
  readonly type: "Local" | "RemoteWorker" | "CloudFarm";
  readonly gpuCapabilities: ReadonlyArray<string>;
  readonly isAvailable: boolean;
}

/**
 * Distributed Rendering Abstraction (IB Part 21 - Section 24).
 * Prepared for future local/remote/cloud render farm expansion.
 */
export class DistributedRenderPool {
  private workers: RenderWorkerNode[] = [
    {
      nodeName: "LocalGPUNode",
      type: "Local",
      gpuCapabilities: ["NVENC", "ProRes", "Vulkan"],
      isAvailable: true,
    },
  ];

  public listAvailableNodes(): ReadonlyArray<RenderWorkerNode> {
    return this.workers.filter((w) => w.isAvailable);
  }

  public registerWorkerNode(node: RenderWorkerNode): void {
    this.workers.push(node);
  }
}
