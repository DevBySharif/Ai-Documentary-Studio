export type ExtensionCategoryType =
  | "AiExtensions"
  | "WorkflowExtensions"
  | "UiExtensions"
  | "IntegrationExtensions"
  | "AnalyticsExtensions";

export type ExtensionPointType =
  | "ProjectCreation"
  | "ScriptGeneration"
  | "AiExecution"
  | "RenderingPipeline"
  | "TimelineEditing"
  | "ExportProcess"
  | "ReviewWorkflow";

export type SdkCompatibilityLevel = "Supported" | "Deprecated" | "Experimental" | "Unsupported";

export type PluginActivationStage =
  | "Discovery"
  | "Validation"
  | "DependencyCheck"
  | "PermissionReview"
  | "Initialization"
  | "Active";

export interface PluginManifestDescriptor {
  readonly pluginId: string;
  readonly name: string;
  readonly version: string;
  readonly author: string;
  readonly requiredSdkVersion: string;
  readonly category: ExtensionCategoryType;
  readonly extensionPoints: ReadonlyArray<ExtensionPointType>;
  readonly permissions: ReadonlyArray<string>;
  readonly dependencies: ReadonlyArray<string>;
}

export interface PluginRegistrationDescriptor {
  readonly manifest: PluginManifestDescriptor;
  readonly activationStage: PluginActivationStage;
  readonly isLoaded: boolean;
  readonly registeredAt: Date;
}
