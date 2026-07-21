import { ResearchNoteItem } from "./research-ui-types";

/**
 * Research Notebook & Highlight Manager (Vol 05 Part 04 - Section 6, Section 14).
 * Manages rich text notes, AI summaries, and highlights linked back to originating evidence sources.
 */
export class ResearchNotebookManager {
  private notes: ResearchNoteItem[] = [];

  public createNote(title: string, contentText: string, sourceIdReference?: string): ResearchNoteItem {
    const note: ResearchNoteItem = {
      noteId: `note_${Math.random().toString(36).substring(2, 7)}`,
      title,
      contentText,
      sourceIdReference,
      highlights: [],
      createdAt: new Date(),
    };
    this.notes.push(note);
    return note;
  }

  public addHighlight(noteId: string, quoteText: string): void {
    const note = this.notes.find((n) => n.noteId === noteId);
    if (note) {
      const idx = this.notes.indexOf(note);
      this.notes[idx] = { ...note, highlights: [...note.highlights, quoteText] };
    }
  }

  public getNotes(): ReadonlyArray<ResearchNoteItem> {
    return this.notes;
  }
}
