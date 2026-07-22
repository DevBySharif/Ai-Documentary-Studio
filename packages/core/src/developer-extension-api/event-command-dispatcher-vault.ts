import { RegisteredCommandDescriptor } from "./developer-api-types";

export interface PlatformPublicEvent {
  readonly eventName: string; // e.g. "ProjectOpened", "AssetCreated", "WorkflowCompleted", "AIResponseReceived", "ExportFinished"
  readonly payloadJson: string;
  readonly timestamp: Date;
}

/**
 * Immutable Event API & Command Dispatcher Vault (Vol 10 Part 02 - Section 10, Section 11, Section 12).
 * Exposes immutable platform event subscriptions and dispatches registered extension commands (keyboard shortcuts, toolbar actions, context menus).
 */
export class EventCommandDispatcherVault {
  private registeredCommands = new Map<string, RegisteredCommandDescriptor>();
  private eventHandlers = new Map<string, Array<(e: PlatformPublicEvent) => void>>();

  public registerExtensionCommand(
    commandId: string,
    title: string,
    category: string,
    handlerFn: () => void,
    shortcut?: string
  ): RegisteredCommandDescriptor {
    const cmd: RegisteredCommandDescriptor = {
      commandId,
      title,
      shortcut,
      category,
      handlerFn,
    };

    this.registeredCommands.set(commandId, cmd);
    return cmd;
  }

  public dispatchCommand(commandId: string): boolean {
    const cmd = this.registeredCommands.get(commandId);
    if (!cmd) return false;

    cmd.handlerFn();
    return true;
  }

  public subscribePublicEvent(eventName: string, handler: (e: PlatformPublicEvent) => void): void {
    const existing = this.eventHandlers.get(eventName) || [];
    this.eventHandlers.set(eventName, [...existing, handler]);
  }
}
