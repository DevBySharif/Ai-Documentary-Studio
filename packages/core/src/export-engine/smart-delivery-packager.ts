import type { EEDeliveryPackage, EEMetadata } from "./types.js";

export class EESmartDeliveryPackager {
  package(
    videoPath: string, thumbnails: string[], subtitleFiles: string[],
    metadata: EEMetadata, qaReportPath: string, certificatePath: string, archivePath: string
  ): EEDeliveryPackage {
    return {
      video: videoPath, thumbnails, subtitleFiles,
      metadata, qaReport: qaReportPath,
      certificate: certificatePath, archiveProject: archivePath
    };
  }

  isComplete(pkg: EEDeliveryPackage): boolean {
    return !!pkg.video && pkg.thumbnails.length > 0 && Object.keys(pkg.metadata).length > 0;
  }
}
