import type { FSKeyframe, FSKeyframeType } from "./types.js";

export class FSKeyframeManager {
  private keyframes: Map<FSKeyframeType, FSKeyframe[]> = new Map();

  constructor() {
    const types: FSKeyframeType[] = ["camera", "subtitle", "effect", "opacity", "scale", "rotation"];
    for (const t of types) this.keyframes.set(t, []);
  }

  addKeyframe(type: FSKeyframeType, frame: number, value: number, easing: string = "linear"): void {
    const list = this.keyframes.get(type);
    if (list) {
      list.push({ type, frame, value, easing });
      list.sort((a, b) => a.frame - b.frame);
    }
  }

  getKeyframes(type: FSKeyframeType): FSKeyframe[] {
    return [...(this.keyframes.get(type) ?? [])];
  }

  getValueAtFrame(type: FSKeyframeType, frame: number): number {
    const list = this.keyframes.get(type);
    if (!list || list.length === 0) return 0;

    if (frame <= list[0].frame) return list[0].value;
    if (frame >= list[list.length - 1].frame) return list[list.length - 1].value;

    for (let i = 0; i < list.length - 1; i++) {
      if (list[i].frame <= frame && list[i + 1].frame >= frame) {
        const t = (frame - list[i].frame) / (list[i + 1].frame - list[i].frame);
        return list[i].value + (list[i + 1].value - list[i].value) * t;
      }
    }

    return 0;
  }

  getAllKeyframes(): FSKeyframe[] {
    const all: FSKeyframe[] = [];
    for (const [, list] of this.keyframes) all.push(...list);
    return all.sort((a, b) => a.frame - b.frame);
  }

  clear(): void {
    for (const [, list] of this.keyframes) list.length = 0;
  }

  keyframeCount(): number {
    let count = 0;
    for (const [, list] of this.keyframes) count += list.length;
    return count;
  }
}
