import type { SyncPoint, WordTimestamp, Pause, Silence } from "./types.js";

export class AudioSyncEngine {
  generateSyncPoints(
    words: WordTimestamp[],
    pauses: Pause[],
    silences: Silence[]
  ): SyncPoint[] {
    const points: SyncPoint[] = [];

    for (let i = 0; i < words.length; i++) {
      if (i > 0 && words[i].start - words[i - 1].end > 0.3) {
        points.push({
          timestamp: words[i].start,
          type: "motion_start",
          data: { word: words[i].word },
        });
      }
    }

    for (const pause of pauses) {
      points.push({
        timestamp: pause.start,
        type: "pause",
        data: { duration: pause.duration, type: pause.type },
      });
    }

    for (const silence of silences) {
      points.push({
        timestamp: silence.start,
        type: "silence",
        data: { duration: silence.duration, type: silence.type },
      });
    }

    const emphasisWords = words.filter((w) => w.isEmphasized);
    for (const ew of emphasisWords) {
      points.push({
        timestamp: ew.start,
        type: "word_insert",
        data: { word: ew.word },
      });
    }

    points.sort((a, b) => a.timestamp - b.timestamp);
    return points;
  }

  findNearestSyncPoint(time: number, points: SyncPoint[]): SyncPoint | null {
    let nearest: SyncPoint | null = null;
    let minDiff = Infinity;

    for (const point of points) {
      const diff = Math.abs(point.timestamp - time);
      if (diff < minDiff && diff < 0.5) {
        minDiff = diff;
        nearest = point;
      }
    }

    return nearest;
  }
}
