export class WMProjectDuplication {
  duplicate(sourceId: string, newId: string, keepSettings: boolean): { sourceId: string; newId: string; settingsKept: boolean } {
    return { sourceId, newId, settingsKept: keepSettings };
  }

  generateNewId(): string {
    return `proj_${Date.now()}`;
  }
}
