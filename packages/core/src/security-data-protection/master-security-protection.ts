import { RoleBasedAuthorizationManager } from "./role-based-authorization-manager";
import { CryptoEncryptionVault } from "./crypto-encryption-vault";
import { ProjectIntegrityVerifier } from "./project-integrity-verifier";
import { DigitalSignatureArchiver } from "./digital-signature-archiver";
import { InputValidationPluginSecurity } from "./input-validation-plugin-security";
import { UserProfile, AuthSessionDescriptor } from "./security-types";

/**
 * Master Security Data Protection Engine (Main Vol 06 Part 10).
 * Core entry point for security layers, RBAC authorization, cryptographic encryption, project integrity checks, digital signatures, and privacy-first auditing.
 */
export class MasterSecurityProtection {
  public readonly rbac = new RoleBasedAuthorizationManager();
  public readonly cryptoVault = new CryptoEncryptionVault();
  public readonly integrityVerifier = new ProjectIntegrityVerifier();
  public readonly signatureArchiver = new DigitalSignatureArchiver();
  public readonly pluginSecurity = new InputValidationPluginSecurity();

  public createSession(user: UserProfile): AuthSessionDescriptor {
    const now = new Date();
    return {
      sessionId: `sess_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.userId,
      role: user.role,
      createdAt: now,
      expiresAt: new Date(now.getTime() + 8 * 3600 * 1000), // 8 hours
      activePermissions: this.rbac.getPermissionsForRole(user.role),
    };
  }
}
