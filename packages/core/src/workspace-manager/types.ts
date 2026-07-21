export type WMProjectStatus = "planning" | "generating" | "rendering" | "qa" | "exported" | "archived";

export type WMTemplateType = "documentary" | "motivation" | "history" | "finance" | "science" | "education" | "storytelling";

export interface WMProjectMeta {
  projectId: string;
  name: string;
  channel: string;
  createdDate: number;
  lastModified: number;
  version: string;
  status: WMProjectStatus;
  tags: string[];
}

export interface WMSnapshot {
  id: string;
  label: string;
  timestamp: number;
  projectVersion: string;
}

export interface WMTemplate {
  type: WMTemplateType;
  name: string;
  channelDNA: string;
  promptRules: Record<string, unknown>;
  motionProfile: string;
  exportProfile: string;
}

export interface WMStorageInfo {
  workspaceSize: number;
  cacheUsage: number;
  exportSize: number;
  assetSize: number;
  archiveSize: number;
}

export interface WMDependencyNode {
  id: string;
  type: string;
  label: string;
  children: string[];
  parents: string[];
}

export interface WMHealthReport {
  corruptedProjects: number;
  missingAssets: number;
  brokenLinks: number;
  diskSpace: number;
  cacheGrowth: number;
  archiveIntegrity: boolean;
  healthy: boolean;
}

export interface WMOutputContract {
  workspace: string;
  projects: number;
  activeProject: string;
  autosave: string;
  status: string;
}
