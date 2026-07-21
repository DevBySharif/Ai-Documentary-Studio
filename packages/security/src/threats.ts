import { SecurityEvent } from './models';
import { SecurityPolicyEngine } from './policy';
import pino from 'pino';

const logger = pino({ name: 'threat-detector' });

/**
 * Monitors incoming security events for suspicious patterns.
 */
export class ThreatDetector {
  private failureCounts = new Map<string, number>();

  constructor(private policyEngine: SecurityPolicyEngine) {}

  /**
   * Analyzes an event. If a threat is detected, it returns true and potentially triggers mitigation.
   */
  analyze(event: SecurityEvent): boolean {
    if (event.status === 'Denied' || event.status === 'Failed') {
      const count = (this.failureCounts.get(event.subjectId) || 0) + 1;
      this.failureCounts.set(event.subjectId, count);

      const policy = this.policyEngine.getPolicy();
      
      if (count >= policy.maxPluginFailuresBeforeSuspend) {
        logger.fatal({ subjectId: event.subjectId, count }, 'THREAT DETECTED: Excessive failures. Suspending subject.');
        // In a full implementation, this would trigger an event on an EventBus that the PluginManager listens to.
        return true;
      }
    } else if (event.status === 'Allowed') {
      // Reset count on successful authorized action
      if (this.failureCounts.has(event.subjectId)) {
        this.failureCounts.delete(event.subjectId);
      }
    }

    return false;
  }
}
