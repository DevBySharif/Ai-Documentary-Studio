import type { EEMetadata } from "./types.js";

export class EEMetadataEmbedding {
  private metadata: EEMetadata = {
    title: "", author: "", copyright: "", description: "",
    language: "en", creationDate: new Date().toISOString(),
    productionVersion: "1.0", channelDnaVersion: "1.0"
  };

  configure(meta: Partial<EEMetadata>): void {
    this.metadata = { ...this.metadata, ...meta };
  }

  getMetadata(): EEMetadata {
    return { ...this.metadata };
  }

  embed(target: string): string {
    return `${target}_with_metadata`;
  }

  toJSON(): string {
    return JSON.stringify(this.metadata, null, 2);
  }
}
