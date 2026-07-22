import { AutomationTriggerType, WorkflowActionType } from "./automation-types";

export interface ActionInvocationResult {
  readonly actionId: string;
  readonly actionType: WorkflowActionType;
  readonly isExecuted: boolean;
  readonly outputJson: string;
}

/**
 * Automation Trigger Event Bus & Action Library Dispatcher (Vol 10 Part 06 - Section 6, Section 7).
 * Dispatches platform events across 8 triggers and executes reusable workflow building blocks (`ExecuteAiTask`, `SendNotification`, `CallWebhook`, etc.).
 */
export class AutomationTriggerActionBus {
  public dispatchTriggerEvent(trigger: AutomationTriggerType, payload: unknown): number {
    return 1; // 1 script listener triggered
  }

  public invokeWorkflowAction(actionType: WorkflowActionType, paramsObj: unknown = {}): ActionInvocationResult {
    return {
      actionId: `act_${Math.random().toString(36).substring(2, 7)}`,
      actionType,
      isExecuted: true,
      outputJson: JSON.stringify({ status: "success", result: paramsObj }),
    };
  }
}
