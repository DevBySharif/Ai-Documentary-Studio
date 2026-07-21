export interface CameraInstruction {
  type: "push_in" | "push_out" | "pan" | "tilt" | "dolly" | "parallax" | "multi_stage";
  startFrame: number;
  endFrame: number;
  params: Record<string, number>;
}

export class CameraBuilder {
  build(scenes: Array<{ sceneIndex: number; timing: { startFrame: number; endFrame: number } }>): CameraInstruction[] {
    return scenes.map((scene) => ({
      type: "push_in" as const,
      startFrame: scene.timing.startFrame,
      endFrame: scene.timing.endFrame,
      params: { zoomStart: 1.0, zoomEnd: 1.05, x: 0, y: 0 }
    }));
  }

  buildMultiStage(paths: Array<{ segments: Array<{ type: string; params: Record<string, number> }> }>): CameraInstruction[] {
    return paths.flatMap((path, i) =>
      path.segments.map((seg, j) => ({
        type: "multi_stage" as const,
        startFrame: i * 100 + j * 25,
        endFrame: i * 100 + (j + 1) * 25,
        params: { ...seg.params, segmentIndex: j }
      }))
    );
  }
}
