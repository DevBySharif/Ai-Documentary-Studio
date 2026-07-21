export type DASystemLayer = "presentation" | "application" | "production" | "rendering" | "infrastructure";

export type DAErrorCategory = "validation" | "provider" | "rendering" | "storage" | "network" | "plugin";

export type DALogLevel = "debug" | "info" | "warning" | "error" | "critical";

export interface DAAppConfig {
  systemDefaults: Record<string, unknown>;
  userSettings: Record<string, unknown>;
  workspaceSettings: Record<string, unknown>;
  projectOverrides: Record<string, unknown>;
}

export interface DAError {
  code: string;
  category: DAErrorCategory;
  severity: DALogLevel;
  message: string;
  recoverySuggestion: string;
  diagnosticDetails: Record<string, unknown>;
}

export interface DALogEntry {
  timestamp: number;
  level: DALogLevel;
  category: string;
  message: string;
  data?: Record<string, unknown>;
}

export interface DAServiceRegistration {
  name: string;
  version: string;
  dependencies: string[];
  lazy: boolean;
}

export interface DAFeatureFlag {
  key: string;
  enabled: boolean;
  description: string;
}

export interface DAHealthStatus {
  memoryUsage: number;
  cpuUsage: number;
  gpuUsage: number;
  activeJobs: number;
  databaseHealth: boolean;
  pluginStatus: string;
  overall: string;
}

export interface DAOutputContract {
  application: string;
  database: string;
  providers: string;
  plugins: string;
  workspace: string;
  status: string;
}
