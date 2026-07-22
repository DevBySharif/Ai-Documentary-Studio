export type PluginLifecycleState =
  | "Discovered"
  | "Installed"
  | "Verified"
  | "DependencyResolved"
  | "Activated"
  | "Running"
  | "Updated"
  | "Disabled"
  | "Uninstalled";

export type InstallationSourceType =
  | "OfficialMarketplace"
  | "OrganizationRepository"
  | "LocalPackage"
  | "DevelopmentWorkspace"
  | "OfflineBundle";

export type DependencyResolutionStrategy =
  | "ExactVersion"
  | "MinimumVersion"
  | "CompatibleVersionRange"
  | "OptionalDependency";

export type ActivationPolicyType =
  | "AtStartup"
  | "OnFirstUse"
  | "OnSpecificEvents"
  | "OnAdministratorRequest"
  | "OnScheduledConditions";

export interface PluginDependencySpec {
  readonly dependencyName: string;
  readonly targetVersion: string;
  readonly strategy: DependencyResolutionStrategy;
}

export interface PluginMigrationDescriptor {
  readonly migrationId: string;
  readonly fromVersion: string;
  readonly toVersion: string;
  readonly dataTransformed: boolean;
  readonly cacheRebuilt: boolean;
}

export interface LifecycleAuditRecord {
  readonly recordId: string;
  readonly pluginId: string;
  readonly version: string;
  readonly previousState: PluginLifecycleState;
  readonly newState: PluginLifecycleState;
  readonly executedBy: string;
  readonly timestamp: Date;
}
