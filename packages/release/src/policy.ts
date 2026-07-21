import { UpdatePolicy, ReleaseChannel } from './models';
import pino from 'pino';

const logger = pino({ name: 'update-policy' });

export interface PolicyContext {
  isSafeMode: boolean;
  isEnterpriseManaged: boolean;
  userOptInBeta: boolean;
}

/**
 * Centralized Update Policy Engine.
 */
export class UpdatePolicyEngine {
  constructor(private context: PolicyContext) {}

  /**
   * Determines if the system is allowed to check for updates automatically.
   */
  canAutoCheck(policy: UpdatePolicy): boolean {
    if (this.context.isSafeMode) {
      logger.info('Auto-check disabled in Safe Mode');
      return false;
    }
    
    if (policy === 'Manual' || policy === 'Deferred') {
      return false;
    }

    if (policy === 'EnterpriseManaged' && !this.context.isEnterpriseManaged) {
      // Misconfiguration detected
      return false;
    }

    return true;
  }

  /**
   * Resolves the target release channel based on user preferences and enterprise policies.
   */
  resolveTargetChannel(): ReleaseChannel {
    if (this.context.isEnterpriseManaged) return 'LTS';
    if (this.context.userOptInBeta) return 'Beta';
    return 'Stable';
  }
}
