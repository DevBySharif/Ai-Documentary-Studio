import { Timeline, createTimeline, computeTimelineDuration } from "./timeline";
import { Track, TrackType, createTrack } from "./track";
import { Clip, IDENTITY_TRANSFORM } from "./clip";
import { Marker, createMarker } from "./marker";
import { Playhead, movePlayhead, setPlaybackState } from "./playhead";
import { Timebase } from "./time";
import { SnappingEngine } from "./snapping-engine";
import { TimelineCommand } from "./timeline-commands";
import { TimelineEvent } from "./timeline-events";

type EventListener = (event: TimelineEvent) => void;

interface HistoryEntry {
  readonly timeline: Timeline;
  readonly command: TimelineCommand;
}

/**
 * The NLE Timeline Engine.
 * All edit operations are non-destructive, frame-accurate, and emit typed events.
 * Full Undo/Redo via internal history stack.
 */
export class TimelineEngine {
  private timeline: Timeline;
  private readonly past: HistoryEntry[] = [];
  private readonly future: HistoryEntry[] = [];
  private readonly listeners = new Set<EventListener>();
  private readonly snapping: SnappingEngine;

  constructor(timelineId: string, name: string, timebase?: Timebase) {
    this.timeline = createTimeline(timelineId, name, timebase);
    this.snapping = new SnappingEngine();
  }

  // ─── Queries ─────────────────────────────────────────────────────────────────

  public getTimeline(): Readonly<Timeline> {
    return this.timeline;
  }

  public canUndo(): boolean { return this.past.length > 0; }
  public canRedo(): boolean { return this.future.length > 0; }

  // ─── Undo / Redo ─────────────────────────────────────────────────────────────

  public undo(): void {
    const entry = this.past.pop();
    if (!entry) return;
    this.future.unshift({ timeline: this.timeline, command: entry.command });
    this.timeline = entry.timeline;
  }

  public redo(): void {
    const entry = this.future.shift();
    if (!entry) return;
    this.past.push({ timeline: this.timeline, command: entry.command });
    this.timeline = entry.timeline;
    this.dispatch(entry.command);
  }

  // ─── Command Dispatcher ───────────────────────────────────────────────────────

  public execute(command: TimelineCommand): void {
    const before = this.timeline;
    const next = this.applyCommand(this.timeline, command);

    // Bump version and recompute duration
    this.timeline = {
      ...next,
      durationFrames: computeTimelineDuration(next),
      version: next.version + 1,
    };

    this.past.push({ timeline: before, command });
    this.future.length = 0; // Invalidate redo stack on new action
    this.dispatch(command);
  }

  // ─── Event System ─────────────────────────────────────────────────────────────

