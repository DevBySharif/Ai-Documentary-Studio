export class GRTextureStreaming {
  private loadedScenes: Set<string> = new Set();
  private maxLoaded = 3;

  configure(maxLoaded: number): void {
    this.maxLoaded = maxLoaded;
  }

  loadCurrent(scene: string): boolean {
    if (this.loadedScenes.has(scene)) return true;
    if (this.loadedScenes.size >= this.maxLoaded) return false;
    this.loadedScenes.add(scene);
    return true;
  }

  preloadNext(scene: string): void {
    if (this.loadedScenes.size < this.maxLoaded) {
      this.loadedScenes.add(scene);
    }
  }

  unloadOld(scene: string): void {
    this.loadedScenes.delete(scene);
  }

  getLoadedScenes(): string[] {
    return Array.from(this.loadedScenes);
  }

  isLoaded(scene: string): boolean {
    return this.loadedScenes.has(scene);
  }

  getMemoryEstimate(): number {
    return this.loadedScenes.size * 128;
  }

  clear(): void {
    this.loadedScenes.clear();
  }
}
