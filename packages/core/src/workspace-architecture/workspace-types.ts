export type CoreModuleId =
  | "Dashboard"
  | "Projects"
  | "Research"
  | "Script"
  | "Storyboard"
  | "Assets"
  | "PromptStudio"
  | "ImageGeneration"
  | "Voice"
  | "Timeline"
  | "Review"
  | "Export";

export type PanelRegion =
  | "TopToolbar"
  | "LeftNavigation"
  | "CentralWorkspace"
  | "RightInspector"
  | "BottomPanel";

export interface PanelConfig {
  readonly region: PanelRegion;
  readonly isVisible: boolean;
  readonly widthPx?: number;
  readonly heightPx?: number;
  readonly isDetached?: boolean; // Multi-monitor detached support
}

export interface WorkspaceLayoutPreset {
  readonly layoutId: string;
  readonly name: string;
  readonly panels: ReadonlyArray<PanelConfig>;
  readonly isMultiMonitorEnabled: boolean;
}

export interface WorkspaceSessionState {
  readonly projectId: string;
  readonly activeModule: CoreModuleId;
  readonly openTabDocumentIds: ReadonlyArray<string>;
  readonly activeTabDocumentId: string;
  readonly activeLayoutPresetId: string;
  readonly playheadFramePosition: number;
  readonly zoomLevel: number;
  readonly lastSavedAt: Date;
}
