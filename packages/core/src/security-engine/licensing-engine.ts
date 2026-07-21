export type LicenseTier =
  | "Free"
  | "Personal"
  | "Professional"
  | "Enterprise"
  | "Educational"
  | "Trial";

export interface LicenseToken {
  readonly licenseKey: string;
  readonly tier: LicenseTier;
  readonly validUntil: Date;
  readonly isSignatureValid: boolean;
}

/**
 * Licensing & Feature Gating Engine (IB Part 23 - Section 8, Section 9, Section 23).
 * Projects remain portable across license tiers without data corruption.
 */
export class LicensingEngine {
  private currentLicense: LicenseToken = {
    licenseKey: "LIC-PRO-2026-STUDIO",
    tier: "Professional",
    validUntil: new Date("2028-12-31"),
    isSignatureValid: true,
  };

  public getLicense(): LicenseToken {
    return this.currentLicense;
  }

  public isFeatureAllowed(featureName: string): boolean {
    if (!this.currentLicense.isSignatureValid) return false;

    switch (this.currentLicense.tier) {
      case "Enterprise":
      case "Professional":
        return true;
      case "Personal":
        return featureName !== "TeamCollaboration" && featureName !== "CloudSync";
      case "Free":
      default:
        return featureName === "BasicEditing" || featureName === "LocalExport";
    }
  }
}
