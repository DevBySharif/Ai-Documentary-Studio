import type { PDDecisionRequest, PDDecisionResult, PDProductionState, PDOutputContract, PDValidationResult, PDChannelDNAEnforcementResult, PDContinuityCheck, PDExplanation, PDEngineType, PDProjectStage, PDUIInteraction } from "./types.js";
import { PDMasterDecisionEngine } from "./master-decision-engine.js";
import { PDPipelineOrchestration } from "./pipline-orchestration.js";
import { PDChannelDNAEnforcement } from "./channel-dna-enforcement.js";
import { PDSceneApprovalSystem } from "./scene-approval-system.js";
import { PDRegenerationManager } from "./regeneration-manager.js";
import { PDContinuityManager } from "./continuity-manager.js";
import { PDPriorityManager } from "./priority-manager.js";
import { PDFailureRecovery } from "./failure-recovery.js";
import { PDResourceManager } from "./resource-manager.js";
import { PDTaskScheduler } from "./task-scheduler.js";
import { PDProjectStateMachine } from "./project-state-machine.js";
import { PDUserInteraction } from "./user-interaction.js";
import { PDZennDirectorProfile } from "./zenn-director-profile.js";
import { PDProductionMemory } from "./production-memory.js";
import { PDIntelligentRegenerationGraph } from "./intelligent-regeneration-graph.js";
import { PDAIDecisionExplainer } from "./ai-decision-explainer.js";
import { PDPluginOrchestrationLayer } from "./plugin-orchestration-layer.js";
import { PDFutureAutonomousMode } from "./future-autonomous-mode.js";
import { PDProductionValidator } from "./validator.js";
import { PDOutputContractBuilder } from "./output-contract.js";

export class PDProductionDirectorAI {
  readonly decisionEngine: PDMasterDecisionEngine;
  readonly pipeline: PDPipelineOrchestration;
  readonly dnaEnforcement: PDChannelDNAEnforcement;
  readonly sceneApproval: PDSceneApprovalSystem;
  readonly regeneration: PDRegenerationManager;
  readonly continuity: PDContinuityManager;
  readonly priority: PDPriorityManager;
  readonly failureRecovery: PDFailureRecovery;
  readonly resources: PDResourceManager;
  readonly taskScheduler: PDTaskScheduler;
  readonly stateMachine: PDProjectStateMachine;
  readonly userInteraction: PDUserInteraction;
  readonly zennProfile: PDZennDirectorProfile;
  readonly memory: PDProductionMemory;
  readonly regenGraph: PDIntelligentRegenerationGraph;
  readonly explainer: PDAIDecisionExplainer;
  readonly plugins: PDPluginOrchestrationLayer;
  readonly autonomous: PDFutureAutonomousMode;
  readonly validator: PDProductionValidator;
  readonly outputContract: PDOutputContractBuilder;

  constructor() {
    this.decisionEngine = new PDMasterDecisionEngine();
    this.pipeline = new PDPipelineOrchestration();
    this.dnaEnforcement = new PDChannelDNAEnforcement();
    this.sceneApproval = new PDSceneApprovalSystem();
    this.regeneration = new PDRegenerationManager();
    this.continuity = new PDContinuityManager();
    this.priority = new PDPriorityManager();
    this.failureRecovery = new PDFailureRecovery();
    this.resources = new PDResourceManager();
    this.taskScheduler = new PDTaskScheduler();
    this.stateMachine = new PDProjectStateMachine();
    this.userInteraction = new PDUserInteraction();
    this.zennProfile = new PDZennDirectorProfile();
    this.memory = new PDProductionMemory();
    this.regenGraph = new PDIntelligentRegenerationGraph();
    this.explainer = new PDAIDecisionExplainer();
    this.plugins = new PDPluginOrchestrationLayer();
    this.autonomous = new PDFutureAutonomousMode();
    this.validator = new PDProductionValidator();
    this.outputContract = new PDOutputContractBuilder();
  }

  applyZennDefaults(): void {
    const profile = this.zennProfile.getProfile();
  }

  processDecision(request: PDDecisionRequest): PDDecisionResult {
    return this.decisionEngine.evaluate(request);
  }

  getFullState(): { state: PDProductionState; contract: PDOutputContract } {
    const state = this.stateMachine.getState();
    const contract = this.outputContract.build(state.stage === "published", this.sceneApproval.getApprovedCount(), true, true);
    return { state, contract };
  }
}
