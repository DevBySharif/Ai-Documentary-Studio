import type { WMProjectMeta, WMTemplateType, WMSnapshot, WMStorageInfo, WMHealthReport, WMOutputContract } from "./types.js";
import { WMWorkspaceHierarchy } from "./workspace-hierarchy.js";
import { WMProjectStructure } from "./project-structure.js";
import { WMMultiProjectSupport } from "./multi-project-support.js";
import { WMProjectTemplates } from "./project-templates.js";
import { WMProjectMetadata } from "./project-metadata.js";
import { WMSmartProjectIndex } from "./smart-project-index.js";
import { WMAutosaveSystem } from "./autosave-system.js";
import { WMSnapshotSystem } from "./snapshot-system.js";
import { WMProjectLocking } from "./project-locking.js";
import { WMRecoverySystem } from "./recovery-system.js";
import { WMProjectDuplication } from "./project-duplication.js";
import { WMProjectArchiving } from "./project-archiving.js";
import { WMStorageManagement } from "./storage-management.js";
import { WMProjectTagging } from "./project-tagging.js";
import { WMSmartAssetDeduplication } from "./asset-deduplication.js";
import { WMProjectDependencyMap } from "./project-dependency-map.js";
import { WMWorkspaceHealthAnalyzer } from "./workspace-health-analyzer.js";
import { WMGlobalSearch } from "./global-search.js";
import { WMOutputContractBuilder } from "./output-contract.js";

export class WMWorkspaceManager {
  readonly hierarchy: WMWorkspaceHierarchy;
  readonly projectStructure: WMProjectStructure;
  readonly multiProject: WMMultiProjectSupport;
  readonly templates: WMProjectTemplates;
  readonly metadata: WMProjectMetadata;
  readonly index: WMSmartProjectIndex;
  readonly autosave: WMAutosaveSystem;
  readonly snapshots: WMSnapshotSystem;
  readonly locking: WMProjectLocking;
  readonly recovery: WMRecoverySystem;
  readonly duplication: WMProjectDuplication;
  readonly archiving: WMProjectArchiving;
  readonly storage: WMStorageManagement;
  readonly tagging: WMProjectTagging;
  readonly dedup: WMSmartAssetDeduplication;
  readonly depMap: WMProjectDependencyMap;
  readonly health: WMWorkspaceHealthAnalyzer;
  readonly search: WMGlobalSearch;
  readonly outputContract: WMOutputContractBuilder;

  constructor() {
    this.hierarchy = new WMWorkspaceHierarchy();
    this.projectStructure = new WMProjectStructure();
    this.multiProject = new WMMultiProjectSupport();
    this.templates = new WMProjectTemplates();
    this.metadata = new WMProjectMetadata();
    this.index = new WMSmartProjectIndex();
    this.autosave = new WMAutosaveSystem();
    this.snapshots = new WMSnapshotSystem();
    this.locking = new WMProjectLocking();
    this.recovery = new WMRecoverySystem();
    this.duplication = new WMProjectDuplication();
    this.archiving = new WMProjectArchiving();
    this.storage = new WMStorageManagement();
    this.tagging = new WMProjectTagging();
    this.dedup = new WMSmartAssetDeduplication();
    this.depMap = new WMProjectDependencyMap();
    this.health = new WMWorkspaceHealthAnalyzer();
    this.search = new WMGlobalSearch();
    this.outputContract = new WMOutputContractBuilder();
  }
}
