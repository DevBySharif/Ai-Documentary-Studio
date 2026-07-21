import { DocVersion } from './types';

export class VersionedDocumentation {
  private history: Map<string, DocVersion[]> = new Map();

  recordNewVersion(docId: string, versionData: DocVersion): void {
    if (!this.history.has(docId)) {
      this.history.set(docId, []);
    }
    this.history.get(docId)?.push(versionData);
    console.log(`Recorded new version ${versionData.version} for doc ${docId}`);
  }

  getHistory(docId: string): DocVersion[] {
    return this.history.get(docId) || [];
  }
}
