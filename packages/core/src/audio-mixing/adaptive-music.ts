import type { AMAdaptiveMusicSegment, AMSceneEmotion } from "./types.js";

export class AMAdaptiveMusicEngine {
  private segments: AMAdaptiveMusicSegment[] = [];

  addSegment(segment: AMAdaptiveMusicSegment): void {
    this.segments.push({ ...segment });
    this.segments.sort((a, b) => a.startTime - b.startTime);
  }

  removeSegment(id: string): void {
    this.segments = this.segments.filter((s) => s.id !== id);
  }

  getSegments(): AMAdaptiveMusicSegment[] {
    return this.segments.map((s) => ({ ...s }));
  }

  clearSegments(): void {
    this.segments = [];
  }

  getSegmentAtTime(time: number): AMAdaptiveMusicSegment | undefined {
    return this.segments.find((s) => time >= s.startTime && time <= s.endTime);
  }

  getEnergyAtTime(time: number): number {
    const segment = this.getSegmentAtTime(time);
    return segment ? segment.energy : 0.5;
  }

  matchEnergyToNarration(narrationIntensity: number, musicEnergy: number): number {
    const diff = narrationIntensity - musicEnergy;
    if (Math.abs(diff) < 0.2) return musicEnergy;
    return musicEnergy + diff * 0.3;
  }

  getEmotionMap(): Record<AMSceneEmotion, number> {
    return {
      reflection: 0.2, discovery: 0.6, tension: 0.7, revelation: 0.9,
      hope: 0.5, fear: 0.3, wonder: 0.6, calm: 0.1, urgency: 0.8
    };
  }

  createIntroOutroFade(segment: AMAdaptiveMusicSegment, totalDuration: number): { introEnd: number; outroStart: number } {
    const introEnd = segment.startTime + segment.introFade;
    const outroStart = Math.max(introEnd, totalDuration - segment.outroFade);
    return { introEnd, outroStart };
  }

  isPlaying(): boolean {
    return this.segments.length > 0;
  }
}
