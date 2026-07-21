import { Timeline } from './models';
import { TimelineHistoryManager } from './history';
import { PlayheadEngine } from './playhead';
import { ICommand } from './commands';
import { TimelineInterchangeFormat } from './serialization';
import { randomUUID } from 'crypto';

export class TimelineEngine {
  private timeline: Timeline;
  private history: TimelineHistoryManager;
  private playhead: PlayheadEngine;

  constructor(projectId: string, frameRate: number = 60) {
    this.timeline = {
      id: randomUUID(),
      projectId,
      frameRate,
      durationFrames: 0,
      version: 1,
      tracks: [],
      markers: []
    };
    
    this.history = new TimelineHistoryManager(this.timeline);
    this.playhead = new PlayheadEngine(frameRate);
  }

  /**
   * Loads a timeline from a serialized TIF string, replacing the current state.
   */
  loadFromTIF(tifJson: string): void {
    this.timeline = TimelineInterchangeFormat.deserialize(tifJson);
    this.history = new TimelineHistoryManager(this.timeline);
    this.playhead = new PlayheadEngine(this.timeline.frameRate);
  }

  /**
   * Serializes the current timeline state to TIF.
   */
  saveToTIF(): string {
    return TimelineInterchangeFormat.serialize(this.timeline);
  }

  /**
   * Executes a non-destructive edit on the timeline.
   */
  executeCommand(command: ICommand): void {
    this.history.execute(command);
  }

  undo(): boolean {
    return this.history.undo();
  }

  redo(): boolean {
    return this.history.redo();
  }

  getPlayhead(): PlayheadEngine {
    return this.playhead;
  }

  getTimeline(): Readonly<Timeline> {
    return this.timeline;
  }
}
