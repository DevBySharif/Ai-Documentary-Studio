import { EnvironmentManager } from './environment-manager';
import { CIPipeline } from './ci-pipeline';
import { CDPipeline } from './cd-pipeline';
import { CodeSigning } from './code-signing';
import { PackagingSystem } from './packaging-system';
import { ArtifactRepository } from './artifact-repository';
import { DeploymentValidator } from './deployment-validator';
import { RollbackDeployment } from './rollback-deployment';
import { ReleaseManagement } from './release-management';

import { BuildReproducibilityEngine } from './build-reproducibility-engine';
import { ReleaseCertificationCenter } from './release-certification-center';
import { DeploymentDashboard } from './deployment-dashboard';
import { SupplyChainSecurity } from './supply-chain-security';
import { AutomatedCompatibilityMatrix } from './automated-compatibility-matrix';
import { ReleaseTelemetryAnalyzer } from './release-telemetry-analyzer';
import { DisasterRecoveryPlaybook } from './disaster-recovery-playbook';
import { OutputContractBuilder } from './output-contract';

export class DeploymentDevOpsFramework {
  public readonly environment: EnvironmentManager;
  public readonly ci: CIPipeline;
  public readonly cd: CDPipeline;
  public readonly signing: CodeSigning;
  public readonly packaging: PackagingSystem;
  public readonly artifacts: ArtifactRepository;
  public readonly validator: DeploymentValidator;
  public readonly rollback: RollbackDeployment;
  public readonly releases: ReleaseManagement;
  
  public readonly buildReproducibility: BuildReproducibilityEngine;
  public readonly certificationCenter: ReleaseCertificationCenter;
  public readonly dashboard: DeploymentDashboard;
  public readonly supplyChain: SupplyChainSecurity;
  public readonly compatibility: AutomatedCompatibilityMatrix;
  public readonly telemetry: ReleaseTelemetryAnalyzer;
  public readonly disasterRecovery: DisasterRecoveryPlaybook;
  public readonly contractBuilder: OutputContractBuilder;

  constructor() {
    this.environment = new EnvironmentManager();
    this.ci = new CIPipeline();
    this.cd = new CDPipeline();
    this.signing = new CodeSigning();
    this.packaging = new PackagingSystem();
    this.artifacts = new ArtifactRepository();
    this.validator = new DeploymentValidator(this.signing);
    this.rollback = new RollbackDeployment();
    this.releases = new ReleaseManagement();

    this.buildReproducibility = new BuildReproducibilityEngine();
    this.certificationCenter = new ReleaseCertificationCenter();
    this.dashboard = new DeploymentDashboard();
    this.supplyChain = new SupplyChainSecurity();
    this.compatibility = new AutomatedCompatibilityMatrix();
    this.telemetry = new ReleaseTelemetryAnalyzer();
    this.disasterRecovery = new DisasterRecoveryPlaybook();
    this.contractBuilder = new OutputContractBuilder();
  }
}
