import type { WMOutputContract } from "./types.js";

export class WMOutputContractBuilder {
  build(workspaceLoaded: boolean, projectCount: number, activeProject: string, autosaveEnabled: boolean, healthy: boolean): WMOutputContract {
    return {
      workspace: workspaceLoaded ? "Loaded" : "Unavailable",
      projects: projectCount,
      activeProject,
      autosave: autosaveEnabled ? "Enabled" : "Disabled",
      status: healthy ? "Healthy" : "Needs Attention"
    };
  }

  isHealthy(contract: WMOutputContract): boolean {
    return contract.status === "Healthy";
  }

  summary(contract: WMOutputContract): string {
    return `Workspace: ${contract.workspace} | Projects: ${contract.projects} | Active: ${contract.activeProject} | Autosave: ${contract.autosave} | Status: ${contract.status}`;
  }
}
