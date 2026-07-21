import type { MemoryAssetEntry, GlobalAssetLibrary, ChannelAssetLibrary, VisualDNASignature } from "./types.js";

export class MultiChannelVisualMemory {
  private global: GlobalAssetLibrary = {
    assets: new Map(),
    universalSymbols: ["infinity", "circle", "spiral", "eye", "compass", "hourglass", "tree"],
    commonObjects: ["book", "star", "door", "mountain", "ocean", "clock", "candle", "key"],
    natureTags: ["tree", "mountain", "ocean", "star", "garden", "light"],
    spaceTags: ["galaxy", "star", "universe", "nebula", "cosmos", "infinity"],
    abstractConcepts: ["consciousness", "time", "memory", "identity", "dream", "mind", "soul", "infinity"],
  };

  private channels = new Map<string, ChannelAssetLibrary>();

  getGlobal(): GlobalAssetLibrary {
    return this.global;
  }

  getOrCreateChannel(channelId: string, channelDNA?: VisualDNASignature): ChannelAssetLibrary {
    if (!channelId) throw new Error("channelId is required");

    let channel = this.channels.get(channelId);
    if (!channel) {
      channel = {
        channelId,
        channelDNA: channelDNA ?? { style: "default", mood: "neutral", camera: "medium", lighting: "soft", color: "monochrome", emotion: "neutral" },
        characterStyle: "stick_figure",
        promptTemplates: [],
        motionPreferences: ["slow_push", "gentle_pan", "hold"],
        colorLanguage: ["monochrome", "accent_blue"],
        storyStyle: "documentary",
        assets: new Map(),
      };
      this.channels.set(channelId, channel);
    }
    return channel;
  }

  addAsset(asset: MemoryAssetEntry): void {
    if (!asset) throw new Error("MemoryAssetEntry is required");
    if (!asset.assetId) throw new Error("Asset must have an assetId");

    if (asset.isGlobal) {
      this.global.assets.set(asset.assetId, asset);
    } else {
      const channel = this.channels.get(asset.channelId);
      if (channel) {
        channel.assets.set(asset.assetId, asset);
      }
    }
  }

  getAsset(assetId: string): MemoryAssetEntry | undefined {
    if (!assetId) return undefined;
    return this.global.assets.get(assetId) ?? this.findInChannels(assetId);
  }

  searchGlobal(query: string): MemoryAssetEntry[] {
    if (!query) return [];
    const lower = query.toLowerCase();
    return Array.from(this.global.assets.values()).filter(
      (a) => (a.tags ?? []).some((t) => (t.tag ?? "").includes(lower))
        || (a.visualDNA?.style ?? "").includes(lower)
        || (a.visualDNA?.emotion ?? "").includes(lower)
    );
  }

  searchChannel(channelId: string, query: string): MemoryAssetEntry[] {
    if (!channelId || !query) return [];
    const channel = this.channels.get(channelId);
    if (!channel) return [];
    const lower = query.toLowerCase();
    return Array.from(channel.assets.values()).filter(
      (a) => (a.tags ?? []).some((t) => (t.tag ?? "").includes(lower))
        || (a.visualDNA?.style ?? "").includes(lower)
        || (a.visualDNA?.emotion ?? "").includes(lower)
    );
  }

  getAllGlobalAssets(): MemoryAssetEntry[] {
    return Array.from(this.global.assets.values());
  }

  getAllChannelAssets(channelId: string): MemoryAssetEntry[] {
    if (!channelId) return [];
    return Array.from(this.channels.get(channelId)?.assets.values() ?? []);
  }

  private findInChannels(assetId: string): MemoryAssetEntry | undefined {
    for (const channel of this.channels.values()) {
      const asset = channel.assets.get(assetId);
      if (asset) return asset;
    }
    return undefined;
  }
}
