import { VoiceVersionItem } from "./voice-ui-types";

/**
 * Voice Comparison Engine & Version History Manager (Vol 05 Part 10 - Section 13, Section 16).
 * Compares multiple AI/human narration takes side by side and maintains recoverable narration version history.
 */
export class VoiceComparisonVersioning {
  private versions: VoiceVersionItem[] = [];

  public addVersion(versionName: string, audioFileUrl: string, durationSecs: number): VoiceVersionItem {
    const version: VoiceVersionItem = {
      versionNumber: this.versions.length + 1,
      versionName,
      audioFileUrl,
      durationSecs,
      isApproved: false,
      createdAt: new Date(),
    };
    this.versions.push(version);
    return version;
  }

  public compareTakes(versionIdA: number, versionIdB: number): { takeA: VoiceVersionItem | undefined; takeB: VoiceVersionItem | undefined } {
    return {
      takeA: this.versions.find((v) => v.versionNumber === versionIdA),
      takeB: this.versions.find((v) => v.versionNumber === versionIdB),
    };
  }

  public getVersionHistory(): ReadonlyArray<VoiceVersionItem> {
    return this.versions;
  }
}
