import { StructuralValidatorConsistencyChecker } from "./structural-validator-consistency-checker";
import { FactualVerifierCrossEvaluator } from "./factual-verifier-cross-evaluator";
import { AiSelfReflectionEngine } from "./ai-self-reflection-engine";
import { QualityScoringDecisionEngine } from "./quality-scoring-decision-engine";
import { EvaluationTargetCategory, EvaluationHistoryRecord } from "./evaluation-types";

/**
 * Master AI Quality Evaluation Engine (Main Vol 07 Part 06).
 * Core entry point for 6-stage AI quality evaluation: `AI Output → Structural Validation → Quality Evaluation → Consistency Check → Self Reflection → Decision Engine → Action`.
 */
export class MasterAiQualityEvaluation {
  public readonly structuralValidator = new StructuralValidatorConsistencyChecker();
  public readonly factualVerifier = new FactualVerifierCrossEvaluator();
  public readonly selfReflectionEngine = new AiSelfReflectionEngine();
  public readonly decisionEngine = new QualityScoringDecisionEngine();

  private history: EvaluationHistoryRecord[] = [];

  public evaluateAiOutput(
    targetCategory: EvaluationTargetCategory,
    targetAssetId: string,
    objectivePrompt: string,
    outputText: string,
    referenceKnowledgeText = "",
    isSensitiveTopic = false
  ): EvaluationHistoryRecord {
    // 1. Structural Validation
    const structReport = this.structuralValidator.validateStructure(targetCategory, outputText);

    // 2. Factual Validation & Consistency Check
    const factualReport = this.factualVerifier.verifyFactualClaims(outputText, referenceKnowledgeText);
    this.structuralValidator.checkConsistency(outputText, referenceKnowledgeText);

    // 3. Self Reflection
    const selfReflection = this.selfReflectionEngine.performSelfReflection(objectivePrompt, outputText);

    // 4. Quality Scoring & Decision Engine
    const scoreCard = this.decisionEngine.computeQualityScore(
      structReport,
      factualReport.factualConfidenceScore,
      selfReflection
    );
    const decision = this.decisionEngine.evaluateDecision(scoreCard, isSensitiveTopic);

    const record: EvaluationHistoryRecord = {
      evaluationId: `eval_${Math.random().toString(36).substring(2, 7)}`,
      targetCategory,
      targetAssetId,
      scores: scoreCard,
      decision,
      evaluator: "MasterQualityEvaluator_v1",
      selfReflection,
      timestamp: new Date(),
    };

    this.history.push(record);
    return record;
  }

  public getEvaluationHistory(targetAssetId: string): ReadonlyArray<EvaluationHistoryRecord> {
    return this.history.filter((h) => h.targetAssetId === targetAssetId);
  }
}
