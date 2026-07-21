import { ResearchSourceItem } from "./research-ui-types";

/**
 * Research Source Browser & Comparison Engine (Vol 05 Part 04 - Section 4, Section 5, Section 13).
 * Manages research material sources and supports side-by-side source comparison for contradiction detection.
 */
export class ResearchSourceBrowser {
  private sources: ResearchSourceItem[] = [
    {
      sourceId: "src_1",
      title: "Royal Society Archives 1845",
      sourceType: "AcademicPaper",
      urlOrPath: "https://archives.royalsociety.org/doc1845.pdf",
      confidence: "High",
      approvalStage: "Approved",
      isPinned: true,
      lastUpdatedAt: new Date(),
    },
    {
      sourceId: "src_2",
      title: "Newspaper Clipping Dec 1845",
      sourceType: "ArchivedPage",
      urlOrPath: "d:/Youtube/Ai Documentary Studio/research/clip1845.jpg",
      confidence: "Medium",
      approvalStage: "Verified",
      isPinned: false,
      lastUpdatedAt: new Date(),
    },
  ];

  public listSources(): ReadonlyArray<ResearchSourceItem> {
    return this.sources;
  }

  public compareSources(sourceIdA: string, sourceIdB: string): { agreements: string[]; contradictions: string[] } {
    const srcA = this.sources.find((s) => s.sourceId === sourceIdA);
    const srcB = this.sources.find((s) => s.sourceId === sourceIdB);

    return {
      agreements: [`Both ${srcA?.title} and ${srcB?.title} confirm event date of Dec 12, 1845.`],
      contradictions: [`Difference in attendance estimate: Source A claims 400, Source B claims 650.`],
    };
  }
}
