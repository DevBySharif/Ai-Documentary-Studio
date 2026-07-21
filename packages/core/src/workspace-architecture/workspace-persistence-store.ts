import { WorkspaceSessionState, CoreModuleId } from "./workspace-types";

/**
 * Workspace Persistence Store (Vol 05 Part 01 - Section 18).
 * Preserves open tabs, scroll positions, panel layout, zoom levels, selected assets, and playhead position across sessions.
 */
export class WorkspacePersistenceStore {
  private savedState: WorkspaceSessionState = {
    projectId: "proj_default_2026",
    activeModule: "Dashboard",
    openTabDocumentIds: ["doc_script_1", "doc_timeline_1"],
    activeTabDocumentId: "doc_script_1",
    activeLayoutPresetId: "default_nle_layout",
    playheadFramePosition: 120,
    zoomLevel: 1.0,
    lastSavedAt: new Date(),
  };

  public saveState(partialState: Partial<WorkspaceSessionState>): void {
    this.savedState = {
      ...this.savedState,
      ...partialState,
      lastSavedAt: new Date(),
    };
  }

  public loadState(): Readonly<WorkspaceSessionState> {
    return this.savedState;
  }
}
