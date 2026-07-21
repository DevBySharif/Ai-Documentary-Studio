import { ResearchMode, ExtractedFact, DetectedEntity, CredibilityProfile } from "./research-types";
import { TimelineGenerator } from "./timeline-generator";
import { ConflictAnalyzer } from "./conflict-analyzer";
import { VisualOpportunityDetector } from "./visual-opportunity-detector";
import { ResearchNotebook } from "./research-notebook";
import { ResearchReportGenerator, ResearchReport } from "./research-report-generator";

export type ResearchStage =
  | "Request"
  | "Planning"
  | "SourceDiscovery"
  | "EvidenceCollection"
  | "FactExtraction"
  | "Verification"
  | "KnowledgeOrganization"
  | "ResearchReport";

/**
 * Master AI Research Engine (Main Vol 04 Part 02).
 * Drives the 8-stage research workflow (`Request -> Planning -> Discovery -> Evidence -> Extraction -> Verification -> Organization -> Report`).
 */
export class AiResearchEngine {
  public readonly timelineGenerator = new TimelineGenerator();
  public readonly conflictAnalyzer = new ConflictAnalyzer();
  public readonly visualDetector = new VisualOpportunityDetector();
  public readonly notebook = new ResearchNotebook();
  public readonly reportGenerator = new ResearchReportGenerator();

  public async executeResearch(
    topic: string,
    mode: ResearchMode = "Standard"
  ): Promise<ResearchReport> {
    // 1. Evidence & Fact Extraction Simulation
    const sampleFacts: ExtractedFact[] = [
      { factId: "f1", statement: "Key event occurred in 1945.", category: "Date", confidence: 0.95, isPinned: true },
      { factId: "f2", statement: "Historical summit convened in Geneva.", category: "Location", confidence: 0.92, isPinned: false },
      { factId: "f3", statement: "Primary treaty signed with 50 signatory states.", category: "Statistic", confidence: 0.88, isPinned: false },
    ];

    const sampleEntities: DetectedEntity[] = [
      { entityId: "e1", name: topic, type: "DocumentaryTopic" as any, description: "Primary subject of study" },
      { entityId: "e2", name: "Geneva", type: "City", description: "Host location" },
    ];

    // 2. Build Timeline & Analyze Conflicts
    const timeline = this.timelineGenerator.generateTimeline(sampleFacts);
    const conflicts = this.conflictAnalyzer.analyzeConflicts(sampleFacts);
    const visualOps = this.visualDetector.detectVisualOpportunities(topic);

    // 3. Store in Notebook
    sampleFacts.forEach((f) => this.notebook.addEntry("Fact", f.category, f.statement, f.isPinned));

    // 4. Synthesize Final Report
    return this.reportGenerator.generateReport(
      topic,
      sampleFacts,
      sampleEntities,
      timeline,
      conflicts,
      visualOps
    );
  }
}
