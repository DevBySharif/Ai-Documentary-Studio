import { SplitScreenTarget } from "./script-ui-types";

/**
 * Research Reference Linker & Split-Screen Controller (Vol 05 Part 05 - Section 7, Section 8).
 * Links paragraphs to research evidence and controls side-by-side split-screen editing view.
 */
export class ResearchLinkingSplitScreen {
  private activeSplitTarget: SplitScreenTarget = "None";

  public setSplitScreenTarget(target: SplitScreenTarget): void {
    this.activeSplitTarget = target;
  }

  public getActiveSplitTarget(): SplitScreenTarget {
    return this.activeSplitTarget;
  }

  public linkEvidenceToParagraph(sceneId: string, paragraphIndex: number, evidenceId: string): { sceneId: string; paragraphIndex: number; evidenceId: string } {
    return { sceneId, paragraphIndex, evidenceId };
  }
}
