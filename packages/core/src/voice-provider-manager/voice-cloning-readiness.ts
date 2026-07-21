import { VPProviderName } from "./types";

const CLONE_CAPABLE_PROVIDERS: VPProviderName[] = [
  "elevenlabs",
  "openai_tts",
  "cartesia",
  "playht",
  "coqui",
];

export class VPVoiceCloningReadiness {
  private identities: Map<
    string,
    { metadata: Record<string, unknown>; consentStatus: string; profileData?: unknown }
  > = new Map();

  registerIdentity(
    identityId: string,
    metadata: Record<string, unknown>
  ): void {
    this.identities.set(identityId, {
      metadata: { ...metadata },
      consentStatus: "pending",
      profileData: null,
    });
  }

  storeVoiceProfile(
    identityId: string,
    profileData: unknown
  ): void {
    const identity = this.identities.get(identityId);
    if (identity) {
      identity.profileData = profileData;
      this.identities.set(identityId, identity);
    }
  }

  detectCloneCapability(provider: VPProviderName): boolean {
    return CLONE_CAPABLE_PROVIDERS.includes(provider);
  }

  getConsentStatus(identityId: string): string {
    const identity = this.identities.get(identityId);
    return identity ? identity.consentStatus : "unknown";
  }

  setConsentStatus(identityId: string, status: string): void {
    const identity = this.identities.get(identityId);
    if (identity) {
      identity.consentStatus = status;
      this.identities.set(identityId, identity);
    }
  }

  getCloneAdapters(): VPProviderName[] {
    return [...CLONE_CAPABLE_PROVIDERS];
  }

  getIdentity(identityId: string): Record<string, unknown> | undefined {
    const identity = this.identities.get(identityId);
    return identity
      ? {
          identityId,
          ...identity,
        }
      : undefined;
  }

  hasIdentity(identityId: string): boolean {
    return this.identities.has(identityId);
  }

  getAllIdentities(): string[] {
    return Array.from(this.identities.keys());
  }

  removeIdentity(identityId: string): boolean {
    return this.identities.delete(identityId);
  }

  isReadyForCloning(identityId: string, provider: VPProviderName): boolean {
    const identity = this.identities.get(identityId);
    if (!identity) return false;
    if (identity.consentStatus !== "granted") return false;
    if (!this.detectCloneCapability(provider)) return false;
    if (!identity.profileData) return false;
    return true;
  }
}
