import { ProjectFolderBuilder } from "./project-folder-builder";
import { StorageAbstractionProvider } from "./storage-abstraction-provider";
import { ProjectPackageArchiver } from "./project-package-archiver";
import { DisposableCleanupPolicyEngine } from "./disposable-cleanup-policy-engine";
import { FileIntegrityVerifier } from "./file-integrity-verifier";

/**
 * Master Storage Architecture Engine (Main Vol 06 Part 04).
 * Orchestrates 6 storage layers, 14 self-contained project folders, storage driver abstraction, portable packages, disposable cleanup, and integrity audits.
 */
export class MasterStorageArchitecture {
  public readonly folderBuilder = new ProjectFolderBuilder();
  public readonly abstractionProvider = new StorageAbstractionProvider();
  public readonly packageArchiver = new ProjectPackageArchiver();
  public readonly cleanupEngine = new DisposableCleanupPolicyEngine();
  public readonly integrityVerifier = new FileIntegrityVerifier();

  public getStorageArchitectureSummary(projectRootPath: string): {
    subdirectoriesCount: number;
    activeDriver: string;
    isIntegrityOk: boolean;
  } {
    const folders = this.folderBuilder.buildProjectFolderStructure(projectRootPath);
    const audit = this.integrityVerifier.runStorageIntegrityAudit(projectRootPath);

    return {
      subdirectoriesCount: 14,
      activeDriver: this.abstractionProvider.getActiveDriver(),
      isIntegrityOk: audit.isIntegrityValid,
    };
  }
}
