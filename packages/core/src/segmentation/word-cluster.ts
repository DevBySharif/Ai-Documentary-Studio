export interface WordCluster {
  words: string[];
  start: number;
  end: number;
  concept: string;
  isEmphasis: boolean;
}

export class WordClusterDetector {
  detect(text: string, emphasisWords: string[]): WordCluster[] {
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const clusters: WordCluster[] = [];

    for (const sentence of sentences) {
      const words = sentence.trim().split(/\s+/);
      const keyWords = words.filter((w) => emphasisWords.some((e) => e.toLowerCase() === w.toLowerCase()));

      clusters.push({
        words: keyWords.length > 0 ? keyWords : words.slice(0, 3),
        start: 0,
        end: 0,
        concept: keyWords[0] ?? words[0] ?? "",
        isEmphasis: keyWords.length > 0,
      });
    }

    return this.mergeAdjacent(clusters);
  }

  private mergeAdjacent(clusters: WordCluster[]): WordCluster[] {
    if (clusters.length <= 1) return clusters;
    const merged: WordCluster[] = [clusters[0]];

    for (let i = 1; i < clusters.length; i++) {
      const last = merged[merged.length - 1];
      if (!clusters[i].isEmphasis && !last.isEmphasis) {
        last.words.push(...clusters[i].words);
        last.end = clusters[i].end;
      } else {
        merged.push(clusters[i]);
      }
    }

    return merged;
  }
}
