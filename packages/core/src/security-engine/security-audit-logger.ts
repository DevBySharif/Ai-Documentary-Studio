export type SecurityEventType =
  | "PluginVerification"
  | "UnauthorizedCapabilityRequest"
  | "FailedAuthentication"
  | "CorruptedConfiguration"
  | "LicenseViolation"
  | "PluginSandboxEscapeAttempt"
  | "TamperingDetected";

export interface SecurityAuditEvent {
  readonly eventId: string;
  readonly type: SecurityEventType;
  readonly actor: string;
  readonly target: string;
  readonly timestamp: Date;
  readonly details?: Record<string, unknown>;
}

/**
 * Security Audit Logger & Event System (IB Part 23 - Section 14, Section 17, Section 18).
 * Append-only audit logging for security-critical events.
 */
export class SecurityAuditLogger {
  private events: SecurityAuditEvent[] = [];

  public logSecurityEvent(
    type: SecurityEventType,
    actor: string,
    target: string,
    details?: Record<string, unknown>
  ): SecurityAuditEvent {
    const event: SecurityAuditEvent = {
      eventId: `sec_evt_${Math.random().toString(36).substring(2, 9)}`,
      type,
      actor,
      target,
      timestamp: new Date(),
      details,
    };
    this.events.push(event);
    return event;
  }

  public getEvents(): ReadonlyArray<SecurityAuditEvent> {
    return this.events;
  }
}
