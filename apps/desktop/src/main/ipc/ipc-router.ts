export interface IpcHandler {
  domain: string;
  register(): void;
}

export class IpcRouter {
  private handlers: IpcHandler[] = [];

  public registerHandler(handler: IpcHandler): void {
    this.handlers.push(handler);
  }

  public registerAll(): void {
    for (const handler of this.handlers) {
      handler.register();
    }
  }
}
