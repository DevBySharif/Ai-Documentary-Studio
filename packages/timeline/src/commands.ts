import { Timeline, Clip } from './models';
import pino from 'pino';

const logger = pino({ name: 'timeline-commands' });

export interface ICommand {
  /**
   * Applies the mutation to the timeline.
   */
  execute(timeline: Timeline): void;
  
  /**
   * Reverts the mutation from the timeline.
   */
  undo(timeline: Timeline): void;
}

export class AddClipCommand implements ICommand {
  constructor(private trackId: string, private clip: Clip) {}

  execute(timeline: Timeline): void {
    const track = timeline.tracks.find(t => t.id === this.trackId);
    if (!track) throw new Error(`Track ${this.trackId} not found`);
    track.clips.push(this.clip);
    // Ensure clips are sorted by startFrame for logical consistency
    track.clips.sort((a, b) => a.startFrame - b.startFrame);
    logger.debug({ clipId: this.clip.id, trackId: this.trackId }, 'Executed AddClipCommand');
  }

  undo(timeline: Timeline): void {
    const track = timeline.tracks.find(t => t.id === this.trackId);
    if (!track) return;
    track.clips = track.clips.filter(c => c.id !== this.clip.id);
    logger.debug({ clipId: this.clip.id, trackId: this.trackId }, 'Undid AddClipCommand');
  }
}

export class MoveClipCommand implements ICommand {
  private originalStartFrame: number;
  private originalEndFrame: number;

  constructor(private trackId: string, private clipId: string, private newStartFrame: number) {
    this.originalStartFrame = 0;
    this.originalEndFrame = 0;
  }

  execute(timeline: Timeline): void {
    const track = timeline.tracks.find(t => t.id === this.trackId);
    if (!track) throw new Error(`Track ${this.trackId} not found`);
    
    const clip = track.clips.find(c => c.id === this.clipId);
    if (!clip) throw new Error(`Clip ${this.clipId} not found`);

    this.originalStartFrame = clip.startFrame;
    this.originalEndFrame = clip.endFrame;

    const duration = clip.endFrame - clip.startFrame;
    clip.startFrame = this.newStartFrame;
    clip.endFrame = this.newStartFrame + duration;

    track.clips.sort((a, b) => a.startFrame - b.startFrame);
    logger.debug({ clipId: this.clipId, trackId: this.trackId, startFrame: this.newStartFrame }, 'Executed MoveClipCommand');
  }

  undo(timeline: Timeline): void {
    const track = timeline.tracks.find(t => t.id === this.trackId);
    if (!track) return;

    const clip = track.clips.find(c => c.id === this.clipId);
    if (!clip) return;

    clip.startFrame = this.originalStartFrame;
    clip.endFrame = this.originalEndFrame;

    track.clips.sort((a, b) => a.startFrame - b.startFrame);
    logger.debug({ clipId: this.clipId, trackId: this.trackId, startFrame: this.originalStartFrame }, 'Undid MoveClipCommand');
  }
}

export class DeleteClipCommand implements ICommand {
  private deletedClip: Clip | null = null;

  constructor(private trackId: string, private clipId: string) {}

  execute(timeline: Timeline): void {
    const track = timeline.tracks.find(t => t.id === this.trackId);
    if (!track) throw new Error(`Track ${this.trackId} not found`);

    const clipIndex = track.clips.findIndex(c => c.id === this.clipId);
    if (clipIndex === -1) throw new Error(`Clip ${this.clipId} not found`);

    this.deletedClip = track.clips[clipIndex];
    track.clips.splice(clipIndex, 1);
    logger.debug({ clipId: this.clipId, trackId: this.trackId }, 'Executed DeleteClipCommand');
  }

  undo(timeline: Timeline): void {
    if (!this.deletedClip) return;
    
    const track = timeline.tracks.find(t => t.id === this.trackId);
    if (!track) return;

    track.clips.push(this.deletedClip);
    track.clips.sort((a, b) => a.startFrame - b.startFrame);
    this.deletedClip = null;
    logger.debug({ clipId: this.clipId, trackId: this.trackId }, 'Undid DeleteClipCommand');
  }
}
