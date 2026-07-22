import { SandboxedScriptRuntime } from "./sandboxed-script-runtime";
import { AutomationTriggerActionBus } from "./automation-trigger-action-bus";
import { OutgoingIncomingWebhookEngine } from "./outgoing-incoming-webhook-engine";
import { CustomWorkflowExecutionEngine } from "./custom-workflow-execution-engine";
import { ScriptCategoryType } from "./automation-types";

/**
 * Master Scripting Automation Webhooks Engine (Main Vol 10 Part 06).
 * Core entry point for 5-layer automation architecture (`Platform Events → Automation Engine → Script Runtime → Workflow Actions → External Systems`).
 */
export class MasterScriptingAutomationWebhooks {
  public readonly scriptRuntime = new SandboxedScriptRuntime();
  public readonly triggerActionBus = new AutomationTriggerActionBus();
  public readonly webhookEngine = new OutgoingIncomingWebhookEngine();
  public readonly workflowExecution = new CustomWorkflowExecutionEngine();

  public runAutomationScript(
    scriptId: string,
    scriptCode: string,
    category: ScriptCategoryType = "EventScripts"
  ): ReturnType<SandboxedScriptRuntime["executeScript"]> {
    return this.scriptRuntime.executeScript(scriptId, scriptCode, category);
  }
}
