import { z } from 'zod';

export const PermissionSchema = z.enum([
  'ReadWorkspace',
  'WriteWorkspace',
  'ReadAssets',
  'GenerateAIRequests',
  'RegisterCommands',
  'RegisterUIPanels',
  'ReadTimeline',
  'ExportMedia',
  'NetworkAccess',
  'LocalStorage'
]);

export type Permission = z.infer<typeof PermissionSchema>;

export const CapabilitySchema = z.enum([
  'AIProvider',
  'ExportFormat',
  'MotionPreset',
  'TimelineTool',
  'AssetProcessor',
  'ChannelDNAPackage',
  'Theme',
  'AnalyticsProvider',
  'AutomationWorkflow'
]);

export type Capability = z.infer<typeof CapabilitySchema>;

export const PluginManifestSchema = z.object({
  pluginId: z.string().regex(/^[a-z0-9.-]+$/),
  name: z.string(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/), // SemVer basic
  author: z.string(),
  description: z.string(),
  license: z.string(),
  requiredSDKVersion: z.string(),
  declaredCapabilities: z.array(CapabilitySchema),
  permissions: z.array(PermissionSchema),
  dependencies: z.record(z.string()).optional() // e.g. { "plugin.other": "^1.0.0" }
});

export type PluginManifest = z.infer<typeof PluginManifestSchema>;

export const PluginStatusSchema = z.enum([
  'Discovered',
  'Validated',
  'Installed',
  'Active',
  'Suspended',
  'Failed',
  'Removed'
]);

export type PluginStatus = z.infer<typeof PluginStatusSchema>;
