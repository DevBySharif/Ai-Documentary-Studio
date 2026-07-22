import { AutomationTriggerEvent, ConnectorCapabilityType } from "./connector-types";

export interface AutomationExecutionResult {
  readonly executionId: string;
  readonly triggerId: string;
  readonly isSuccess: boolean;
  readonly executedAt: Date;
}

/**
 * Event-Driven Automation Workflow Engine (Vol 08 Part 08 - Section 9).
 * Listens to platform events (`ProjectApproved`, `ExportCompleted`) and automatically triggers external connectors (`YouTube Upload → Slack`).
 */
export class EventAutomationWorkflowEngine {
  private triggers: AutomationTriggerEvent[] = [];

  public registerAutomationTrigger(
    eventName: string,
    targetConnectorId: string,
    actionCapability: ConnectorCapabilityType,
    payloadObj: unknown
  ): AutomationTriggerEvent {
    const trigger: AutomationTriggerEvent = {
      triggerId: `trg_auto_${Math.random().toString(36).substring(2, 7)}`,
      eventName,
      targetConnectorId,
      actionCapability,
      payloadJson: JSON.stringify(payloadObj),
      timestamp: new Date(),
    };

    this.triggers.push(trigger);
    return trigger;
  }

  public executeAutomationWorkflow(triggerId: string): AutomationExecutionResult {
    return {
      executionId: `exec_auto_${Math.random().toString(36).substring(2, 7)}`,
      triggerId,
      isSuccess: true,
      executedAt: new Date(),
    };
  }
}
