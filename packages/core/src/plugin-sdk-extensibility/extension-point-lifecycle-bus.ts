import { ExtensionPointType } from "./plugin-sdk-types";

export interface ExtensionPointSubscription {
  readonly subscriptionId: string;
  readonly pluginId: string;
  readonly extensionPoint: ExtensionPointType;
  readonly callbackFn: (payload: unknown) => void;
}

/**
 * Lifecycle Extension Points Bus (Vol 10 Part 01 - Section 6).
 * Exposes 7 core platform lifecycle extension points (`ProjectCreation`, `ScriptGeneration`, `AiExecution`, `RenderingPipeline`, `TimelineEditing`, `ExportProcess`, `ReviewWorkflow`).
 */
export class ExtensionPointLifecycleBus {
  private subscriptions: ExtensionPointSubscription[] = [];

  public registerExtensionPointListener(
    pluginId: string,
    extensionPoint: ExtensionPointType,
    callbackFn: (payload: unknown) => void
  ): ExtensionPointSubscription {
    const sub: ExtensionPointSubscription = {
      subscriptionId: `sub_ext_${Math.random().toString(36).substring(2, 7)}`,
      pluginId,
      extensionPoint,
      callbackFn,
    };

    this.subscriptions.push(sub);
    return sub;
  }

  public triggerExtensionPoint(extensionPoint: ExtensionPointType, payload: unknown): number {
    const active = this.subscriptions.filter((s) => s.extensionPoint === extensionPoint);
    active.forEach((s) => s.callbackFn(payload));
    return active.length;
  }
}
