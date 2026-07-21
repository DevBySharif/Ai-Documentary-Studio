import { ToolDefinition, ToolCall } from "./provider-contract";

export type ToolExecutionHandler = (args: Record<string, unknown>) => Promise<unknown>;

export interface ToolLogEntry {
  readonly callId: string;
  readonly toolName: string;
  readonly timestamp: Date;
  readonly durationMs: number;
  readonly status: "Success" | "Error";
  readonly error?: string;
}

/**
 * Tool Execution Engine (IB Part 18 - Section 11).
 * Validates, logs, and executes AI tool calls (Timeline API, Asset Search, File System, etc.).
 */
export class ToolExecutor {
  private definitions = new Map<string, ToolDefinition>();
  private handlers = new Map<string, ToolExecutionHandler>();
  private logs: ToolLogEntry[] = [];

  public registerTool(definition: ToolDefinition, handler: ToolExecutionHandler): void {
    this.definitions.set(definition.name, definition);
    this.handlers.set(definition.name, handler);
  }

  public getToolDefinitions(): ReadonlyArray<ToolDefinition> {
    return Array.from(this.definitions.values());
  }

  public async executeCall(call: ToolCall): Promise<unknown> {
    const handler = this.handlers.get(call.name);
    const start = Date.now();

    if (!handler) {
      const err = `Tool '${call.name}' is not registered.`;
      this.logs.push({ callId: call.id, toolName: call.name, timestamp: new Date(), durationMs: Date.now() - start, status: "Error", error: err });
      throw new Error(err);
    }

    try {
      const result = await handler(call.arguments);
      this.logs.push({ callId: call.id, toolName: call.name, timestamp: new Date(), durationMs: Date.now() - start, status: "Success" });
      return result;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logs.push({ callId: call.id, toolName: call.name, timestamp: new Date(), durationMs: Date.now() - start, status: "Error", error: msg });
      throw err;
    }
  }

  public getLogs(): ReadonlyArray<ToolLogEntry> {
    return this.logs;
  }
}
