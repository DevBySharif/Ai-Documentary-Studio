interface ExportRecord {
  date: string;
  format: string;
  path: string;
}

export class PAExportSystem {
  private exports: Map<string, ExportRecord[]> = new Map();

  exportAsset(assetId: string, format: string, destination: string): string {
    const exportPath = `${destination}/${assetId}.${format}`;
    this.recordExport(assetId, format, exportPath);
    return exportPath;
  }

  exportScenePackage(projectId: string, sceneId: string): string {
    const exportPath = `${projectId}_${sceneId}_package.zip`;
    return exportPath;
  }

  exportProjectAssets(projectId: string): string {
    return `${projectId}_assets_export.zip`;
  }

  exportArchiveBundle(projectId: string): string {
    return `${projectId}_archive_bundle.zip`;
  }

  getExportHistory(assetId: string): ExportRecord[] {
    return this.exports.get(assetId) ?? [];
  }

  private recordExport(assetId: string, format: string, path: string): void {
    if (!this.exports.has(assetId)) this.exports.set(assetId, []);
    this.exports.get(assetId)!.push({
      date: new Date().toISOString(),
      format,
      path,
    });
  }
}
