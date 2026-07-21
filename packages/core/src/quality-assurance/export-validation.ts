import type { QAExportReport } from "./types.js";

export class QAExportValidation {
  validate(codec: boolean, resolution: boolean, frameRate: boolean, bitrate: boolean, audioCodec: boolean, metadata: boolean, container: boolean): QAExportReport {
    return { codec, resolution, frameRate, bitrate, audioCodec, metadata, containerIntegrity: container, overall: codec && resolution && frameRate && bitrate && audioCodec && metadata && container };
  }

  isReady(report: QAExportReport): boolean {
    return report.overall;
  }
}
