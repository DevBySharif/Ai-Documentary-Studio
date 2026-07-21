import * as crypto from 'crypto';
import { ASHistoryEntry } from './types';

export class ASConfigurationHistory {
  private history: ASHistoryEntry[] = [];
  private maxEntries: number;

  constructor(maxEntries: number = 1000) {
    this.maxEntries = maxEntries;
  }

  recordChange(
    key: string,
    previousValue: unknown,
    newValue: unknown,
    user: string,
    source: string
  ): string {
    const id = crypto.randomUUID();
    const entry: ASHistoryEntry = {
      id,
      key,
      previousValue,
      newValue,
      timestamp: Date.now(),
      user,
      source,
    };

    this.history.push(entry);

    if (this.history.length > this.maxEntries) {
      this.history = this.history.slice(this.history.length - this.maxEntries);
    }

    return id;
  }

  getHistory(key: string): ASHistoryEntry[] {
    return this.history
      .filter((entry) => entry.key === key)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  getFullHistory(): ASHistoryEntry[] {
    return this.history
      .slice()
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  rollback(key: string, entryId: string): boolean {
    const index = this.history.findIndex(
      (entry) => entry.id === entryId && entry.key === key
    );
    if (index === -1) return false;

    const targetEntry = this.history[index];

    const rollbackEntry: ASHistoryEntry = {
      id: crypto.randomUUID(),
      key,
      previousValue: targetEntry.newValue,
      newValue: targetEntry.previousValue,
      timestamp: Date.now(),
      user: 'system',
      source: 'rollback',
    };

    this.history.push(rollbackEntry);

    if (this.history.length > this.maxEntries) {
      this.history = this.history.slice(this.history.length - this.maxEntries);
    }

    return true;
  }

  getChangesBySource(source: string): ASHistoryEntry[] {
    return this.history
      .filter((entry) => entry.source === source)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  getChangesByUser(user: string): ASHistoryEntry[] {
    return this.history
      .filter((entry) => entry.user === user)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  getChangesInTimeRange(start: number, end: number): ASHistoryEntry[] {
    return this.history
      .filter((entry) => entry.timestamp >= start && entry.timestamp <= end)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  clearHistory(): void {
    this.history = [];
  }

  getHistorySize(): number {
    return this.history.length;
  }

  setMaxEntries(max: number): void {
    this.maxEntries = max;
    if (this.history.length > max) {
      this.history = this.history.slice(this.history.length - max);
    }
  }
}
