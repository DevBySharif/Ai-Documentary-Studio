import { PLPluginEventType } from './types';

type WorkflowHandler = (context: unknown) => unknown;

export class PLWorkflowAutomationPlugins {
  private workflows = new Map<string, Map<string, WorkflowHandler>>();
  private eventTriggers = new Map<string, Map<PLPluginEventType, string>>();

  registerWorkflow(pluginId: string, name: string, handler: WorkflowHandler): void {
    if (!this.workflows.has(pluginId)) {
      this.workflows.set(pluginId, new Map());
    }
    this.workflows.get(pluginId)!.set(name, handler);
  }

  async executeWorkflow(pluginId: string, workflowName: string, context: unknown): Promise<unknown> {
    const pluginWorkflows = this.workflows.get(pluginId);
    if (!pluginWorkflows) throw new Error(`No workflows registered for plugin: ${pluginId}`);
    const handler = pluginWorkflows.get(workflowName);
    if (!handler) throw new Error(`Workflow not found: ${workflowName}`);
    return handler(context);
  }

  getWorkflows(pluginId: string): string[] {
    const pluginWorkflows = this.workflows.get(pluginId);
    if (!pluginWorkflows) return [];
    return Array.from(pluginWorkflows.keys());
  }

  triggerOnEvent(pluginId: string, eventType: PLPluginEventType, workflowName: string): void {
    if (!this.eventTriggers.has(pluginId)) {
      this.eventTriggers.set(pluginId, new Map());
    }
    this.eventTriggers.get(pluginId)!.set(eventType, workflowName);
  }
}
