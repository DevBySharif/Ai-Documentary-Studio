export class PAAssetHierarchy {
  private assets: Map<string, { projectId: string; sceneId?: string }> = new Map();
  private projects: Map<string, Set<string>> = new Map();
  private scenes: Map<string, Set<string>> = new Map();

  registerAsset(assetId: string, projectId: string, sceneId?: string): void {
    this.assets.set(assetId, { projectId, sceneId });
    if (!this.projects.has(projectId)) this.projects.set(projectId, new Set());
    this.projects.get(projectId)!.add(assetId);
    if (sceneId) {
      const key = `${projectId}:${sceneId}`;
      if (!this.scenes.has(key)) this.scenes.set(key, new Set());
      this.scenes.get(key)!.add(assetId);
    }
  }

  getAssetsByProject(projectId: string): string[] {
    return Array.from(this.projects.get(projectId) ?? []);
  }

  getAssetsByScene(projectId: string, sceneId: string): string[] {
    return Array.from(this.scenes.get(`${projectId}:${sceneId}`) ?? []);
  }

  getAssetPath(assetId: string): { workspace: string; project: string; scene: string } | undefined {
    const entry = this.assets.get(assetId);
    if (!entry) return undefined;
    return {
      workspace: "default",
      project: entry.projectId,
      scene: entry.sceneId ?? "root",
    };
  }
}
