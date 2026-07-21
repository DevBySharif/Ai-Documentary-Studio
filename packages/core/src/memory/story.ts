import type { StoryMemoryEntry } from "./types.js";

export class StoryMemoryStore {
  private store = new Map<string, StoryMemoryEntry>();

  init(projectId: string): StoryMemoryEntry {
    const entry: StoryMemoryEntry = {
      openQuestions: [],
      solvedQuestions: [],
      currentStoryStage: "hook",
      upcomingReveals: [],
      viewerKnowledgeLevel: "none",
    };
    this.store.set(projectId, entry);
    return entry;
  }

  get(projectId: string): StoryMemoryEntry | undefined {
    return this.store.get(projectId);
  }

  addQuestion(projectId: string, question: string): void {
    const entry = this.getOrInit(projectId);
    if (!entry.openQuestions.includes(question)) {
      entry.openQuestions.push(question);
    }
  }

  solveQuestion(projectId: string, question: string): void {
    const entry = this.getOrInit(projectId);
    entry.openQuestions = entry.openQuestions.filter((q) => q !== question);
    if (!entry.solvedQuestions.includes(question)) {
      entry.solvedQuestions.push(question);
    }
  }

  isSolved(projectId: string, question: string): boolean {
    const entry = this.get(projectId);
    return entry?.solvedQuestions.includes(question) ?? false;
  }

  updateStage(projectId: string, stage: string): void {
    const entry = this.getOrInit(projectId);
    entry.currentStoryStage = stage;
  }

  addReveal(projectId: string, reveal: string): void {
    const entry = this.getOrInit(projectId);
    if (!entry.upcomingReveals.includes(reveal)) {
      entry.upcomingReveals.push(reveal);
    }
  }

  consumeNextReveal(projectId: string): string | null {
    const entry = this.get(projectId);
    return entry?.upcomingReveals.shift() || null;
  }

  private getOrInit(projectId: string): StoryMemoryEntry {
    return this.store.get(projectId) || this.init(projectId);
  }
}
