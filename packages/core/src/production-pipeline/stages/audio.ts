export interface AudioSyncEvent {
  type: "narration" | "background_music" | "ambient" | "transition" | "silence";
  startFrame: number;
  endFrame: number;
  source: string;
  volume: number;
}

export class AudioBuilder {
  sync(voiceTrack: string, totalFrames: number): AudioSyncEvent[] {
    const events: AudioSyncEvent[] = [];

    events.push({ type: "narration", startFrame: 0, endFrame: totalFrames, source: voiceTrack, volume: 1.0 });
    events.push({ type: "background_music", startFrame: 0, endFrame: totalFrames, source: "bgm_default", volume: 0.3 });
    events.push({ type: "ambient", startFrame: 0, endFrame: totalFrames, source: "ambient_default", volume: 0.15 });

    return events;
  }

  addTransitionSounds(events: AudioSyncEvent[], transitionFrames: number[]): AudioSyncEvent[] {
    for (const frame of transitionFrames) {
      events.push({ type: "transition", startFrame: frame, endFrame: frame + 5, source: "transition_default", volume: 0.5 });
    }
    return events;
  }

  addSilence(events: AudioSyncEvent[], pauseFrames: number[]): AudioSyncEvent[] {
    for (const frame of pauseFrames) {
      events.push({ type: "silence", startFrame: frame, endFrame: frame + 10, source: "", volume: 0 });
    }
    return events;
  }
}
