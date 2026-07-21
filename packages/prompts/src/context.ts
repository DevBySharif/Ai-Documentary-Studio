import pino from 'pino';

const logger = pino({ name: 'context-window-manager' });

export class ContextWindowManager {
  /**
   * Intelligently compresses or truncates historical data to fit token limits.
   * Currently uses a naive character-based heuristic (e.g., 1 token ~= 4 chars).
   */
  static manage(history: string[], maxTokens: number = 8000): string {
    const charsPerToken = 4;
    const maxChars = maxTokens * charsPerToken;

    let currentLength = 0;
    const compressedHistory: string[] = [];

    // Traverse backwards to prioritize recent context
    for (let i = history.length - 1; i >= 0; i--) {
      const entry = history[i];
      if (currentLength + entry.length <= maxChars) {
        compressedHistory.unshift(entry);
        currentLength += entry.length;
      } else {
        logger.warn({ droppedEntries: i + 1 }, 'Context window limit reached. Truncating historical context.');
        break;
      }
    }

    return compressedHistory.join('\n');
  }
}
