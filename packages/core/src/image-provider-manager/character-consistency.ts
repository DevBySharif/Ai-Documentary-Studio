import { IPCharacterLock } from "./types";

export class IPCharacterConsistency {
  private characters: Map<string, IPCharacterLock> = new Map();

  registerCharacter(name: string, lock: IPCharacterLock): void {
    this.characters.set(name, { ...lock });
  }

  getCharacter(name: string): IPCharacterLock | undefined {
    return this.characters.get(name);
  }

  hasCharacter(name: string): boolean {
    return this.characters.has(name);
  }

  removeCharacter(name: string): boolean {
    return this.characters.delete(name);
  }

  applyToPrompt(characterName: string, prompt: string): string {
    const lock = this.characters.get(characterName);
    if (!lock) {
      return prompt;
    }
    const characterConstraints = [
      `face: ${lock.face}`,
      `hair: ${lock.hair}`,
      `clothing: ${lock.clothing}`,
      `body shape: ${lock.bodyShape}`,
      `age: ${lock.age}`,
      `accessories: ${lock.accessories.join(", ")}`,
    ];
    return `${prompt}, character "${characterName}" — ${characterConstraints.join(", ")}, expressions: ${lock.expressions.join(", ")}`;
  }

  getAllCharacters(): Map<string, IPCharacterLock> {
    return new Map(this.characters);
  }
}
