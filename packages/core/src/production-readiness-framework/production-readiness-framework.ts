import { ReleaseGateSystem } from './release-gate-system';
import { RiskAssessmentEngine } from './risk-assessment-engine';
import { GoLiveSimulation } from './go-live-simulation';
import { PostReleaseVerification } from './post-release-verification';
import { LongTermMaintenancePlan } from './long-term-maintenance-plan';
import { MasterTraceabilityMatrix } from './master-traceability-matrix';
import { ExecutiveReleaseReport } from './executive-release-report';
import { OutputContractBuilder } from './output-contract';

import {
  ArchitectureValidator,
  AIPipelineValidator,
  PerformanceValidator,
  SecurityValidator,
  DatabaseValidator,
  RenderValidator,
  PluginValidator,
  RecoveryValidator,
  DeploymentValidatorProxy,
  DocumentationValidator
} from './domain-validators';

export class ProductionReadinessFramework {
  public readonly gates: ReleaseGateSystem;
  public readonly risk: RiskAssessmentEngine;
  public readonly simulation: GoLiveSimulation;
  public readonly verification: PostReleaseVerification;
  public readonly maintenance: LongTermMaintenancePlan;
  public readonly traceability: MasterTraceabilityMatrix;
  public readonly report: ExecutiveReleaseReport;
  public readonly contractBuilder: OutputContractBuilder;

  // Validators
  public readonly architecture: ArchitectureValidator;
  public readonly aiPipeline: AIPipelineValidator;
  public readonly performance: PerformanceValidator;
  public readonly security: SecurityValidator;
  public readonly database: DatabaseValidator;
  public readonly render: RenderValidator;
  public readonly plugin: PluginValidator;
  public readonly recovery: RecoveryValidator;
  public readonly deployment: DeploymentValidatorProxy;
  public readonly documentation: DocumentationValidator;

  constructor() {
    this.gates = new ReleaseGateSystem();
    this.risk = new RiskAssessmentEngine();
    this.simulation = new GoLiveSimulation();
    this.verification = new PostReleaseVerification();
    this.maintenance = new LongTermMaintenancePlan();
    this.traceability = new MasterTraceabilityMatrix();
    this.report = new ExecutiveReleaseReport();
    this.contractBuilder = new OutputContractBuilder();

    this.architecture = new ArchitectureValidator();
    this.aiPipeline = new AIPipelineValidator();
    this.performance = new PerformanceValidator();
    this.security = new SecurityValidator();
    this.database = new DatabaseValidator();
    this.render = new RenderValidator();
    this.plugin = new PluginValidator();
    this.recovery = new RecoveryValidator();
    this.deployment = new DeploymentValidatorProxy();
    this.documentation = new DocumentationValidator();
  }

  async certifyGoLive(version: string): Promise<boolean> {
    console.log(`\n==========================================`);
    console.log(`[PRODUCTION READINESS] Certifying v${version}`);
    console.log(`==========================================`);

    // 1. Traceability
    if (!this.traceability.verifyCompleteTraceability()) return false;

    // 2. Validate all domains
    const validations = [
      this.architecture.validate(),
      this.aiPipeline.validate(),
      this.performance.validate(),
      this.security.validate(),
      this.database.validate(),
      this.render.validate(),
      this.plugin.validate(),
      this.recovery.validate(),
      this.deployment.validate(),
      this.documentation.validate()
    ];

    if (validations.some(v => !v)) {
      console.error("Domain validation failed.");
      return false;
    }

    // 3. Risk Assessment
    const riskScore = this.risk.evaluateRisk();
    if (riskScore.level === "Critical") {
      console.error("Risk score is Critical. Blocking Go-Live.");
      return false;
    }

    // 4. Simulation
    if (!(await this.simulation.runSimulation(version))) return false;

    // 5. Final Report
    const finalReport = this.report.generateReport(version, riskScore, true, true);
    if (finalReport.recommendation === "GO-LIVE RECOMMENDED") {
      console.log(`[PRODUCTION READINESS] ✅ SUCCESS: v${version} is Production Ready!`);
      return true;
    }

    return false;
  }
}
