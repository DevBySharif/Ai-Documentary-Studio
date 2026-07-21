export class IPSeedManager {
  private globalSeeds: Map<string, number> = new Map();
  private sceneSeeds: Map<string, Map<string, number>> = new Map();
  private characterSeeds: Map<string, Map<string, number>> = new Map();
  private environmentSeeds: Map<string, Map<string, number>> = new Map();

  generateSeed(): number {
    return Math.floor(Math.random() * 2147483647);
  }

  setGlobal(projectId: string, seed: number): void {
    this.globalSeeds.set(projectId, seed);
  }

  getGlobal(projectId: string): number | undefined {
    return this.globalSeeds.get(projectId);
  }

  setSceneSeed(projectId: string, sceneId: string, seed: number): void {
    if (!this.sceneSeeds.has(projectId)) {
      this.sceneSeeds.set(projectId, new Map());
    }
    this.sceneSeeds.get(projectId)!.set(sceneId, seed);
  }

  getSceneSeed(projectId: string, sceneId: string): number {
    const globalBase = this.globalSeeds.get(projectId) ?? 0;
    const projectScenes = this.sceneSeeds.get(projectId);
    if (projectScenes?.has(sceneId)) {
      return projectScenes.get(sceneId)!;
    }
    const generated = this.generateSeed();
    if (!this.sceneSeeds.has(projectId)) {
      this.sceneSeeds.set(projectId, new Map());
    }
    this.sceneSeeds.get(projectId)!.set(sceneId, generated);
    return generated;
  }

  setCharacterSeed(projectId: string, characterId: string, seed: number): void {
    if (!this.characterSeeds.has(projectId)) {
      this.characterSeeds.set(projectId, new Map());
    }
    this.characterSeeds.get(projectId)!.set(characterId, seed);
  }

  getCharacterSeed(projectId: string, characterId: string): number {
    const globalBase = this.globalSeeds.get(projectId) ?? 0;
    const projectChars = this.characterSeeds.get(projectId);
    if (projectChars?.has(characterId)) {
      return projectChars.get(characterId)!;
    }
    const generated = ((globalBase + characterId.length * 7919) >>> 0) % 2147483647;
    if (!this.characterSeeds.has(projectId)) {
      this.characterSeeds.set(projectId, new Map());
    }
    this.characterSeeds.get(projectId)!.set(characterId, generated);
    return generated;
  }

  setEnvironmentSeed(projectId: string, envId: string, seed: number): void {
    if (!this.environmentSeeds.has(projectId)) {
      this.environmentSeeds.set(projectId, new Map());
    }
    this.environmentSeeds.get(projectId)!.set(envId, seed);
  }

  getEnvironmentSeed(projectId: string, envId: string): number {
    const globalBase = this.globalSeeds.get(projectId) ?? 0;
    const projectEnvs = this.environmentSeeds.get(projectId);
    if (projectEnvs?.has(envId)) {
      return projectEnvs.get(envId)!;
    }
    const generated = ((globalBase + envId.length * 6271) >>> 0) % 2147483647;
    if (!this.environmentSeeds.has(projectId)) {
      this.environmentSeeds.set(projectId, new Map());
    }
    this.environmentSeeds.get(projectId)!.set(envId, generated);
    return generated;
  }
}
