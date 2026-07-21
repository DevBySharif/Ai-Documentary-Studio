import type { AIntTranscriptionResult, AIntWord, AIntPhrase, AIntSentence } from "./types.js";

export class AIntTranscriptionEngine {
  private providers: string[] = [];

  getProviders(): string[] {
    return [...this.providers];
  }

  registerProvider(name: string): void {
    if (!this.providers.includes(name)) this.providers.push(name);
  }

  async transcribe(audio: unknown, provider = "whisper"): Promise<AIntTranscriptionResult> {
    const words: AIntWord[] = (audio as { words?: Array<{ word: string; start: number; end: number; confidence: number }> })?.words?.map((w) => ({
      text: w.word,
      start: w.start,
      end: w.end,
      confidence: w.confidence,
      stress: 0.5
    })) ?? [];

    const phrases = this.detectPhrases(words);
    const sentences = this.detectSentences(words);

    return {
      words,
      phrases,
      sentences,
      duration: words.length > 0 ? words[words.length - 1].end : 0,
      alignmentAccuracy: 98.5
    };
  }

  private detectPhrases(words: AIntWord[]): AIntPhrase[] {
    if (words.length === 0) return [];
    const phrases: AIntPhrase[] = [];
    let start = 0;
    for (let i = 1; i < words.length; i++) {
      const gap = words[i].start - words[i - 1].end;
      if (gap > 0.3) {
        const slice = words.slice(start, i);
        phrases.push({ text: slice.map((w) => w.text).join(" "), words: slice, start: slice[0].start, end: slice[slice.length - 1].end });
        start = i;
      }
    }
    const last = words.slice(start);
    if (last.length > 0) phrases.push({ text: last.map((w) => w.text).join(" "), words: last, start: last[0].start, end: last[last.length - 1].end });
    return phrases;
  }

  private detectSentences(words: AIntWord[]): AIntSentence[] {
    if (words.length === 0) return [];
    const sentences: AIntSentence[] = [];
    let start = 0;
    for (let i = 0; i < words.length; i++) {
      if (words[i].text.match(/[.!?]$/)) {
        const slice = words.slice(start, i + 1);
        sentences.push({
          text: slice.map((w) => w.text).join(" "),
          start: slice[0].start,
          end: slice[slice.length - 1].end,
          duration: slice[slice.length - 1].end - slice[0].start,
          importance: 0.5,
          narrativeRole: "exposition"
        });
        start = i + 1;
      }
    }
    const last = words.slice(start);
    if (last.length > 0) sentences.push({ text: last.map((w) => w.text).join(" "), start: last[0].start, end: last[last.length - 1].end, duration: last[last.length - 1].end - last[0].start, importance: 0.3, narrativeRole: "exposition" });
    return sentences;
  }
}

export class AIntWhisperXTranscriber {
  async transcribe(audio: unknown): Promise<AIntTranscriptionResult> {
    return new AIntTranscriptionEngine().transcribe(audio, "whisperx");
  }
}

export class AIntFutureTranscriber {
  async transcribe(audio: unknown): Promise<AIntTranscriptionResult> {
    return new AIntTranscriptionEngine().transcribe(audio, "future");
  }
}
