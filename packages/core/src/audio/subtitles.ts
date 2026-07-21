import type { SubtitleBlock, WordTimestamp } from "./types.js";
import type { EmotionTag } from "../story/types.js";

const MAX_SUBTITLE_CHARS = 80;
const MAX_SUBTITLE_DURATION = 5.0;

export class SubtitleGenerator {
  generate(
    words: WordTimestamp[],
    emphasisWords: string[],
    emotion: EmotionTag
  ): SubtitleBlock[] {
    const blocks: SubtitleBlock[] = [];
    let currentBlock: WordTimestamp[] = [];
    let charCount = 0;
    let blockIndex = 0;

    for (const word of words) {
      const wordLen = word.word.length + 1;

      if (charCount + wordLen > MAX_SUBTITLE_CHARS || currentBlock.length > 0 &&
          (word.start - currentBlock[currentBlock.length - 1].end) > 0.5) {
        blocks.push(this.buildBlock(currentBlock, emphasisWords, emotion, blockIndex++));
        currentBlock = [];
        charCount = 0;
      }

      currentBlock.push(word);
      charCount += wordLen;
    }

    if (currentBlock.length > 0) {
      blocks.push(this.buildBlock(currentBlock, emphasisWords, emotion, blockIndex));
    }

    return blocks;
  }

  private buildBlock(
    words: WordTimestamp[],
    emphasisWords: string[],
    emotion: EmotionTag,
    index: number
  ): SubtitleBlock {
    const text = words.map((w) => w.word).join(" ");
    const highlightedWords = words
      .filter((w) => emphasisWords.includes(w.word))
      .map((w) => w.word);

    return {
      index,
      start: words[0].start,
      end: words[words.length - 1].end,
      text,
      emotion,
      highlightedWords,
    };
  }
}
