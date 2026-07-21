export interface ArchiveCandidate {
  assetId: string;
  reason: "unused" | "outdated" | "low_quality" | "superseded_version";
  score: number;
}

export class SmartArchiver {
  private archived = new Map<string, ArchiveCandidate & { archivedAt: string }>();

  identifyCandidates(assets: Array<{ id: string; lastUsedDays: number; qualityScore: number; hasNewerVersion: boolean }>): ArchiveCandidate[] {
    const candidates: ArchiveCandidate[] = [];

    for (const asset of assets) {
      if (asset.lastUsedDays > 180) {
        candidates.push({ assetId: asset.id, reason: "unused", score: 30 });
      } else if (asset.hasNewerVersion) {
        candidates.push({ assetId: asset.id, reason: "superseded_version", score: 50 });
      } else if (asset.qualityScore < 30) {
        candidates.push({ assetId: asset.id, reason: "low_quality", score: 40 });
      }
    }

    return candidates.sort((a, b) => b.score - a.score);
  }

  archive(assetId: string, candidate: ArchiveCandidate): void {
    this.archived.set(assetId, { ...candidate, archivedAt: new Date().toISOString() });
  }

  isArchived(assetId: string): boolean {
    return this.archived.has(assetId);
  }

  restore(assetId: string): boolean {
    return this.archived.delete(assetId);
  }

  getArchivedCount(): number {
    return this.archived.size;
  }
}
