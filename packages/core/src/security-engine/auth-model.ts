export type AuthMode = "LocalProfile" | "CloudAccount" | "Enterprise" | "Guest";

export interface UserProfile {
  readonly userId: string;
  readonly username: string;
  readonly mode: AuthMode;
  readonly roles: ReadonlyArray<string>;
  readonly isAuthenticated: boolean;
}

export interface SecurityPolicy {
  readonly policyVersion: string;
  readonly allowedCapabilities: ReadonlyArray<string>;
  readonly enforceDigitalSignatures: boolean;
}

/**
 * Authentication & Authorization Model (IB Part 23 - Section 4, Section 5).
 */
export class AuthContext {
  private currentProfile: UserProfile = {
    userId: "usr_local_default",
    username: "Local Creator",
    mode: "LocalProfile",
    roles: ["Creator", "Admin"],
    isAuthenticated: true,
  };

  public getProfile(): UserProfile {
    return this.currentProfile;
  }

  public isAuthorized(requiredRole: string): boolean {
    if (this.currentProfile.mode === "Guest") return false;
    return this.currentProfile.roles.includes(requiredRole);
  }
}
