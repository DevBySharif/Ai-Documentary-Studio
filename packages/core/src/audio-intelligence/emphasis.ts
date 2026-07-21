import type { AIntWord, AIntEmphasis } from "./types.js";

export class AIntEmphasisDetector {
  detect(words: AIntWord[], pitchData: number[] = [], volumeData: number[] = []): AIntEmphasis[] {
    const emphasis: AIntEmphasis[] = [];
    const avgPitch = pitchData.length > 0 ? pitchData.reduce((a, b) => a + b, 0) / pitchData.length : 200;
    const avgVolume = volumeData.length > 0 ? volumeData.reduce((a, b) => a + b, 0) / volumeData.length : 0.5;

    for (let i = 0; i < words.length; i++) {
      const pitch = i < pitchData.length ? pitchData[i] : avgPitch;
      const volume = i < volumeData.length ? volumeData[i] : avgVolume;
      const duration = words[i].end - words[i].start;
      const rate = words[i].text.length / (duration || 0.01);

      const pitchScore = Math.min(1, pitch / avgPitch / 2);
      const volumeScore = Math.min(1, volume / avgVolume / 2);
      const durationScore = Math.min(1, duration / 0.4);
      const rateScore = Math.min(1, 1 - rate / 10);

      const score = (pitchScore * 0.3 + volumeScore * 0.3 + durationScore * 0.2 + rateScore * 0.2);

      if (score > 0.6) {
        emphasis.push({
          word: words[i].text,
          frame: i,
          pitch,
          volume,
          duration,
          speechRate: rate,
          score
        });
      }
    }

    return emphasis.sort((a, b) => b.score - a.score);
  }

  getTopEmphasis(emphasis: AIntEmphasis[], limit = 5): AIntEmphasis[] {
    return emphasis.slice(0, limit);
  }
}
