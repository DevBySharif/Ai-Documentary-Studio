export type PLPluginCategory =
  | 'ai_provider'
  | 'image_provider'
  | 'voice_provider'
  | 'motion_engine'
  | 'effects_pack'
  | 'subtitle_engine'
  | 'export_target'
  | 'analytics'
  | 'qa'
  | 'workflow_automation'
  | 'ui_extension'
  | 'future';

export type PLPluginStatus =
  | 'installed'
  | 'validated'
  | 'loaded'
  | 'initialized'
  | 'running'
  | 'disabled'
  | 'unloaded'
  | 'removed';

export type PLPermission =
  | 'read_project'
  | 'write_assets'
  | 'generate_images'
  | 'export_video'
  | 'internet_access'
  | 'gpu_access';

export interface PLPluginDependency {
  pluginId: string;
  version: string;
  optional: boolean;
}

export interface PLPluginManifest {
  pluginId: string;
  name: string;
  version: string;
  author: string;
  description: string;
  category: PLPluginCategory;
  apiVersion: string;
  minAppVersion: string;
  dependencies: PLPluginDependency[];
  permissions: PLPermission[];
}

export type PLPluginEventType =
  | 'project_opened'
  | 'script_generated'
  | 'image_approved'
  | 'voice_generated'
  | 'render_started'
  | 'export_completed';

export interface PLOutputContract {
  plugin: string;
  version: string;
  status: PLPluginStatus;
  permissions: PLPermission[];
}
