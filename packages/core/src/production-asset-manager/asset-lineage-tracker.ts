interface LineageRecord {
  sourceAssetId: string;
  derivedAssetId: string;
  transformation: string;
  timestamp: string;
}

export class PAAssetLineageTracker {
  private records: LineageRecord[] = [];

  recordLineage(sourceAssetId: string, derivedAssetId: string, transformation: string): void {
    this.records.push({
      sourceAssetId,
      derivedAssetId,
      transformation,
      timestamp: new Date().toISOString(),
    });
  }

  getLineage(assetId: string): { ancestors: string[]; descendants: string[] } {
    const ancestors: string[] = [];
    const descendants: string[] = [];
    const visited = new Set<string>();

    const findAncestors = (id: string): void => {
      for (const r of this.records) {
        if (r.derivedAssetId === id && !visited.has(r.sourceAssetId)) {
          visited.add(r.sourceAssetId);
          ancestors.push(r.sourceAssetId);
          findAncestors(r.sourceAssetId);
        }
      }
    };

    const findDescendants = (id: string): void => {
      for (const r of this.records) {
        if (r.sourceAssetId === id && !visited.has(r.derivedAssetId)) {
          visited.add(r.derivedAssetId);
          descendants.push(r.derivedAssetId);
          findDescendants(r.derivedAssetId);
        }
      }
    };

    visited.clear();
    findAncestors(assetId);
    visited.clear();
    findDescendants(assetId);

    return { ancestors, descendants };
  }

  getFullTrace(assetId: string): { step: string; assetId: string; transformation: string }[] {
    const trace: { step: string; assetId: string; transformation: string }[] = [];
    const visited = new Set<string>();
    let step = 1;

    const traverse = (id: string): void => {
      for (const r of this.records) {
        if (r.sourceAssetId === id && !visited.has(r.derivedAssetId)) {
          visited.add(r.derivedAssetId);
          trace.push({ step: `step_${step++}`, assetId: r.derivedAssetId, transformation: r.transformation });
          traverse(r.derivedAssetId);
        }
      }
    };

    traverse(assetId);
    return trace;
  }

  traceToScript(finalAssetId: string): string {
    const { ancestors } = this.getLineage(finalAssetId);
    const script = ancestors.find((id) => id.includes("script"));
    return script ?? "unknown";
  }
}
