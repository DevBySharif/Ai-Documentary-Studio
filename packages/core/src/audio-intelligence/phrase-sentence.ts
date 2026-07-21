import type { AIntWord, AIntPhrase, AIntSentence } from "./types.js";

export class AIntPhraseDetector {
  detect(words: AIntWord[], maxGap = 0.3): AIntPhrase[] {
    if (words.length === 0) return [];
    const phrases: AIntPhrase[] = [];
    let start = 0;

    for (let i = 1; i < words.length; i++) {
      const gap = words[i].start - words[i - 1].end;
      if (gap > maxGap) {
        const slice = words.slice(start, i);
        phrases.push({ text: slice.map((w) => w.text).join(" "), words: slice, start: slice[0].start, end: slice[slice.length - 1].end });
        start = i;
      }
    }

    const last = words.slice(start);
    if (last.length > 0) phrases.push({ text: last.map((w) => w.text).join(" "), words: last, start: last[0].start, end: last[last.length - 1].end });
    return phrases;
  }
}

export class AIntSentenceDetector {
  detect(words: AIntWord[]): AIntSentence[] {
    if (words.length === 0) return [];
    const sentences: AIntSentence[] = [];
    let start = 0;

    for (let i = 0; i < words.length; i++) {
      if (words[i].text.match(/[.!?]$/)) {
        const slice = words.slice(start, i + 1);
        sentences.push(this.buildSentence(slice));
        start = i + 1;
      }
    }

    const last = words.slice(start);
    if (last.length > 0) sentences.push(this.buildSentence(last));
    return sentences;
  }

  private buildSentence(words: AIntWord[]): AIntSentence {
    return {
      text: words.map((w) => w.text).join(" "),
      start: words[0].start,
      end: words[words.length - 1].end,
      duration: words[words.length - 1].end - words[0].start,
      importance: words.length > 10 ? 0.8 : words.length > 5 ? 0.5 : 0.3,
      narrativeRole: words.some((w) => ["?", "why", "how", "what"].includes(w.text.toLowerCase())) ? "question" : "exposition"
    };
  }

  classifyRole(sentence: AIntSentence): AIntSentence {
    const qWords = ["why", "how", "what", "when", "where", "who", "does", "is", "are", "can"];
    const isQuestion = qWords.some((q) => sentence.text.toLowerCase().startsWith(q)) || sentence.text.endsWith("?");
    const isReveal = ["because", "but", "however", "discover", "actually"].some((r) => sentence.text.toLowerCase().includes(r));
    const isReflection = ["perhaps", "maybe", "imagine", "think", "reflect"].some((r) => sentence.text.toLowerCase().includes(r));

    sentence.narrativeRole = isQuestion ? "question" : isReveal ? "reveal" : isReflection ? "reflection" : "exposition";
    return sentence;
  }
}
