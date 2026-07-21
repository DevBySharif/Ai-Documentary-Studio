import type { MPChannelDNA } from "./types.js";

export class MPMultiChannelWorkspace {
  private workspaceId: string;
  private channels: MPChannelDNA[] = [];

  constructor(workspaceId: string) {
    this.workspaceId = workspaceId;
  }

  getWorkspaceId(): string {
    return this.workspaceId;
  }

  addChannel(dna: MPChannelDNA): void {
    this.channels.push(dna);
  }

  getChannel(channelId: string): MPChannelDNA | undefined {
    return this.channels.find((c) => c.channelId === channelId);
  }

  getAllChannels(): MPChannelDNA[] {
    return this.channels.map((c) => ({ ...c }));
  }

  removeChannel(channelId: string): boolean {
    const idx = this.channels.findIndex((c) => c.channelId === channelId);
    if (idx < 0) return false;
    this.channels.splice(idx, 1);
    return true;
  }

  switchChannel(channelId: string): MPChannelDNA | null {
    const channel = this.getChannel(channelId);
    return channel ?? null;
  }

  getChannelCount(): number {
    return this.channels.length;
  }
}
