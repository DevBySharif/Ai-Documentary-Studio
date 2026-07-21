import type { ProductionPlaybook } from "./types.js";

export class ProductionPlaybookBuilder {
  private playbooks = new Map<string, ProductionPlaybook>();

  store(playbook: ProductionPlaybook): void {
    if (!playbook?.id) throw new Error("ProductionPlaybook with id is required");
    this.playbooks.set(playbook.id, playbook);
  }

  get(id: string): ProductionPlaybook | undefined {
    return this.playbooks.get(id);
  }

  findByChannel(channelId: string): ProductionPlaybook[] {
    return Array.from(this.playbooks.values()).filter((p) => p.channelId === channelId);
  }

  findByCategory(category: string): ProductionPlaybook[] {
    if (!category) return [];
    const lower = category.toLowerCase();
    return Array.from(this.playbooks.values()).filter((p) => p.category.toLowerCase().includes(lower));
  }

  getTopPlaybooks(limit = 5): ProductionPlaybook[] {
    return Array.from(this.playbooks.values())
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, limit);
  }

  build(channelId: string, category: string, successPatterns: Partial<ProductionPlaybook>): ProductionPlaybook {
    const playbook: ProductionPlaybook = {
      id: `${channelId}_${category}_${Date.now()}`,
      channelId,
      category,
      storyStructure: successPatterns.storyStructure ?? [],
      promptStyle: successPatterns.promptStyle ?? [],
      visualLanguage: successPatterns.visualLanguage ?? [],
      motionProfile: successPatterns.motionProfile ?? [],
      timelineRhythm: successPatterns.timelineRhythm ?? [],
      successRate: successPatterns.successRate ?? 0
    };
    this.playbooks.set(playbook.id, playbook);
    return playbook;
  }
}
