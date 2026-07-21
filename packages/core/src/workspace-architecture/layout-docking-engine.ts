import { PanelRegion, PanelConfig, WorkspaceLayoutPreset } from "./workspace-types";

/**
 * Layout Docking & Multi-Monitor Engine (Vol 05 Part 01 - Section 8, Section 11, Section 12, Section 14, Section 15).
 * Controls 5-region panel docking, panel visibility, resizing, and multi-monitor window detachment.
 */
export class LayoutDockingEngine {
  private activeLayout: WorkspaceLayoutPreset = {
    layoutId: "default_nle_layout",
    name: "Default NLE Editing Layout",
    isMultiMonitorEnabled: false,
    panels: [
      { region: "TopToolbar", isVisible: true, heightPx: 48 },
      { region: "LeftNavigation", isVisible: true, widthPx: 220 },
      { region: "CentralWorkspace", isVisible: true },
      { region: "RightInspector", isVisible: true, widthPx: 320 },
      { region: "BottomPanel", isVisible: true, heightPx: 260 },
    ],
  };

  public getLayout(): WorkspaceLayoutPreset {
    return this.activeLayout;
  }

  public togglePanelVisibility(region: PanelRegion): void {
    const updated = this.activeLayout.panels.map((p) =>
      p.region === region ? { ...p, isVisible: !p.isVisible } : p
    );
    this.activeLayout = { ...this.activeLayout, panels: updated };
  }

  public detachPanelToWindow(region: PanelRegion): void {
    const updated = this.activeLayout.panels.map((p) =>
      p.region === region ? { ...p, isDetached: true } : p
    );
    this.activeLayout = { ...this.activeLayout, isMultiMonitorEnabled: true, panels: updated };
  }
}
