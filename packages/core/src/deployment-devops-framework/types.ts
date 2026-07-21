export type Environment = "Local" | "CI" | "QA" | "Staging" | "Production";
export type ReleaseChannel = "Stable" | "Beta" | "Preview" | "Developer" | "LTS";
export type DeploymentStatus = "Pending" | "Testing" | "Signing" | "Packaging" | "Ready" | "Failed" | "Deployed";

export interface BuildMetadata {
  buildId: string;
  timestamp: string;
  commitHash: string;
  branch: string;
  compilerVersion: string;
  sdkVersion: string;
}

export interface PackageInfo {
  version: string;
  type: "WindowsInstaller" | "Portable" | "OfflineInstaller" | "PluginBundle";
  hash: string;
  signatureValid: boolean;
}

export interface OutputContract {
  build: string;
  channel: string;
  signed: boolean;
  verified: boolean;
  status: string;
}
