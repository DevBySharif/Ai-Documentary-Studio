import type { DAOutputContract } from "./types.js";

export class DAOutputContractBuilder {
  build(appReady: boolean, dbConnected: boolean, providersLoaded: boolean, pluginsInit: boolean, workspaceAvail: boolean): DAOutputContract {
    return {
      application: appReady ? "Ready" : "Starting",
      database: dbConnected ? "Connected" : "Disconnected",
      providers: providersLoaded ? "Loaded" : "Pending",
      plugins: pluginsInit ? "Initialized" : "Failed",
      workspace: workspaceAvail ? "Available" : "Unavailable",
      status: appReady && dbConnected && providersLoaded && pluginsInit && workspaceAvail ? "Operational" : "Degraded"
    };
  }

  isOperational(contract: DAOutputContract): boolean {
    return contract.status === "Operational";
  }

  summary(contract: DAOutputContract): string {
    return `App: ${contract.application} | DB: ${contract.database} | Providers: ${contract.providers} | Plugins: ${contract.plugins} | Workspace: ${contract.workspace} | Status: ${contract.status}`;
  }
}
