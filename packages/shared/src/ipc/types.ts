export interface IpcRequest<T = any> {
  channel: string;
  payload: T;
  meta?: {
    workspaceId?: string;
    timestamp: number;
  };
}

export interface IpcResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// Example specific payloads
export interface PingRequest {
  message: string;
}

export interface PingResponse {
  reply: string;
}
