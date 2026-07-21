export interface QueueItem {
  projectId: string;
  priority: number;
  status: "queued" | "rendering" | "paused" | "completed" | "failed";
  queuedAt: string;
  startedAt?: string;
  completedAt?: string;
}

export class RenderQueue {
  private items: QueueItem[] = [];

  enqueue(projectId: string, priority = 0): QueueItem {
    const item: QueueItem = { projectId, priority, status: "queued", queuedAt: new Date().toISOString() };
    this.items.push(item);
    this.items.sort((a, b) => b.priority - a.priority);
    return item;
  }

  dequeue(): QueueItem | undefined {
    const next = this.items.find((i) => i.status === "queued");
    if (next) {
      next.status = "rendering";
      next.startedAt = new Date().toISOString();
    }
    return next;
  }

  pause(projectId: string): boolean {
    const item = this.items.find((i) => i.projectId === projectId && i.status === "rendering");
    if (item) { item.status = "paused"; return true; }
    return false;
  }

  resume(projectId: string): boolean {
    const item = this.items.find((i) => i.projectId === projectId && i.status === "paused");
    if (item) { item.status = "queued"; return true; }
    return false;
  }

  complete(projectId: string): void {
    const item = this.items.find((i) => i.projectId === projectId);
    if (item) { item.status = "completed"; item.completedAt = new Date().toISOString(); }
  }

  fail(projectId: string): void {
    const item = this.items.find((i) => i.projectId === projectId);
    if (item) item.status = "failed";
  }

  getQueue(): QueueItem[] {
    return [...this.items];
  }

  getPendingCount(): number {
    return this.items.filter((i) => i.status === "queued" || i.status === "rendering").length;
  }
}
