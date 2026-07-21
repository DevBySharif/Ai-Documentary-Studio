export interface EntityReferenceLink {
  readonly sourceUuid: string;
  readonly sourceType: string;
  readonly targetUuid: string;
  readonly targetType: string;
  readonly relationshipName: string;
}

/**
 * Reference-Based Entity Relationship Linker (Vol 06 Part 03 - Section 17).
 * Connects entities via UUID references (`Script -> Scene -> Shot -> Prompt -> Asset -> TimelineClip`) avoiding redundant data duplication.
 */
export class EntityRelationshipGraph {
  private links: EntityReferenceLink[] = [];

  public linkEntities(
    sourceUuid: string,
    sourceType: string,
    targetUuid: string,
    targetType: string,
    relationshipName: string
  ): EntityReferenceLink {
    const link: EntityReferenceLink = {
      sourceUuid,
      sourceType,
      targetUuid,
      targetType,
      relationshipName,
    };
    this.links.push(link);
    return link;
  }

  public getTargetReferences(sourceUuid: string): ReadonlyArray<EntityReferenceLink> {
    return this.links.filter((l) => l.sourceUuid === sourceUuid);
  }
}
