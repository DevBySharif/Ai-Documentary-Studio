import type { FSEffectState } from "./types.js";

export class FSEffectSynchronizer {
  private effects: Map<string, number> = new Map();
  private transitions: string[] = [];

  scheduleFade(frame: number, duration: number): void {
    this.effects.set("fade", frame);
  }

  scheduleGlow(frame: number, duration: number): void {
    this.effects.set("glow", frame);
  }

  scheduleBlur(frame: number, _duration: number): void {
    this.effects.set("blur", frame);
  }

  scheduleLightRays(frame: number, _duration: number): void {
    this.effects.set("light_rays", frame);
  }

  scheduleParticles(frame: number, _duration: number): void {
    this.effects.set("particles", frame);
  }

  scheduleVignette(frame: number, _duration: number): void {
    this.effects.set("vignette", frame);
  }

  getActiveEffectsAtFrame(frame: number): Map<string, number> {
    const active = new Map<string, number>();
    for (const [effect, startFrame] of this.effects) {
      if (startFrame <= frame) active.set(effect, frame - startFrame);
    }
    return active;
  }

  getState(): FSEffectState {
    return { active: new Map(this.effects), transitions: [...this.transitions] };
  }

  clear(): void {
    this.effects.clear();
    this.transitions = [];
  }
}
