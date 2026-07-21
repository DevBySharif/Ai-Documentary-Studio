import { PackageInfo } from './types';

export class ArtifactRepository {
  private artifacts: Map<string, PackageInfo> = new Map();

  publishArtifact(buildId: string, pkg: PackageInfo): void {
    console.log(`Publishing artifact for build ${buildId} to repository`);
    this.artifacts.set(buildId, pkg);
  }

  getArtifact(buildId: string): PackageInfo | undefined {
    return this.artifacts.get(buildId);
  }
}
