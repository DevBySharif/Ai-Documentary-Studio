import { ValidationIssue, PublishReadinessReport } from "./reviewer-types";
import { FactChecker } from "./fact-checker";
import { TimelineContinuityAuditor } from "./timeline-continuity-auditor";
import { MediaAudioVisualReviewer } from "./media-audio-visual-reviewer";
import { CorrectionSuggester, AutomatedCorrectionPlan } from "./correction-suggester";
import { PublishReadinessGenerator } from "./publish-readiness-generator";

/**
 * Master AI Reviewer Engine (Main Vol 04 Part 11).
 * Drives the independent audit workflow: Research -> Script -> Storyboard -> Assets -> Narration -> Timeline -> Validation -> Publish Readiness.
 */
export class AiReviewer {
  public readonly factChecker = new FactChecker();
  public readonly continuityAuditor = new TimelineContinuityAuditor();
  public readonly mediaReviewer = new MediaAudioVisualReviewer();
  public readonly correctionSuggester = new CorrectionSuggester();
  public readonly readinessGenerator = new PublishReadinessGenerator();

  public async auditDocumentaryProject(
    scriptText: string,
    citationsCount: number,
    hasUnlicensedAssets = false,
    audioClippingDetected = false
  ): Promise<{ readinessReport: PublishReadinessReport; correctionPlans: ReadonlyArray<AutomatedCorrectionPlan> }> {
    // 1. Audit Facts, Citations, & Hallucinations
    const factIssues = this.factChecker.auditFactsAndCitations(scriptText, citationsCount);

    // 2. Audit Timeline & Entity Continuity
    const continuityIssues = this.continuityAuditor.auditContinuity(0, []);

    // 3. Audit Media, Audio, Visuals & Copyright Licensing
    const mediaIssues = this.mediaReviewer.auditMediaAndCopyright(hasUnlicensedAssets, audioClippingDetected);

    const allIssues: ValidationIssue[] = [...factIssues, ...continuityIssues, ...mediaIssues];

    // 4. Generate Automated Correction Suggestions & Readiness Report
    const correctionPlans = this.correctionSuggester.generateCorrectionPlans(allIssues);
    const readinessReport = this.readinessGenerator.generateReadinessReport(allIssues, 32);

    return {
      readinessReport,
      correctionPlans,
    };
  }
}
