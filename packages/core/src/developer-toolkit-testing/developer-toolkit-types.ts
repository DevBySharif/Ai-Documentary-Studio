export type ProjectTemplateType =
  | "StandardPlugin"
  | "AiModule"
  | "WorkflowExtension"
  | "UiExtension"
  | "Connector"
  | "AutomationPackage";

export type TestingCategoryType =
  | "UnitTests"
  | "IntegrationTests"
  | "SdkCompatibilityTests"
  | "WorkflowTests"
  | "PerformanceTests";

export type MockServiceType =
  | "Authentication"
  | "Workspace"
  | "AiProviders"
  | "EventBus"
  | "Storage"
  | "Notifications";

export type SdkCliCommandType =
  | "CreateExtension"
  | "BuildPackage"
  | "ValidateManifest"
  | "RunTests"
  | "StartLocalRuntime"
  | "PublishPackage"
  | "UpgradeSdk";

export interface ExtensionTestResult {
  readonly testId: string;
  readonly category: TestingCategoryType;
  readonly totalTests: number;
  readonly passedTests: number;
  readonly failedTests: number;
  readonly isAllPassed: boolean;
  readonly executedAt: Date;
}

export interface DevDiagnosticReport {
  readonly reportId: string;
  readonly deprecationWarnings: ReadonlyArray<string>;
  readonly memoryUsageMB: number;
  readonly executionTimeMs: number;
  readonly isManifestValid: boolean;
}
