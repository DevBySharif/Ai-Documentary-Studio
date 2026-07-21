import type { ChannelDNA } from "./types.js";

export class DNAInheritance {
  private registry = new Map<string, ChannelDNA>();

  register(dna: ChannelDNA): void {
    this.registry.set(dna.metadata.id, dna);
  }

  unregister(id: string): void {
    this.registry.delete(id);
  }

  get(id: string): ChannelDNA | undefined {
    return this.registry.get(id);
  }

  resolve(dna: ChannelDNA): ChannelDNA {
    if (!dna.metadata.parentId) return dna;

    const parent = this.registry.get(dna.metadata.parentId);
    if (!parent) return dna;

    const resolved = this.deepMerge(this.resolve(parent), dna);
    return resolved;
  }

  createChild(parent: ChannelDNA, overrides: Partial<ChannelDNA>): ChannelDNA {
    const child: ChannelDNA = {
      ...this.deepClone(parent),
      metadata: {
        ...this.deepClone(parent.metadata),
        id: crypto.randomUUID(),
        name: `${parent.metadata.name} (Child)`,
        version: "1.0.0",
        parentId: parent.metadata.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        changeLog: ["Created as child of " + parent.metadata.name],
        tags: [...parent.metadata.tags],
      },
    };

    return this.deepMerge(child, overrides as ChannelDNA);
  }

  getAncestors(dna: ChannelDNA): ChannelDNA[] {
    const ancestors: ChannelDNA[] = [];
    let current = dna;

    while (current.metadata.parentId) {
      const parent = this.registry.get(current.metadata.parentId);
      if (!parent) break;
      ancestors.unshift(parent);
      current = parent;
    }

    return ancestors;
  }

  getInheritanceChain(dna: ChannelDNA): string[] {
    return [
      ...this.getAncestors(dna).map((a) => a.metadata.name),
      dna.metadata.name,
    ];
  }

  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  private deepMerge(target: ChannelDNA, source: ChannelDNA): ChannelDNA {
    const result = this.deepClone(target);

    for (const key of Object.keys(source) as Array<keyof ChannelDNA>) {
      const sourceVal = source[key];
      if (sourceVal === undefined) continue;

      const targetVal = result[key];

      if (
        sourceVal !== null &&
        targetVal !== null &&
        typeof sourceVal === "object" &&
        !Array.isArray(sourceVal) &&
        typeof targetVal === "object" &&
        !Array.isArray(targetVal)
      ) {
        (result as unknown as Record<string, unknown>)[key] = this.deepMerge(
          targetVal as unknown as ChannelDNA,
          sourceVal as unknown as ChannelDNA
        );
      } else {
        (result as unknown as Record<string, unknown>)[key] = sourceVal;
      }
    }

    return result;
  }
}
