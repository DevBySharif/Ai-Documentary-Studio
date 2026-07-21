import { ChannelDNA } from './schema';

export class DNAInheritanceResolver {
  /**
   * Deep merges a child DNA profile onto a parent DNA profile.
   * Child scalars overwrite parent scalars.
   * Arrays (like capabilities, graphicElements) are concatenated and deduplicated.
   */
  static resolve(child: ChannelDNA, parent?: ChannelDNA): ChannelDNA {
    if (!parent) return child;

    return {
      id: child.id,
      parentId: parent.id,
      version: child.version,
      schemaVersion: child.schemaVersion,
      
      metadata: {
        createdAt: child.metadata.createdAt,
        updatedAt: child.metadata.updatedAt,
        changelog: child.metadata.changelog,
        capabilities: Array.from(new Set([...parent.metadata.capabilities, ...child.metadata.capabilities])),
      },

      identity: this.mergeObject(parent.identity, child.identity),
      narrative: this.mergeObject(parent.narrative, child.narrative),
      visuals: this.mergeObject(parent.visuals, child.visuals),
      motion: this.mergeObject(parent.motion, child.motion),
      voice: this.mergeObject(parent.voice, child.voice),
      ai: this.mergeObject(parent.ai, child.ai),
      quality: this.mergeObject(parent.quality, child.quality),
      export: this.mergeObject(parent.export, child.export),
    } as ChannelDNA;
  }

  private static mergeObject<T extends Record<string, any>>(parentObj: T, childObj: T): T {
    const result = { ...parentObj } as any;
    for (const key in childObj) {
      const childValue = childObj[key];
      
      if (Array.isArray(childValue)) {
        const parentArray = Array.isArray(parentObj[key]) ? parentObj[key] : [];
        result[key] = Array.from(new Set([...parentArray, ...childValue]));
      } else if (childValue !== undefined && childValue !== null && childValue !== '') {
        result[key] = childValue;
      }
    }
    return result;
  }
}
