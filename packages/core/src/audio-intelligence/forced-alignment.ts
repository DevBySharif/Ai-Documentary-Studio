import type { AIntWord } from "./types.js";

export class AIntForcedAlignment {
  align(script: string, words: AIntWord[]): { aligned: AIntWord[]; accuracy: number } {
    const scriptWords = script.split(/\s+/).filter((w) => w.length > 0);
    const aligned: AIntWord[] = [];
    let matches = 0;

    for (let i = 0; i < Math.min(scriptWords.length, words.length); i++) {
      const sw = scriptWords[i].toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
      const aw = words[i].text.toLowerCase();
      const match = sw === aw;
      if (match) matches++;

      aligned.push({
        ...words[i],
        text: scriptWords[i],
        confidence: match ? words[i].confidence : words[i].confidence * 0.5
      });
    }

    const accuracy = scriptWords.length > 0 ? (matches / Math.max(scriptWords.length, words.length)) * 100 : 0;
    return { aligned, accuracy: Math.round(accuracy * 10) / 10 };
  }

  adjustTiming(script: string, audioDuration: number): AIntWord[] {
    const sw = script.split(/\s+/).filter((w) => w.length > 0);
    const perWord = audioDuration / sw.length;
    return sw.map((word, i) => ({
      text: word,
      start: i * perWord,
      end: (i + 1) * perWord,
      confidence: 0.9,
      stress: 0.5
    }));
  }
}
