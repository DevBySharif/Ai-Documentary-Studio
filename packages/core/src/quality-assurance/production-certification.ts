import type { QACertificate } from "./types.js";

export class QAProductionCertification {
  generate(productionId: string, renderProfile: string, channelDnaVersion: string, qaScore: number, exportFormat: string, approved: boolean): QACertificate {
    return {
      productionId,
      renderProfile,
      channelDnaVersion,
      qaScore,
      renderDate: new Date().toISOString(),
      exportFormat,
      approvalStatus: approved && qaScore >= 85 ? "Certified" : "Pending Review"
    };
  }

  isCertified(cert: QACertificate): boolean {
    return cert.approvalStatus === "Certified";
  }

  summary(cert: QACertificate): string {
    return `Production ${cert.productionId} | DNA v${cert.channelDnaVersion} | Score: ${cert.qaScore} | Status: ${cert.approvalStatus}`;
  }
}