  public subscribe(listener: EventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // ─── Private: Apply Command → New Timeline ────────────────────────────────────

  private applyCommand(tl: Timeline, cmd: TimelineCommand): Timeline {
    switch (cmd.type) {
      case "AddTrack":     return this.addTrack(tl, cmd);
      case "RemoveTrack":  return this.removeTrack(tl, cmd);
      case "AddClip":      return this.addClip(tl, cmd);
      case "RemoveClip":   return this.removeClip(tl, cmd);
      case "MoveClip":     return this.moveClip(tl, cmd);
      case "TrimClip":     return this.trimClip(tl, cmd);
      case "RippleTrim":   return this.rippleTrim(tl, cmd);
      case "RollEdit":     return this.rollEdit(tl, cmd);
      case "SlipClip":     return this.slipClip(tl, cmd);
      case "SlideClip":    return this.slideClip(tl, cmd);
      case "AddMarker":    return this.addMarker(tl, cmd);
      case "RemoveMarker": return this.removeMarker(tl, cmd);
      case "Seek":         return { ...tl, playhead: movePlayhead(tl.playhead, cmd.frame) };
      case "Play":         return { ...tl, playhead: { ...tl.playhead, state: "Playing", speed: cmd.speed ?? 1 } };
      case "Pause":        return { ...tl, playhead: setPlaybackState(tl.playhead, "Paused") };
      default:             return tl;
    }
  }

  // ─── Track Operations ─────────────────────────────────────────────────────────

  private addTrack(tl: Timeline, cmd: { trackType: TrackType; name: string }): Timeline {
    const id = crypto.randomUUID();
    const track = createTrack(id, cmd.trackType, cmd.name, tl.tracks.length);
    return { ...tl, tracks: [...tl.tracks, track] };
  }

  private removeTrack(tl: Timeline, cmd: { trackId: string }): Timeline {
    const tracks = tl.tracks.filter(t => t.id !== cmd.trackId);
    // Remove all clips belonging to this track
    const clips = new Map(tl.clips);
    for (const [id, clip] of Array.from(clips)) {
      if (clip.trackId === cmd.trackId) clips.delete(id);
    }
    return { ...tl, tracks, clips };
  }

  // ─── Clip Operations ──────────────────────────────────────────────────────────

  private addClip(tl: Timeline, cmd: {
    assetId: string; trackId: string;
    timelineInFrame: number; sourceInFrame: number; sourceOutFrame: number;
  }): Timeline {
    const id = crypto.randomUUID();
    const duration = cmd.sourceOutFrame - cmd.sourceInFrame;
    const clip: Clip = {
      id, assetId: cmd.assetId, trackId: cmd.trackId,
      sourceInFrame: cmd.sourceInFrame, sourceOutFrame: cmd.sourceOutFrame,
      timelineInFrame: cmd.timelineInFrame,
      timelineOutFrame: cmd.timelineInFrame + duration,
      playbackSpeed: 1, transform: IDENTITY_TRANSFORM,
      keyframeTracks: [], effectIds: [], isNested: false,
    };
    const clips = new Map(tl.clips).set(id, clip);
    const tracks = tl.tracks.map(t =>
      t.id === cmd.trackId
        ? { ...t, clipIds: [...t.clipIds, id] }
        : t
    );
    return { ...tl, clips, tracks };
  }

  private removeClip(tl: Timeline, cmd: { clipId: string }): Timeline {
    const clips = new Map(tl.clips);
    clips.delete(cmd.clipId);
    const tracks = tl.tracks.map(t => ({
      ...t, clipIds: t.clipIds.filter(id => id !== cmd.clipId)
    }));
    return { ...tl, clips, tracks };
  }

  private moveClip(tl: Timeline, cmd: { clipId: string; toTrackId: string; toTimelineInFrame: number }): Timeline {
    const clip = tl.clips.get(cmd.clipId);
    if (!clip) return tl;
    const snappedFrame = tl.snappingEnabled
      ? this.snapFrame(tl, cmd.toTimelineInFrame, cmd.clipId)
      : cmd.toTimelineInFrame;
    const duration = clip.timelineOutFrame - clip.timelineInFrame;
    const updated: Clip = {
      ...clip, trackId: cmd.toTrackId,
      timelineInFrame: snappedFrame, timelineOutFrame: snappedFrame + duration,
    };
    const clips = new Map(tl.clips).set(cmd.clipId, updated);
    return { ...tl, clips };
  }

  private trimClip(tl: Timeline, cmd: {
    clipId: string;
    newTimelineInFrame?: number; newTimelineOutFrame?: number;
    newSourceInFrame?: number; newSourceOutFrame?: number;
  }): Timeline {
    const clip = tl.clips.get(cmd.clipId);
    if (!clip) return tl;
    const updated: Clip = {
      ...clip,
      timelineInFrame: cmd.newTimelineInFrame ?? clip.timelineInFrame,
      timelineOutFrame: cmd.newTimelineOutFrame ?? clip.timelineOutFrame,
      sourceInFrame: cmd.newSourceInFrame ?? clip.sourceInFrame,
      sourceOutFrame: cmd.newSourceOutFrame ?? clip.sourceOutFrame,
    };
    return { ...tl, clips: new Map(tl.clips).set(cmd.clipId, updated) };
  }

  /**
   * Ripple Trim: trims one edge and shifts all downstream clips.
   */
  private rippleTrim(tl: Timeline, cmd: { clipId: string; edge: "in" | "out"; deltaFrames: number }): Timeline {
    const clip = tl.clips.get(cmd.clipId);
    if (!clip) return tl;

    let updated: Clip;
    let rippleOrigin: number;

    if (cmd.edge === "out") {
      const newOut = Math.max(clip.timelineInFrame + 1, clip.timelineOutFrame + cmd.deltaFrames);
      rippleOrigin = clip.timelineOutFrame;
      updated = { ...clip, timelineOutFrame: newOut, sourceOutFrame: clip.sourceOutFrame + cmd.deltaFrames };
    } else {
      const newIn = Math.min(clip.timelineOutFrame - 1, clip.timelineInFrame + cmd.deltaFrames);
      rippleOrigin = clip.timelineInFrame;
      updated = { ...clip, timelineInFrame: newIn, sourceInFrame: clip.sourceInFrame + cmd.deltaFrames };
    }

    // Shift all clips on the same track that start at or after the ripple point
    const clips = new Map(tl.clips).set(cmd.clipId, updated);
    for (const [id, c] of Array.from(clips)) {
      if (id === cmd.clipId || c.trackId !== clip.trackId) continue;
      if (c.timelineInFrame >= rippleOrigin) {
        clips.set(id, {
          ...c,
          timelineInFrame: c.timelineInFrame + cmd.deltaFrames,
          timelineOutFrame: c.timelineOutFrame + cmd.deltaFrames,
        });
      }
    }
    return { ...tl, clips };
  }

  /**
   * Roll Edit: simultaneously trims the out-point of clipA and in-point of clipB.
   */
  private rollEdit(tl: Timeline, cmd: { clipAId: string; clipBId: string; deltaFrames: number }): Timeline {
    const A = tl.clips.get(cmd.clipAId);
    const B = tl.clips.get(cmd.clipBId);
    if (!A || !B) return tl;
    const clips = new Map(tl.clips);
    clips.set(A.id, { ...A, timelineOutFrame: A.timelineOutFrame + cmd.deltaFrames, sourceOutFrame: A.sourceOutFrame + cmd.deltaFrames });
    clips.set(B.id, { ...B, timelineInFrame: B.timelineInFrame + cmd.deltaFrames, sourceInFrame: B.sourceInFrame + cmd.deltaFrames });
    return { ...tl, clips };
  }

  /**
   * Slip: shifts source in/out without moving timeline position.
   */
  private slipClip(tl: Timeline, cmd: { clipId: string; deltaFrames: number }): Timeline {
    const clip = tl.clips.get(cmd.clipId);
    if (!clip) return tl;
    const updated: Clip = {
      ...clip,
      sourceInFrame: clip.sourceInFrame + cmd.deltaFrames,
      sourceOutFrame: clip.sourceOutFrame + cmd.deltaFrames,
    };
    return { ...tl, clips: new Map(tl.clips).set(cmd.clipId, updated) };
  }

  /**
   * Slide: moves the clip on the timeline while trimming its neighbours.
   */
  private slideClip(tl: Timeline, cmd: { clipId: string; deltaFrames: number }): Timeline {
    const clip = tl.clips.get(cmd.clipId);
    if (!clip) return tl;
    const duration = clip.timelineOutFrame - clip.timelineInFrame;
    const newIn = clip.timelineInFrame + cmd.deltaFrames;
    const updated: Clip = { ...clip, timelineInFrame: newIn, timelineOutFrame: newIn + duration };
    return { ...tl, clips: new Map(tl.clips).set(cmd.clipId, updated) };
  }

  // ─── Marker Operations ────────────────────────────────────────────────────────

  private addMarker(tl: Timeline, cmd: { frame: number; markerType: any; label: string; color?: string; comment?: string }): Timeline {
    const marker = createMarker(crypto.randomUUID(), cmd.markerType, cmd.frame, cmd.label, cmd.color);
    return { ...tl, markers: [...tl.markers, { ...marker, comment: cmd.comment }] };
  }

  private removeMarker(tl: Timeline, cmd: { markerId: string }): Timeline {
    return { ...tl, markers: tl.markers.filter(m => m.id !== cmd.markerId) };
  }

  // ─── Snapping Helper ──────────────────────────────────────────────────────────

  private snapFrame(tl: Timeline, frame: number, excludeClipId: string): number {
    const allClips = Array.from(tl.clips.values());
    const targets = this.snapping.buildSnapTargets(allClips, tl.markers, tl.playhead.currentFrame, tl.durationFrames);
    return this.snapping.snap(frame, targets, excludeClipId);
  }

  // ─── Private: Emit Event ─────────────────────────────────────────────────────

  private dispatch(cmd: TimelineCommand): void {
    const base = {
      timelineId: this.timeline.id,
      occurredAt: new Date(),
      version: this.timeline.version,
    };

    let event: TimelineEvent | undefined;

    switch (cmd.type) {
      case "AddClip":
        event = { ...base, type: "ClipAdded", clipId: "", trackId: cmd.trackId, timelineInFrame: cmd.timelineInFrame };
        break;
      case "RemoveClip":
        event = { ...base, type: "ClipRemoved", clipId: cmd.clipId, trackId: "" };
        break;
      case "AddTrack":
        event = { ...base, type: "TrackCreated", trackId: "" };
        break;
      case "AddMarker":
        event = { ...base, type: "MarkerAdded", markerId: "", frame: cmd.frame };
        break;
      case "Play":
        event = { ...base, type: "PlaybackStarted", fromFrame: this.timeline.playhead.currentFrame };
        break;
      case "Pause":
        event = { ...base, type: "PlaybackStopped", atFrame: this.timeline.playhead.currentFrame };
        break;
    }

    if (event) this.listeners.forEach(l => l(event!));
  }
}

