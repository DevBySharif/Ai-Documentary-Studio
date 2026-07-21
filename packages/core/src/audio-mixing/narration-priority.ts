export class AMNarrationPriority {
  private readonly maxGainReduction = 6;

  enforce(narrationVolume: number, musicVolume: number, isSpeaking: boolean): { narrationVolume: number; musicVolume: number } {
    if (!isSpeaking) return { narrationVolume: Math.min(narrationVolume, 0), musicVolume: musicVolume };

    let adjustedNarration = narrationVolume;
    let adjustedMusic = musicVolume;

    if (adjustedNarration > 0) adjustedNarration = 0;
    if (adjustedMusic > -3) adjustedMusic = -3;

    const gap = adjustedNarration - adjustedMusic;
    if (gap < 6) {
      adjustedMusic = adjustedNarration - 6;
    }

    return { narrationVolume: adjustedNarration, musicVolume: adjustedMusic };
  }

  preventClipping(volume: number, peak: number, threshold: number): number {
    if (peak + volume <= threshold) return volume;
    return threshold - peak;
  }

  preserveDynamics(volume: number): number {
    return Math.max(-6, Math.min(0, volume));
  }

  ensureDominant(narrationVolume: number, otherVolumes: number[]): number {
    const maxOther = Math.max(...otherVolumes, -100);
    const minGap = 4;
    if (narrationVolume - maxOther >= minGap) return narrationVolume;
    return maxOther + minGap;
  }
}
