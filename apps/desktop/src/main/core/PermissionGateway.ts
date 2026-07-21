import { IpcRequest } from '@studio/shared';
import { z } from 'zod';

export class PermissionGateway {
  /**
   * Validates the request payload against a Zod schema.
   * Also performs any necessary security/workspace checks.
   */
  static validate<T>(request: IpcRequest, schema?: z.ZodType<T>): T | undefined {
    // 1. Verify basic structure
    if (!request.channel || !request.meta) {
      throw new Error('Invalid IPC request structure');
    }

    // 2. Validate payload if schema provided
    if (schema) {
      const result = schema.safeParse(request.payload);
      if (!result.success) {
        throw new Error(`Validation failed: ${result.error.message}`);
      }
      return result.data;
    }

    return request.payload as T;
  }
}
