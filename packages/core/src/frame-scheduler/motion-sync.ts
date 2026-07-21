import type { FSCameraState } from "./types.js";

export class FSMotionSynchronizer {
  convertToFrameEvents(cameraPath: Array<{ frame: number; position: { x: number; y: number; z: number }; rotation: { x: number; y: number; z: number }; zoom: number }>): FSCameraState[] {
    return cameraPath.map((p) => ({
      position: { ...p.position },
      rotation: { ...p.rotation },
      zoom: p.zoom,
      parallax: 0
    }));
  }

  getCameraAtFrame(frame: number, keyframes: Array<{ frame: number; camera: FSCameraState }>): FSCameraState {
    const sorted = [...keyframes].sort((a, b) => a.frame - b.frame);
    let before = sorted[0];
    let after = sorted[sorted.length - 1];

    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].frame <= frame && sorted[i + 1].frame >= frame) {
        before = sorted[i];
        after = sorted[i + 1];
        break;
      }
    }

    if (before.frame === after.frame) return { ...before.camera };
    const t = (frame - before.frame) / (after.frame - before.frame);
    return this.interpolate(before.camera, after.camera, t);
  }

  private interpolate(a: FSCameraState, b: FSCameraState, t: number): FSCameraState {
    return {
      position: {
        x: a.position.x + (b.position.x - a.position.x) * t,
        y: a.position.y + (b.position.y - a.position.y) * t,
        z: a.position.z + (b.position.z - a.position.z) * t
      },
      rotation: {
        x: a.rotation.x + (b.rotation.x - a.rotation.x) * t,
        y: a.rotation.y + (b.rotation.y - a.rotation.y) * t,
        z: a.rotation.z + (b.rotation.z - a.rotation.z) * t
      },
      zoom: a.zoom + (b.zoom - a.zoom) * t,
      parallax: a.parallax + (b.parallax - a.parallax) * t
    };
  }
}
