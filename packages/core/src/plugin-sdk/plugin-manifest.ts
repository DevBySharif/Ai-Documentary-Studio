export type PluginType =
  | "AiAgent"
  | "Effect"
  | "Transition"
  | "Export"
  | "Import"
  | "Automation"
  | "WorkflowTemplate"
  | "UiExtension"
  | "Utility";

export type PluginCapability =
  | "ReadProject"
  | "ModifyTimeline"
  | "ReadAssets"
  | "GenerateAiContent"
  | "RenderMedia"
  | "NetworkAccess"
  | "FileSystemAccess";

export interface PermissionDeclaration {
  readonly permission: PluginCapability;
  readonly isRequired: boolean;
  readonly rationale: string;
}

export interface MarketplaceMetadata {
  readonly publisherId: string;
  readonly digitalSignature?: string;
  readonly rating?: number;
  readonly licenseType: "MIT" | "Proprietary" | "Freemium";
}

/**
 * Plugin Manifest (IB Part 22 - Section 4, 6, 8, 9, 23).
 * Validated before loading any third-party plugin.
 */
export interface PluginManifest {
  readonly pluginId: string;
  readonly name: string;
  readonly version: string;
  readonly author: string;
  readonly description: string;
  readonly sdkVersion: string;
  readonly type: PluginType;
  readonly permissions: ReadonlyArray<PermissionDeclaration>;
  readonly declaredCapabilities: ReadonlyArray<PluginCapability>;
  readonly dependencies: ReadonlyArray<string>;
  readonly marketplace?: MarketplaceMetadata;
}
