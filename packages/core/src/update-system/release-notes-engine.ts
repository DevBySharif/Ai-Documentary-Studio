import { ReleaseNote } from './types';

export class ReleaseNotesEngine {
  private notesStore: Map<string, ReleaseNote> = new Map();

  async fetchReleaseNotes(version: string): Promise<ReleaseNote | undefined> {
    // Stub: fetch from remote server if not locally stored
    return this.notesStore.get(version);
  }

  storeReleaseNotes(note: ReleaseNote): void {
    this.notesStore.set(note.version, note);
  }

  searchNotes(query: string): ReleaseNote[] {
    const results: ReleaseNote[] = [];
    const q = query.toLowerCase();

    for (const note of this.notesStore.values()) {
      const allText = [
        note.features.join(' '),
        note.bugFixes.join(' '),
        note.breakingChanges.join(' ')
      ].join(' ').toLowerCase();

      if (allText.includes(q)) {
        results.push(note);
      }
    }
    return results;
  }
}
