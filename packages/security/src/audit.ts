import { SecurityEvent } from './models';
import { SecurityPolicyEngine as Engine } from './policy';
import { randomUUID } from 'crypto';
import pino from 'pino';

const logger = pino({ name: 'audit-logger' });

export class AuditLogger {
  constructor(private policyEngine: Engine) {}

  /**
   * Logs a security event.
   * Ensures that 'Secret' classification data is redacted or rejected.
   */
  logEvent(eventInput: Omit<SecurityEvent, 'id' | 'timestamp'>): void {
    const policy = this.policyEngine.getPolicy();
    
    // Check audit logging level policy
    if (policy.auditLogLevel === 'None') return;
    if (policy.auditLogLevel === 'DeniedOnly' && eventInput.status !== 'Denied' && eventInput.status !== 'Failed') return;

    // Prevent secret leakage
    if (eventInput.classification === 'Secret') {
      logger.error('Attempted to audit log Secret data. Redacting details.');
      eventInput.details = { error: 'Redacted Secret Data' };
    }

    const event: SecurityEvent = {
      ...eventInput,
      id: randomUUID(),
      timestamp: new Date()
    };

    // In a real system, this writes to an append-only file or remote SIEM.
    logger.info({ auditEvent: event }, `[AUDIT] ${event.action} - ${event.status}`);
  }
}
