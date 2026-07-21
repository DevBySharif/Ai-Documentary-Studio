import type { MemoryAssetEntry, ImageAnalysis, VisualDNASignature, ImageFingerprintData, PromptRecord, AssetTag, EmbeddingVector } from "./types.js";
import { ImageAnalyzer } from "./image-analyzer.js";
import { VisualEmbeddingEngine } from "./embedding-engine.js";
import { VisualDNASignatureBuilder } from "./visual-dna.js";
import { ImageFingerprintGenerator } from "./fingerprint.js";
import { VisualPromptMemoryStore } from "./prompt-memory.js";
import { ImageTaggingAI } from "./tagging-ai.js";
import { MultiChannelVisualMemory } from "./multi-channel.js";

export class VisualMemory {
  private analyzer: ImageAnalyzer;
  private embeddingEngine: VisualEmbeddingEngine;
  private dnaBuilder: VisualDNASignatureBuilder;
  private fingerprintGenerator: ImageFingerprintGenerator;
  private promptStore: VisualPromptMemoryStore;
  private taggingAI: ImageTaggingAI;
  private multiChannel: MultiChannelVisualMemory;

  constructor() {
    this.analyzer = new ImageAnalyzer();
    this.embeddingEngine = new VisualEmbeddingEngine();
    this.dnaBuilder = new VisualDNASignatureBuilder();
    this.fingerprintGenerator = new ImageFingerprintGenerator();
    this.promptStore = new VisualPromptMemoryStore();
    this.taggingAI = new ImageTaggingAI();
    this.multiChannel = new MultiChannelVisualMemory();
  }

  memorize(
    assetId: string,
    imageData: string,
    width: number,
    height: number,
    prompt: string,
    negativePrompt: string,
    model: string,
    seed: number,
    aspectRatio: string,
    qualitySettings: string,
    channelId: string,
    isGlobal: boolean,
    styleLabel: string,
    concept?: string,
    emotion?: string,
  ): MemoryAssetEntry {
    if (!assetId) throw new Error("assetId is required");
    if (!channelId) throw new Error("channelId is required");

    const analysis = this.analyzer.analyze(assetId, width, height, 85, emotion);
    const embedding = this.embeddingEngine.generate(assetId, imageData);
    const visualDNA = this.dnaBuilder.build(analysis, styleLabel ?? "default");
    const fingerprint = this.fingerprintGenerator.generate(assetId, imageData);
    const promptRecord: PromptRecord = {
      assetId,
      originalPrompt: prompt ?? "",
      negativePrompt: negativePrompt ?? "",
      model: model ?? "unknown",
      generationDate: new Date().toISOString(),
      seed: typeof seed === "number" ? seed : 0,
      aspectRatio: aspectRatio ?? "16:9",
      qualitySettings: qualitySettings ?? "default",
    };

    this.promptStore.store(promptRecord);
    const tags = this.taggingAI.assignTags(concept, emotion);

    const entry: MemoryAssetEntry = {
      assetId,
      imagePath: `assets/${assetId}.png`,
      thumbnailPath: `assets/${assetId}_thumb.png`,
      analysis,
      embedding: embedding.embedding,
      visualDNA,
      fingerprint,
      prompt: promptRecord,
      tags,
      channelId,
      isGlobal,
      createdAt: new Date().toISOString(),
    };

    this.multiChannel.addAsset(entry);
    return entry;
  }

  searchSimilar(
    _imageData: string,
    topK = 5
  ): Array<{ assetId: string; similarity: number }> {
    const allAssets = this.multiChannel.getAllGlobalAssets();
    const allChannels = this.multiChannel.getGlobal();

    const candidates = allAssets.length > 0
      ? allAssets
      : Array.from(allChannels.assets.values());

    if (candidates.length === 0) return [];

    const queryEmbedding = this.embeddingEngine.generate("query", _imageData ?? "").embedding;
    return this.embeddingEngine.nearestNeighbors(
      queryEmbedding,
      candidates.map((a) => ({ assetId: a.assetId, embedding: a.embedding })),
      topK
    );
  }

  detectDuplicate(assetId: string, imageData: string): { isDuplicate: boolean; matchAssetId?: string; similarity: number } {
    if (!assetId) throw new Error("assetId is required");

    const fingerprint = this.fingerprintGenerator.generate(assetId, imageData ?? "");
    const allAssets = this.multiChannel.getAllGlobalAssets();

    for (const existing of allAssets) {
      if (!existing.fingerprint) continue;
      const similarity = this.fingerprintGenerator.compareHashes(fingerprint, existing.fingerprint);
      if (similarity >= 95) {
        return { isDuplicate: true, matchAssetId: existing.assetId, similarity };
      }
    }

    return { isDuplicate: false, similarity: 0 };
  }

  getEmbeddingEngine(): VisualEmbeddingEngine {
    return this.embeddingEngine;
  }

  getPromptStore(): VisualPromptMemoryStore {
    return this.promptStore;
  }

  getMultiChannel(): MultiChannelVisualMemory {
    return this.multiChannel;
  }

  getAnalyzer(): ImageAnalyzer {
    return this.analyzer;
  }

  getDNASignatureBuilder(): VisualDNASignatureBuilder {
    return this.dnaBuilder;
  }
}
