import { CharacterProfile, VisualStyle, PromptComponents } from "./prompt-types";

/**
 * Style & Character Consistency Manager (Vol 04 Part 06 - Section 8, Section 9, Section 10).
 * Ensures project-wide visual style and recurring character features remain consistent across scenes.
 */
export class ConsistencyManager {
  private activeStyle: VisualStyle = "CinematicRealism";
  private characters = new Map<string, CharacterProfile>();

  public setProjectStyle(style: VisualStyle): void {
    this.activeStyle = style;
  }

  public registerCharacter(profile: CharacterProfile): void {
    this.characters.set(profile.characterId, profile);
  }

  public applyConsistency(components: PromptComponents, characterId?: string): PromptComponents {
    let subject = components.subject;
    const historicalConstraints = [...components.historicalConstraints];

    if (characterId && this.characters.has(characterId)) {
      const char = this.characters.get(characterId)!;
      subject = `${char.name} (${char.age}, ${char.ethnicity}, ${char.facialFeatures}, wearing ${char.clothing})`;
    }

    return {
      ...components,
      subject,
      visualStyle: this.activeStyle,
      historicalConstraints,
    };
  }
}
