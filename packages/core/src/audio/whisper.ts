import type { WhisperResult, WordTimestamp, Phrase } from "./types.js";

export class WhisperEngine {
  async transcribe(
    _audioBuffer: ArrayBuffer,
    _language?: string
  ): Promise<WhisperResult> {
    throw new Error("Whisper integration not yet connected. Implement with local whisper.cpp or OpenAI Whisper API.");
  }

  buildPhrases(words: WordTimestamp[]): Phrase[] {
    const phrases: Phrase[] = [];
    let current: WordTimestamp[] = [];
    let currentStart = 0;
    let phraseIndex = 0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (current.length === 0) currentStart = word.start;
      current.push(word);

      const gap = i < words.length - 1 ? words[i + 1].start - word.end : 0;
      const isLast = i === words.length - 1;

      if (gap > 0.3 || isLast || phraseIndex % 4 === 3) {
        phrases.push({
          text: current.map((w) => w.word).join(" "),
          words: [...current],
          start: currentStart,
          end: word.end,
        });
        current = [];
      }
      phraseIndex++;
    }

    return phrases;
  }

  estimateTimings(text: string, speechRate: number): WordTimestamp[] {
    const words = text.split(/\s+/);
    const wordDuration = 60 / (speechRate * 3);
    const timestamps: WordTimestamp[] = [];
    let currentTime = 0;

    for (const word of words) {
      const clean = word.replace(/[.,!?;:]/g, "");
      timestamps.push({
        word: clean,
        start: currentTime,
        end: currentTime + wordDuration,
        confidence: 0.95,
      });
      currentTime += wordDuration;
    }

    return timestamps;
  }
}
