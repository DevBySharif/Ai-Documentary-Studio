import { CrashDetector } from './crash-detector';
import { AutosaveEngine } from './autosave-engine';
import { DatabaseRecovery } from './database-recovery';
import { SafeMode } from './safe-mode';
import { RecoveryManager } from './recovery-manager';
import { ContinuousSnapshotEngine } from './continuous-snapshot-engine';
import { GPURecoveryManager } from './gpu-recovery-manager';
import { RecoveryConfidenceAnalyzer } from './recovery-confidence-analyzer';
import { ProjectHealthScanner } from './project-health-scanner';
import { AutomaticIncidentLog } from './automatic-incident-log';
import { RecoveryTestMode } from './recovery-test-mode';
import { ResilientSessionManager } from './resilient-session-manager';
import { OutputContractBuilder } from './output-contract';

export class CrashRecoverySystem {
  public readonly crashDetector: CrashDetector;
  public readonly autosaveEngine: AutosaveEngine;
  public readonly databaseRecovery: DatabaseRecovery;
  public readonly safeMode: SafeMode;
  public readonly recoveryManager: RecoveryManager;
  
  public readonly snapshotEngine: ContinuousSnapshotEngine;
  public readonly gpuRecovery: GPURecoveryManager;
  public readonly confidenceAnalyzer: RecoveryConfidenceAnalyzer;
  public readonly healthScanner: ProjectHealthScanner;
  public readonly incidentLog: AutomaticIncidentLog;
  public readonly testMode: RecoveryTestMode;
  public readonly sessionManager: ResilientSessionManager;
  public readonly contractBuilder: OutputContractBuilder;

  constructor() {
    this.crashDetector = new CrashDetector();
    this.autosaveEngine = new AutosaveEngine();
    this.databaseRecovery = new DatabaseRecovery();
    this.safeMode = new SafeMode();
    
    this.recoveryManager = new RecoveryManager(
      this.crashDetector,
      this.autosaveEngine,
      this.databaseRecovery,
      this.safeMode
    );

    this.snapshotEngine = new ContinuousSnapshotEngine();
    this.gpuRecovery = new GPURecoveryManager();
    this.confidenceAnalyzer = new RecoveryConfidenceAnalyzer();
    this.healthScanner = new ProjectHealthScanner();
    this.incidentLog = new AutomaticIncidentLog();
    this.testMode = new RecoveryTestMode(this.crashDetector);
    this.sessionManager = new ResilientSessionManager();
    this.contractBuilder = new OutputContractBuilder();
  }

  async start(): Promise<void> {
    this.crashDetector.registerHandlers();
    await this.recoveryManager.onStartup();
    // After recovery, attempt to restore session UI
    this.sessionManager.restoreSession();
  }
}
