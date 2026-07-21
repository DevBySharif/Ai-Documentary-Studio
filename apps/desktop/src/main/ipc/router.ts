import { ipcMain } from 'electron';
import { IpcChannels, IpcRequest, IpcResponse, PingRequest, PingResponse } from '@studio/shared';
import { PermissionGateway } from '../core/PermissionGateway';
import { z } from 'zod';

export function registerIpcHandlers() {
  
  ipcMain.handle(IpcChannels.SYSTEM.PING, async (event, request: IpcRequest): Promise<IpcResponse<PingResponse>> => {
    try {
      // 1. Validate request via PermissionGateway
      const schema = z.object({ message: z.string() });
      const payload = PermissionGateway.validate<PingRequest>(request, schema);
      
      // 2. Perform action
      const data: PingResponse = {
        reply: `Pong! Received: ${payload?.message}`
      };

      // 3. Return success
      return { success: true, data };
    } catch (error: any) {
      // Return typed error
      return {
        success: false,
        error: { code: 'VALIDATION_ERROR', message: error.message }
      };
    }
  });

  // More channels will be registered here...
}
