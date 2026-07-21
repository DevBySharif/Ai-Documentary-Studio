export type FailureType = 
  | "ApplicationCrash"
  | "GPUDriverCrash"
  | "PowerFailure"
  | "OSCrash"
  | "OutOfMemory"
  | "DiskFailure"
  | "NetworkFailure"
  | "AIProviderFailure"
  | "PluginFailure"
  | "DatabaseCorruption";

export type RecoveryState = "None" | "Detecting" | "Scanning" | "Recovering" | "Successful" | "Partial" | "Failed";

export type ConfidenceScore = "FullyRecovered" | "PartiallyRecovered" | "RequiresVerification" | "Inconsistent";

export interface Snapshot {
  id: string;
  timestamp: string;
  type: "Full" | "Incremental";
  projectId: string;
  data: Record<string, any>;
}

export interface DiagnosticReport {
  id: string;
  timestamp: string;
  failureType: FailureType;
  exceptionDetails: string;
  activeJobs: string[];
  loadedPlugins: string[];
  hardwareSummary: string;
  memoryUsageMB: number;
  stackTrace: string;
  recoveryActions: string[];
}

export interface OutputContract {
  crashDetected: boolean;
  recovery: RecoveryState;
  restoredJobs: number;
  lostAssets: number;
  status: string;
}

export interface IncidentRecord {
  id: string;
  timestamp: string;
  event: string;
  details: string;
  durationMs?: number;
}
