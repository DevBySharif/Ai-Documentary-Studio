import { PackageInfo } from './types';

export class PackagingSystem {
  createWindowsInstaller(version: string): PackageInfo {
    console.log("Generating Windows Installer (.exe/.msi)");
    return {
      version,
      type: "WindowsInstaller",
      hash: "mock_sha256_hash",
      signatureValid: true
    };
  }

  createPortableBuild(version: string): PackageInfo {
    console.log("Generating Portable Build (.zip)");
    return {
      version,
      type: "Portable",
      hash: "mock_sha256_hash_portable",
      signatureValid: true
    };
  }
}
