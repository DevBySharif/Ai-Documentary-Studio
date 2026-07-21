export class ContinuityScoreCalculator {
  calculate(conceptA: string, conceptB: string, emotionA: string, emotionB: string): number {
    let score = 0;

    if (conceptA === conceptB) {
      score += 0.5;
    } else {
      const similarity = this.conceptSimilarity(conceptA, conceptB);
      score += similarity * 0.5;
    }

    if (emotionA === emotionB) {
      score += 0.3;
    } else {
      score += 0.1;
    }

    score += 0.2;

    return Math.max(0, Math.min(1, score));
  }

  private conceptSimilarity(a: string, b: string): number {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();

    if (aLower === bLower) return 1;
    if (aLower.includes(bLower) || bLower.includes(aLower)) return 0.8;

    const aWords = aLower.split(/\s+/);
    const bWords = bLower.split(/\s+/);
    const common = aWords.filter((w) => bWords.includes(w));
    const allWords = new Set([...aWords, ...bWords]);

    return allWords.size > 0 ? common.length / allWords.size : 0;
  }
}
