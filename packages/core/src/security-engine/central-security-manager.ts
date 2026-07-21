import { AuthContext } from "./auth-model";
import { SecretVault } from "./secret-vault";
import { LicensingEngine } from "./licensing-engine";
import { DigitalSignatureVerifier } from "./digital-signature-verifier";
import { SecurityAuditLogger } from "./security-audit-logger";

export interface SecurityOutputContract {
  securityEvent: string;
  plugin: string;
  signature: string;
  status: string;
}

/**
 * Master Security Manager (IB Part 23).
 * Single point of coordination for authentication, authorization, secret access, licensing,
 * digital signature verification, fail-secure defaults, and Section 19 Output Contract.
 */
export class SecurityManager {
  public readonly authContext = new AuthContext();
  public readonly secretVault = new SecretVault();
  public readonly licensingEngine = new LicensingEngine();
  public readonly signatureVerifier = new DigitalSignatureVerifier();
  public readonly auditLogger = new SecurityAuditLogger();

  public readonly policyVersion = "2.0";

  public async verifyAndApprovePlugin(
    pluginId: string,
    signature?: string
  ): Promise<SecurityOutputContract> {
    const verification = await this.signatureVerifier.verifyPluginSignature(pluginId, signature);

    const status = verification.isValid ? "Approved" : "Denied";

    this.auditLogger.logSecurityEvent(
      "PluginVerification",
      this.authContext.getProfile().userId,
      pluginId,
      { signatureStatus: verification.signatureStatus }
    );

    return {
      securityEvent: "PluginVerification",
      plugin: pluginId,
      signature: verification.signatureStatus,
      status,
    };
  }

  /**
   * Section 19 Output Contract Generator
   */
  public getOutputContract(
    pluginId = "com.example.effectpack",
    signatureStatus = "Valid",
    status = "Approved"
  ): SecurityOutputContract {
    return {
      securityEvent: "PluginVerification",
      plugin: pluginId,
      signature: signatureStatus,
      status,
    };
  }
}
