import { ModuleRegistry } from "./module-registry";
import { LayoutDockingEngine } from "./layout-docking-engine";
import { TabDocumentManager } from "./tab-document-manager";
import { AiPresenceController } from "./ai-presence-controller";
import { WorkspacePersistenceStore } from "./workspace-persistence-store";

/**
 * Master Workspace Architecture Engine (Main Vol 05 Part 01).
 * Unifies application hierarchy (App -> Workspace -> Project -> Modules -> Editors -> Panels -> Tools),
 * multi-panel layout docking, tabbed document workflows, persistent navigation, and session state preservation.
 */
export class WorkspaceArchitectureEngine {
  public readonly moduleRegistry = new ModuleRegistry();
  public readonly layoutDocking = new LayoutDockingEngine();
  public readonly tabManager = new TabDocumentManager();
  public readonly aiPresence = new AiPresenceController();
  public readonly persistenceStore = new WorkspacePersistenceStore();

  public async restoreSession(): Promise<{ activeModule: string; openTabsCount: number }> {
    const state = this.persistenceStore.loadState();
    state.openTabDocumentIds.forEach((id) => {
      this.tabManager.openTab(id, `Document ${id}`, "Editor");
    });

    return {
      activeModule: state.activeModule,
      openTabsCount: this.tabManager.getOpenTabs().length,
    };
  }
}
