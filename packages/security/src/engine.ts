import { SecurityPolicyEngine } from './policy';
import { SecretVault } from './vault';
import { AuditLogger } from './audit';
import { ThreatDetector } from './threats';
import { SecurityEvent } from './models';

export class SecurityEngineFacade {
  public policy: SecurityPolicyEngine;
  public vault: SecretVault;
  public audit: AuditLogger;
  public threats: ThreatDetector;

  constructor() {
    this.policy = new SecurityPolicyEngine();
    this.vault = new SecretVault();
    this.audit = new AuditLogger(this.policy);
    this.threats = new ThreatDetector(this.policy);
  }

  /**
   * Unified method to process an action securely.
   * Checks policy, audits the attempt, and analyzes for threats.
   */
  enforce(action: 'InstallPlugin' | 'MakeNetworkRequest' | 'ExecuteIPC', subjectId: string, context: any = {}): boolean {
    const isAllowed = this.policy.evaluate(action, context);
    
    const eventInput: Omit<SecurityEvent, 'id' | 'timestamp'> = {
      domain: 'Core', // Can be refined based on action
      action,
      subjectId,
      status: isAllowed ? 'Allowed' : 'Denied',
      classification: 'Internal'
    };

    this.audit.logEvent(eventInput);
    
    // Pass full mock event to threat detector
    this.threats.analyze({
       ...eventInput,
       id: 'mock',
       timestamp: new Date()
    });

    return isAllowed;
  }
}
