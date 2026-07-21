export class APOfflineAIMode {
  private localProviders: string[] = [];

  detectLocal(): string[] {
    return this.localProviders;
  }

  registerLocal(name: string): void {
    if (!this.localProviders.includes(name)) this.localProviders.push(name);
  }

  isOfflineCapable(): boolean {
    return this.localProviders.length > 0;
  }

  getLocalProviders(): string[] {
    return [...this.localProviders];
  }
}
