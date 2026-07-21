import { VPTimingData } from "./types";

export class VPTimingAlignment {
  generateTiming(script: string, audioDuration: number): VPTimingData {
    return {
      sentenceTimestamps: this.getSentenceTimestamps(script, audioDuration),
      phraseTimestamps: this.getPhraseTimestamps(script, audioDuration),
      wordTimestamps: this.getWordTimestamps(script, audioDuration),
    };
  }

  getSentenceTimestamps(
    script: string,
    duration: number
  ): { start: number; end: number; text: string }[] {
    const sentences = script
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (sentences.length === 0) return [];

    const totalChars = sentences.reduce((sum, s) => sum + s.length, 0);
    const charsPerSecond = totalChars / Math.max(duration, 0.01);
    let cursor = 0;

    return sentences.map((sentence) => {
      const charLen = sentence.length;
      const segDuration = charLen / charsPerSecond;
      const start = cursor;
      const end = cursor + segDuration;
      cursor = end;
      return {
        start: Math.round(start * 1000) / 1000,
        end: Math.round(end * 1000) / 1000,
        text: sentence,
      };
    });
  }

  getPhraseTimestamps(
    script: string,
    duration: number
  ): { start: number; end: number; text: string }[] {
    const words = script.split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];

    const phraseSize = Math.max(3, Math.ceil(words.length / 10));
    const phrases: string[] = [];
    for (let i = 0; i < words.length; i += phraseSize) {
      phrases.push(words.slice(i, i + phraseSize).join(" "));
    }

    const totalChars = phrases.reduce((sum, p) => sum + p.length, 0);
    const charsPerSecond = totalChars / Math.max(duration, 0.01);
    let cursor = 0;

    return phrases.map((phrase) => {
      const segDuration = phrase.length / charsPerSecond;
      const start = cursor;
      const end = cursor + segDuration;
      cursor = end;
      return {
        start: Math.round(start * 1000) / 1000,
        end: Math.round(end * 1000) / 1000,
        text: phrase,
      };
    });
  }

  getWordTimestamps(
    script: string,
    duration: number
  ): { start: number; end: number; word: string }[] {
    const words = script.split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];

    const totalChars = words.reduce((sum, w) => sum + w.length, 0);
    const charsPerSecond = totalChars / Math.max(duration, 0.01);
    let cursor = 0;

    return words.map((word) => {
      const segDuration = word.length / charsPerSecond;
      const start = cursor;
      const end = cursor + segDuration;
      cursor = end;
      return {
        start: Math.round(start * 1000) / 1000,
        end: Math.round(end * 1000) / 1000,
        word,
      };
    });
  }

  alignToAudio(
    script: string,
    audioDuration: number,
    audioSampleRate: number
  ): { timing: VPTimingData; samples: number } {
    const timing = this.generateTiming(script, audioDuration);
    const totalSamples = Math.floor(audioDuration * audioSampleRate);
    return { timing, samples: totalSamples };
  }
}
