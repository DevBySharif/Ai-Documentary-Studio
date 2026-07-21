export class DeploymentDashboard {
  getDashboardData(): any {
    return {
      currentStableRelease: "v4.1.0",
      activeEnvironments: ["Local", "CI", "Staging", "Production"],
      lastRollback: null,
      failedDeployments: 0,
      releaseApprovalStatus: "Approved"
    };
  }
}
