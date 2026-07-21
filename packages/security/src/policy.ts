import { SecurityPolicy, SecurityPolicySchema } from './models';
import pino from 'pino';

const logger = pino({ name: 'security-policy' });

export class SecurityPolicyEngine {
  private currentPolicy: SecurityPolicy;

  constructor(initialPolicy?: Partial<SecurityPolicy>) {
    // Merge provided overrides with defaults
    this.currentPolicy = SecurityPolicySchema.parse(initialPolicy || {});
  }

  getPolicy(): Readonly<SecurityPolicy> {
    return this.currentPolicy;
  }

  updatePolicy(newPolicy: Partial<SecurityPolicy>): void {
    logger.info('Updating security policy');
    this.currentPolicy = SecurityPolicySchema.parse({
      ...this.currentPolicy,
      ...newPolicy
    });
  }

  /**
   * Evaluates if a specific action is permitted based on current policies.
   */
  evaluate(action: 'InstallPlugin' | 'MakeNetworkRequest' | 'ExecuteIPC', context: any = {}): boolean {
    switch (action) {
      case 'InstallPlugin':
        if (!context.isSigned && !this.currentPolicy.allowUnsignedPlugins) {
          logger.warn('Policy evaluation failed: Unsigned plugins are not allowed.');
          return false;
        }
        return true;
        
      case 'MakeNetworkRequest':
        if (!this.currentPolicy.allowNetworkAccess) {
          logger.warn('Policy evaluation failed: Network access is disabled.');
          return false;
        }
        return true;

      case 'ExecuteIPC':
        if (this.currentPolicy.requireSecureIPC && !context.isSecureContext) {
          logger.warn('Policy evaluation failed: IPC request not from a secure context.');
          return false;
        }
        return true;

      default:
        // Default deny for unknown actions
        logger.warn({ action }, 'Policy evaluation failed: Unknown action');
        return false;
    }
  }
}
