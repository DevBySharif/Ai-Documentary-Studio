export class WMProjectTagging {
  private tags: Map<string, string[]> = new Map();

  addTag(projectId: string, tag: string): void {
    if (!this.tags.has(projectId)) this.tags.set(projectId, []);
    const list = this.tags.get(projectId)!;
    if (!list.includes(tag)) list.push(tag);
  }

  removeTag(projectId: string, tag: string): void {
    const list = this.tags.get(projectId);
    if (list) this.tags.set(projectId, list.filter((t) => t !== tag));
  }

  getTags(projectId: string): string[] {
    return [...(this.tags.get(projectId) ?? [])];
  }

  findByTag(tag: string): string[] {
    const results: string[] = [];
    for (const [id, tags] of this.tags) {
      if (tags.includes(tag)) results.push(id);
    }
    return results;
  }

  removeProject(projectId: string): void {
    this.tags.delete(projectId);
  }
}
