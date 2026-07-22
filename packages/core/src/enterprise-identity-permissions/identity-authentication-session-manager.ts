import { IdentityDescriptor, AuthSessionState, AuthMethodType } from "./identity-permission-types";

/**
 * Identity Manager, Multi-Factor/SSO Authentication & Session Manager (Vol 08 Part 05 - Section 4, Section 5, Section 6).
 * Manages globally unique identities, supports multiple authentication methods (SSO, MFA, API Tokens), and controls session revocations.
 */
export class IdentityAuthenticationSessionManager {
  private identities = new Map<string, IdentityDescriptor>();
  private activeSessions = new Map<string, AuthSessionState>();

  public registerIdentity(identity: IdentityDescriptor): void {
    this.identities.set(identity.userId, identity);
  }

  public createAuthenticatedSession(
    userId: string,
    authMethod: AuthMethodType,
    deviceInfo = "Desktop Client"
  ): AuthSessionState {
    const session: AuthSessionState = {
      sessionId: `sess_ent_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      deviceInformation: deviceInfo,
      authMethod,
      loginTime: new Date(),
      expiresAt: new Date(Date.now() + 12 * 3600 * 1000), // 12 hours
      isRevoked: false,
    };

    this.activeSessions.set(session.sessionId, session);
    return session;
  }

  public revokeSession(sessionId: string): boolean {
    const sess = this.activeSessions.get(sessionId);
    if (!sess) return false;

    this.activeSessions.set(sessionId, { ...sess, isRevoked: true });
    return true;
  }
}
