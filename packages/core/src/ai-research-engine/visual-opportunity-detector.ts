export type VisualType =
  | "Map"
  | "ArchivalFootage"
  | "Photograph"
  | "Diagram"
  | "Chart"
  | "Illustration"
  | "RecreatedAnimation";

export interface VisualOpportunity {
  readonly opportunityId: string;
  readonly visualType: VisualType;
  readonly description: string;
  readonly targetScene: string;
  readonly recommendedPrompt: string;
}

/**
 * Visual Opportunity Detector (Vol 04 Part 02 - Section 16).
 * Identifies scenes during research that benefit from visual assets (maps, archival footage, diagrams, etc.).
 */
export class VisualOpportunityDetector {
  public detectVisualOpportunities(topic: string): ReadonlyArray<VisualOpportunity> {
    return [
      {
        opportunityId: "vis_1",
        visualType: "Map",
        description: `Geographical map illustrating locations related to ${topic}`,
        targetScene: "Introduction / Setting",
        recommendedPrompt: `High-resolution historical map of ${topic}`,
      },
      {
        opportunityId: "vis_2",
        visualType: "ArchivalFootage",
        description: `B-roll footage of key events`,
        targetScene: "Main Narrative",
        recommendedPrompt: `Authentic archival footage relevant to ${topic}`,
      },
      {
        opportunityId: "vis_3",
        visualType: "Chart",
        description: `Statistical comparison chart`,
        targetScene: "Analytical Breakdown",
        recommendedPrompt: `Clean infographic chart comparing data for ${topic}`,
      },
    ];
  }
}
