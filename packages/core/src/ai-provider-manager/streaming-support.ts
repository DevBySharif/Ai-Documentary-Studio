export class APStreamingSupport {
  supportsStreaming(provider: string): boolean {
    const streamingProviders = ["gemini", "openai", "ollama", "google_ai_studio"];
    return streamingProviders.includes(provider);
  }

  async *streamResponse(provider: string, prompt: string): AsyncIterable<string> {
    yield `[${provider}] `;
    yield prompt.substring(0, 50);
    yield "... [streaming complete]";
  }
}
