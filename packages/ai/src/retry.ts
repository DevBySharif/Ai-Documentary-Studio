import pino from 'pino';

const logger = pino({ name: 'ai-retry-manager' });

export class RetryManager {
  /**
   * Executes a task with policy-driven retries.
   * Only retries transient errors (Network, 429, 500, timeouts).
   * Does NOT retry Auth (401, 403) or Validation (400) failures.
   */
  static async executeWithRetry<T>(
    task: () => Promise<T>,
    maxRetries: number = 3,
    baseBackoffMs: number = 1000
  ): Promise<T> {
    let attempt = 0;

    while (attempt <= maxRetries) {
      try {
        return await task();
      } catch (error: any) {
        const isTransient = this.isTransientError(error);

        if (!isTransient || attempt >= maxRetries) {
          logger.error({ error, attempt }, 'Task failed completely or error is not retryable.');
          throw error;
        }

        attempt++;
        const delay = baseBackoffMs * Math.pow(2, attempt - 1); // Exponential backoff
        logger.warn({ error: error.message, attempt, delay }, 'Transient error encountered. Retrying...');
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error('Retry loop exhausted unexpectedly'); // Should theoretically be unreachable
  }

  private static isTransientError(error: any): boolean {
    // Implement specific logic based on standard Provider error codes
    const status = error?.status || error?.statusCode;
    if (status) {
      if (status === 400 || status === 401 || status === 403) return false;
      if (status === 429 || status >= 500) return true;
    }
    
    // Check timeout or network signatures
    const msg = error?.message?.toLowerCase() || '';
    if (msg.includes('timeout') || msg.includes('network') || msg.includes('econnreset')) {
      return true;
    }

    // Default to false for safety if we can't classify it
    return false;
  }
}
