export interface DocumentTab {
  readonly tabId: string;
  readonly title: string;
  readonly moduleType: string;
  readonly documentPath?: string;
  readonly isDirty: boolean;
}

/**
 * Tab-Based Document Manager (Vol 05 Part 01 - Section 13).
 * Manages multiple open project document tabs without leaving the active project.
 */
export class TabDocumentManager {
  private openTabs: DocumentTab[] = [];
  private activeTabId = "";

  public openTab(tabId: string, title: string, moduleType: string, documentPath?: string): DocumentTab {
    const existing = this.openTabs.find((t) => t.tabId === tabId);
    if (existing) {
      this.activeTabId = tabId;
      return existing;
    }

    const newTab: DocumentTab = { tabId, title, moduleType, documentPath, isDirty: false };
    this.openTabs.push(newTab);
    this.activeTabId = tabId;
    return newTab;
  }

  public closeTab(tabId: string): void {
    this.openTabs = this.openTabs.filter((t) => t.tabId !== tabId);
    if (this.activeTabId === tabId) {
      this.activeTabId = this.openTabs[this.openTabs.length - 1]?.tabId || "";
    }
  }

  public getActiveTab(): DocumentTab | undefined {
    return this.openTabs.find((t) => t.tabId === this.activeTabId);
  }

  public getOpenTabs(): ReadonlyArray<DocumentTab> {
    return this.openTabs;
  }
}
