import { LogLevel, TraceContext } from './models';
import pino from 'pino';

/**
 * LogManager provides structured logging capabilities.
 * It automatically injects the TraceContext (Correlation ID) into every log entry.
 */
export class LogManager {
  private baseLogger: pino.Logger;

  constructor(defaultLevel: string = 'info') {
    this.baseLogger = pino({
      level: defaultLevel,
      formatters: {
        level: (label) => {
          return { level: label.toUpperCase() };
        }
      }
    });
  }

  /**
   * Creates a logger bound to a specific component and trace context.
   */
  createContextLogger(componentName: string, traceContext?: TraceContext) {
    const bindings: Record<string, any> = { component: componentName };
    if (traceContext) {
      bindings.correlationId = traceContext.correlationId;
      bindings.spanId = traceContext.spanId;
    }

    const childLogger = this.baseLogger.child(bindings);

    return {
      trace: (msg: string, ctx?: any) => childLogger.trace(ctx || {}, msg),
      debug: (msg: string, ctx?: any) => childLogger.debug(ctx || {}, msg),
      info:  (msg: string, ctx?: any) => childLogger.info(ctx || {}, msg),
      warn:  (msg: string, ctx?: any) => childLogger.warn(ctx || {}, msg),
      error: (msg: string, error?: Error, ctx?: any) => childLogger.error({ err: error, ...ctx }, msg),
      critical: (msg: string, error?: Error, ctx?: any) => childLogger.fatal({ err: error, ...ctx }, msg)
    };
  }
}
