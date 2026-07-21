import { ProjectWizardBuilder } from "./project-wizard-builder";
import { ProjectVersioningBranches } from "./project-versioning-branches";
import { BackupArchiveSystem } from "./backup-archive-system";
import { CrashRecoveryEngine } from "./crash-recovery-engine";
import { ProjectPackageImporterExporter } from "./project-package-importer-exporter";
import { ProjectMetadata, ProjectLifecycleStage } from "./project-types";

/**
 * Master Project Workspace Manager Engine (Main Vol 05 Part 03).
 * Orchestrates the full 12-stage project lifecycle (`Idea → Published → Archived`).
 */
export class MasterProjectWorkspaceManager {
  public readonly wizard = new ProjectWizardBuilder();
  public readonly versioning = new ProjectVersioningBranches();
  public readonly backupArchive = new BackupArchiveSystem();
  public readonly crashRecovery = new CrashRecoveryEngine();
  public readonly packageImporterExporter = new ProjectPackageImporterExporter();

  public updateProjectStage(metadata: ProjectMetadata, newStage: ProjectLifecycleStage): ProjectMetadata {
    return {
      ...metadata,
      currentStage: newStage,
      lastModified: new Date(),
    };
  }
}
