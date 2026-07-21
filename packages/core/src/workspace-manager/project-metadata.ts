import type { WMProjectMeta } from "./types.js";

export class WMProjectMetadata {
  private metadata: Map<string, WMProjectMeta> = new Map();

  create(projectId: string, name: string, channel: string): WMProjectMeta {
    const meta: WMProjectMeta = {
      projectId, name, channel,
      createdDate: Date.now(), lastModified: Date.now(),
      version: "1.0", status: "planning", tags: []
    };
    this.metadata.set(projectId, meta);
    return meta;
  }

  update(projectId: string, partial: Partial<WMProjectMeta>): void {
    const existing = this.metadata.get(projectId);
    if (existing) this.metadata.set(projectId, { ...existing, ...partial, lastModified: Date.now() });
  }

  get(projectId: string): WMProjectMeta | undefined {
    const meta = this.metadata.get(projectId);
    return meta ? { ...meta } : undefined;
  }

  search(query: string): WMProjectMeta[] {
    return Array.from(this.metadata.values()).filter(
      (m) => m.name.toLowerCase().includes(query.toLowerCase()) || m.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
    );
  }

  getAll(): WMProjectMeta[] {
    return Array.from(this.metadata.values()).map((m) => ({ ...m }));
  }

  delete(projectId: string): boolean {
    return this.metadata.delete(projectId);
  }
}
