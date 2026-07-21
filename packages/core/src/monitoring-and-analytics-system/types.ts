export interface HardwareMetrics {
  cpuUsagePct: number;
  gpuUsagePct: number;
  ramUsageMB: number;
  diskUsageMB: number;
  diskSpeedMBps: number;
  networkSpeedMBps: number;
  workerUtilizationPct: number;
  renderFps: number;
  cpuTempC?: number;
  gpuTempC?: number;
}

export interface CostData {
  aiCosts: number;
  imageCosts: number;
  voiceCosts: number;
  renderingCosts: number;
  storageCosts: number;
}

export type AlertSeverity = "Info" | "Warning" | "Critical";

export interface Alert {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  message: string;
  source: string; // e.g. 'Hardware', 'Cost', 'Database'
}

export interface ProductionKPIs {
  videosProduced: number;
  averageProductionTimeMs: number;
  averageQaScore: number;
  averageRenderDurationMs: number;
  aiSuccessRatePct: number;
  reuseRatePct: number;
  automationRatePct: number;
}

export interface QualityScore {
  overall: number;
  script: number;
  prompt: number;
  characterConsistency: number;
  motionQuality: number;
  subtitleAccuracy: number;
  audioSync: number;
  renderQuality: number;
  qaCompliance: number;
}

export interface Anomaly {
  id: string;
  timestamp: string;
  category: string;
  description: string;
  confidence: number;
}

export interface DashboardWidget {
  id: string;
  type: string;
  layout: { x: number, y: number, w: number, h: number };
  config: Record<string, any>;
}

export interface OutputContract {
  cpu: number;
  gpu: number;
  jobs: number;
  renderQueue: number;
  alerts: number;
  status: string;
}
