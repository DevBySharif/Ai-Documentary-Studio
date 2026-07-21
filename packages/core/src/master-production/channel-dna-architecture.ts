import type { MPChannelDNA } from "./types.js";

export class MPChannelDNAArchitecture {
  private channels: Map<string, MPChannelDNA> = new Map();

  register(dna: MPChannelDNA): void {
    this.channels.set(dna.channelId, dna);
  }

  get(channelId: string): MPChannelDNA | undefined {
    const dna = this.channels.get(channelId);
    return dna ? { ...dna } : undefined;
  }

  update(channelId: string, partial: Partial<MPChannelDNA>): void {
    const existing = this.channels.get(channelId);
    if (existing) this.channels.set(channelId, { ...existing, ...partial });
  }

  getAllChannelIds(): string[] {
    return Array.from(this.channels.keys());
  }

  getCount(): number {
    return this.channels.size;
  }

  remove(channelId: string): boolean {
    return this.channels.delete(channelId);
  }
}
