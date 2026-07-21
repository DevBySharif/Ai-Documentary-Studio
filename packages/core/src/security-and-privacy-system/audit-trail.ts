import { AuditEvent } from './types';

export class AuditTrail {
  private ledger: AuditEvent[] = [];

  recordEvent(action: string, actorId: string, targetId: string, details: string): void {
    const event: AuditEvent = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      action,
      actorId,
      targetId,
      details
    };
    
    // In production, this should be written to an append-only file
    this.ledger.push(event);
    console.log(`[AUDIT] ${action} by ${actorId} on ${targetId}`);
  }

  getRecentEvents(limit: number = 50): AuditEvent[] {
    return this.ledger.slice(-limit);
  }
}
