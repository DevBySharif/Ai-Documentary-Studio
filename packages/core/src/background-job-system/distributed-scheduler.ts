import { WorkerNodeLocation, Job } from './types';

export interface WorkerNode {
  id: string;
  location: WorkerNodeLocation;
  capabilities: string[]; // e.g. ["GPU_RENDERING", "FAST_IO", "HEAVY_COMPUTE"]
  available: boolean;
  pingMs: number;
}

export class DistributedJobScheduler {
  private nodes: Map<string, WorkerNode> = new Map();

  registerNode(node: WorkerNode): void {
    this.nodes.set(node.id, node);
  }

  unregisterNode(nodeId: string): void {
    this.nodes.delete(nodeId);
  }

  getBestNodeForJob(job: Job): WorkerNode | undefined {
    // Basic logic: filter by availability and required capabilities, then pick local > remote > cloud
    // This can be expanded to analyze job payload requirements and match node capabilities
    const availableNodes = Array.from(this.nodes.values()).filter(n => n.available);
    if (availableNodes.length === 0) return undefined;

    // Favor Local
    const local = availableNodes.find(n => n.location === 'Local');
    if (local) return local;

    // Favor Remote
    const remote = availableNodes.find(n => n.location === 'Remote');
    if (remote) return remote;

    // Fallback to Cloud
    const cloud = availableNodes.find(n => n.location === 'Cloud');
    return cloud;
  }
}
