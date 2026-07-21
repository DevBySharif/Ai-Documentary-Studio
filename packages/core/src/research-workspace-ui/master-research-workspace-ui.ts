import { ResearchSourceBrowser } from "./research-source-browser";
import { ResearchNotebookManager } from "./research-notebook-manager";
import { KnowledgeGraphExplorer } from "./knowledge-graph-explorer";
import { EvidenceTrackerEngine } from "./evidence-tracker-engine";
import { ResearchApprovalWorkflow } from "./research-approval-workflow";

export interface AiResearchSummaryState {
  readonly newFindingsCount: number;
  readonly conflictingEvidenceCount: number;
  readonly missingInfoPrompts: ReadonlyArray<string>;
}

/**
 * Master Research Workspace UI Engine (Main Vol 05 Part 04).
 * Orchestrates the 4-panel research layout: Sources Sidebar -> Knowledge Explorer -> Evidence/Notes Inspector -> Discovery Timeline.
 */
export class MasterResearchWorkspaceUI {
  public readonly sourceBrowser = new ResearchSourceBrowser();
  public readonly notebook = new ResearchNotebookManager();
  public readonly knowledgeGraph = new KnowledgeGraphExplorer();
  public readonly evidenceTracker = new EvidenceTrackerEngine();
  public readonly approvalWorkflow = new ResearchApprovalWorkflow();

  public getAiSummaryPanel(): AiResearchSummaryState {
    return {
      newFindingsCount: 4,
      conflictingEvidenceCount: 1,
      missingInfoPrompts: ["Verify exact construction start date for Box Tunnel east portal."],
    };
  }

  public searchInsideResearch(query: string): ReadonlyArray<{ title: string; snippet: string }> {
    if (!query.trim()) return [];
    return [
      {
        title: "Box Tunnel Construction Evidence",
        snippet: `...found match for '${query}' in verified evidence claim...`,
      },
    ];
  }
}
