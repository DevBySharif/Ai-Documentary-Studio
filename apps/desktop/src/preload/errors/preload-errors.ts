export class PreloadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PreloadError";
  }
}

export class IPCCommunicationError extends PreloadError {
  constructor(channel: string, cause?: string) {
    super(`IPC Communication failed on channel '${channel}': ${cause || "Unknown error"}`);
    this.name = "IPCCommunicationError";
  }
}

export class ValidationError extends PreloadError {
  constructor(message: string) {
    super(`Validation failed: ${message}`);
    this.name = "ValidationError";
  }
}

export class PermissionDeniedError extends PreloadError {
  constructor(action: string) {
    super(`Permission denied for action: ${action}`);
    this.name = "PermissionDeniedError";
  }
}
