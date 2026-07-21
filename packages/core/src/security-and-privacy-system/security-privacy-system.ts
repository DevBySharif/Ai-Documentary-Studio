import { CredentialEncryption } from './credential-encryption';
import { ApiKeyVault } from './api-key-vault';
import { SecureLocalStorage } from './secure-local-storage';
import { WorkspaceIsolation } from './workspace-isolation';
import { ProjectPermissions } from './project-permissions';
import { PluginSecuritySandbox } from './plugin-security-sandbox';
import { SecureExports } from './secure-exports';
import { BackupEncryption } from './backup-encryption';
import { AuditTrail } from './audit-trail';
import { PrivacyControls } from './privacy-controls';
import { ThreatDetection } from './threat-detection';
import { ZeroTrustAccess } from './zero-trust-access';
import { FileIntegrityVerifier } from './file-integrity-verifier';
import { SecurityPolicyEngine } from './security-policy-engine';
import { SecureSharingFramework } from './secure-sharing-framework';
import { IncidentResponseCenter } from './incident-response-center';
import { ComplianceReadinessLayer } from './compliance-readiness';
import { SecurityHealthDashboard } from './security-health-dashboard';
import { OutputContractBuilder } from './output-contract';

export class SecurityPrivacySystem {
  public readonly encryption: CredentialEncryption;
  public readonly keyVault: ApiKeyVault;
  public readonly secureStorage: SecureLocalStorage;
  public readonly isolation: WorkspaceIsolation;
  public readonly permissions: ProjectPermissions;
  public readonly pluginSandbox: PluginSecuritySandbox;
  public readonly secureExports: SecureExports;
  public readonly backupEncryption: BackupEncryption;
  public readonly auditTrail: AuditTrail;
  public readonly privacyControls: PrivacyControls;
  public readonly threatDetection: ThreatDetection;

  public readonly zeroTrust: ZeroTrustAccess;
  public readonly integrityVerifier: FileIntegrityVerifier;
  public readonly policyEngine: SecurityPolicyEngine;
  public readonly sharingFramework: SecureSharingFramework;
  public readonly incidentCenter: IncidentResponseCenter;
  public readonly compliance: ComplianceReadinessLayer;
  public readonly healthDashboard: SecurityHealthDashboard;
  public readonly contractBuilder: OutputContractBuilder;

  constructor() {
    this.encryption = new CredentialEncryption();
    this.keyVault = new ApiKeyVault(this.encryption);
    this.secureStorage = new SecureLocalStorage();
    this.isolation = new WorkspaceIsolation();
    this.permissions = new ProjectPermissions();
    this.pluginSandbox = new PluginSecuritySandbox();
    this.secureExports = new SecureExports();
    this.backupEncryption = new BackupEncryption(this.encryption);
    this.auditTrail = new AuditTrail();
    this.privacyControls = new PrivacyControls();
    this.threatDetection = new ThreatDetection();

    this.zeroTrust = new ZeroTrustAccess(this.permissions);
    this.integrityVerifier = new FileIntegrityVerifier();
    this.policyEngine = new SecurityPolicyEngine();
    this.sharingFramework = new SecureSharingFramework();
    this.incidentCenter = new IncidentResponseCenter(this.threatDetection);
    this.compliance = new ComplianceReadinessLayer();
    this.healthDashboard = new SecurityHealthDashboard(this.keyVault, this.integrityVerifier, this.threatDetection);
    this.contractBuilder = new OutputContractBuilder();
  }
}
