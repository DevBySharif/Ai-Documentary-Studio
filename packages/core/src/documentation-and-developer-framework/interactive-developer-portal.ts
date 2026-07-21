export class InteractiveDeveloperPortal {
  getPortalDashboardData(): any {
    return {
      apiExplorerUrl: "/dev/api",
      pluginSandboxUrl: "/dev/plugins",
      architectureBrowserUrl: "/dev/architecture",
      status: "Online"
    };
  }

  serveLiveDocs(): void {
    console.log("Serving Live Interactive Docs at localhost:3000/dev/docs");
  }
}
