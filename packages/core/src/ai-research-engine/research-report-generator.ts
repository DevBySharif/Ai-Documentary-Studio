import { ExtractedFact, DetectedEntity } from "./research-types";
import { ResearchTimelineEntry } from "./timeline-generator";
import { ContradictingClaim } from "./conflict-analyzer";
import { VisualOpportunity } from "./visual-opportunity-detector";

export interface ResearchReport {
  readonly reportId: string;
  readonly topic: string;
  readonly executiveSummary: string;
  readonly background: string;
  readonly keyFindings: ReadonlyArray<string>;
  readonly timeline: ReadonlyArray<ResearchTimelineEntry>;
  readonly majorEntities: ReadonlyArray<DetectedEntity>;
  readonly conflicts: ReadonlyArray<ContradictingClaim>;
  readonly openQuestions: ReadonlyArray<string>;
  readonly visualOpportunities: ReadonlyArray<VisualOpportunity>;
  readonly suggestedNarrativeAngles: ReadonlyArray<string>;
  readonly generatedAt: Date;
}

/**
 * Knowledge Synthesis & Research Report Generator (Vol 04 Part 02 - Section 13, Section 15, Section 18).
 * Synthesizes research into documentary-ready reports fed to downstream AI systems (Script Writer, Storyboard, etc.).
 */
export class ResearchReportGenerator {
  public generateReport(
    topic: string,
    facts: ReadonlyArray<ExtractedFact>,
    entities: ReadonlyArray<DetectedEntity>,
    timeline: ReadonlyArray<ResearchTimelineEntry>,
    conflicts: ReadonlyArray<ContradictingClaim>,
    visualOpportunities: ReadonlyArray<VisualOpportunity>
  ): ResearchReport {
    return {
      reportId: `rpt_${Math.random().toString(36).substring(2, 9)}`,
      topic,
      executiveSummary: `Comprehensive research report on ${topic} synthesizing key historical facts, timelines, and visual opportunities.`,
      background: `Historical context and background analysis for ${topic}.`,
      keyFindings: facts.map((f) => f.statement),
      timeline,
      majorEntities: entities,
      conflicts,
      openQuestions: ["What influenced the pivotal decision?", "Are there secondary archival sources available?"],
      visualOpportunities,
      suggestedNarrativeAngles: [
        `Chronological Deep Dive into ${topic}`,
        `Human Impact & Personal Testimonies of ${topic}`,
        `Analytical Breakdown & Lasting Legacy`,
      ],
      generatedAt: new Date(),
    };
  }
}
