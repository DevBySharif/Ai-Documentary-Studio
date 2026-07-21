import { IPCCommunicationError } from "../errors/preload-errors";
import { ValidatorRegistry, Validator } from "../validators/validator-registry";
import { Disposable } from "../events/disposable";

// We mock ipcRenderer to avoid electron import issues in this pure TS model
// In a real implementation this would import { ipcRenderer } from "electron";
declare const ipcRenderer: {
  invoke(channel: string, ...args: any[]): Promise<any>;
  on(channel: string, listener: (event: any, ...args: any[]) => void): void;
  removeListener(channel: string, listener: (...args: any[]) => void): void;
};

export class IpcWrapper {
  public static async invoke<TInput, TOutput>(
    channel: string,
    payload: TInput,
    inputValidator?: Validator<TInput>,
    outputValidator?: Validator<TOutput>
  ): Promise<TOutput> {
    try {
      const validatedInput = ValidatorRegistry.validate(inputValidator, payload);
      
      const response = await ipcRenderer.invoke(channel, validatedInput);
      
      return ValidatorRegistry.validate(outputValidator, response);
    } catch (error: any) {
      if (error.name === "ValidationError") {
        throw error; // Let validation errors bubble up
      }
      throw new IPCCommunicationError(channel, error.message);
    }
  }

  public static subscribe<TPayload>(
    channel: string,
    callback: (payload: TPayload) => void,
    outputValidator?: Validator<TPayload>
  ): Disposable {
    const listener = (_event: any, payload: unknown) => {
      try {
        const validated = ValidatorRegistry.validate(outputValidator, payload);
        callback(validated);
      } catch (error) {
        console.error(`Invalid payload received on channel ${channel}`, error);
      }
    };

    ipcRenderer.on(channel, listener);

    return {
      dispose: () => {
        ipcRenderer.removeListener(channel, listener);
      }
    };
  }
}
