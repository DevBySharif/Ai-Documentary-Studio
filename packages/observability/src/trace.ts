import { TraceContext } from './models';
import { v4 as uuidv4 } from 'uuid';

export class TraceManager {
  /**
   * Starts a new root trace (e.g., a new user action).
   */
  startTrace(operationName: string): TraceContext {
    return {
      correlationId: uuidv4(),
      spanId: uuidv4(),
      operationName
    };
  }

  /**
   * Creates a child span from an existing context (e.g., a database query within a user action).
   */
  createChildSpan(parent: TraceContext, operationName: string): TraceContext {
    return {
      correlationId: parent.correlationId,
      parentSpanId: parent.spanId,
      spanId: uuidv4(),
      operationName
    };
  }
}
