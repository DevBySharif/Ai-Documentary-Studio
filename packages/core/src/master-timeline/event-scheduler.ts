import { EventEmitter } from "events";
import type { MasterEvent, EventSchedulerState } from "./types.js";

export class EventScheduler extends EventEmitter {
  private state: EventSchedulerState = {
    events: [],
    currentIndex: 0,
    currentTime: 0,
    completed: [],
  };

  get events(): MasterEvent[] {
    return this.state.events;
  }

  reset(): void {
    this.state = { events: [], currentIndex: 0, currentTime: 0, completed: [] };
  }

  schedule(events: MasterEvent[]): void {
    this.state.events = events.sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start;
      return this.priorityRank(b.priority) - this.priorityRank(a.priority);
    });
    this.state.currentIndex = 0;
    this.state.currentTime = 0;
    this.state.completed = [];
  }

  tick(delta: number): MasterEvent[] {
    this.state.currentTime += delta;
    const ready: MasterEvent[] = [];

    while (this.state.currentIndex < this.state.events.length) {
      const event = this.state.events[this.state.currentIndex];
      if (event.start <= this.state.currentTime && this.dependenciesMet(event)) {
        ready.push(event);
        this.state.completed.push(event.id);
        this.state.currentIndex++;
      } else {
        break;
      }
    }

    if (ready.length > 0) {
      this.emit("events-ready", ready);
    }

    if (this.state.currentIndex >= this.state.events.length) {
      this.emit("schedule-complete");
    }

    return ready;
  }

  private priorityRank(priority: string): number {
    const ranks: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
    return ranks[priority] ?? 0;
  }

  private dependenciesMet(event: MasterEvent): boolean {
    return event.dependencies.every((depId) => this.state.completed.includes(depId));
  }
}
