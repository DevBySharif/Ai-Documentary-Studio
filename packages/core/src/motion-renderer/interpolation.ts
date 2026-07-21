export class MRFrameInterpolation {
  interpolate(frames: Array<{ x: number; y: number; zoom: number }>, targetFps: number, sourceFps = 30): Array<{ x: number; y: number; zoom: number }> {
    if (targetFps <= sourceFps || frames.length < 2) return frames;

    const ratio = targetFps / sourceFps;
    const result: Array<{ x: number; y: number; zoom: number }> = [];

    for (let i = 0; i < frames.length - 1; i++) {
      const current = frames[i];
      const next = frames[i + 1];
      for (let j = 0; j < ratio; j++) {
        const t = j / ratio;
        result.push({
          x: current.x + (next.x - current.x) * t,
          y: current.y + (next.y - current.y) * t,
          zoom: current.zoom + (next.zoom - current.zoom) * t
        });
      }
    }
    result.push(frames[frames.length - 1]);
    return result;
  }

  detectArtifacts(interpolated: Array<{ x: number; y: number; zoom: number }>): number[] {
    const artifacts: number[] = [];
    for (let i = 1; i < interpolated.length; i++) {
      const dx = Math.abs(interpolated[i].x - interpolated[i - 1].x);
      const dy = Math.abs(interpolated[i].y - interpolated[i - 1].y);
      if (dx > 10 || dy > 10) artifacts.push(i);
    }
    return artifacts;
  }
}
