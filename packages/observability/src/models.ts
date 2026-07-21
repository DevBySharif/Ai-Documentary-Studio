import { z } from 'zod';

export const LogLevelSchema = z.enum([
  'Trace',
  'Debug',
  'Info',
  'Warning',
  'Error',
  'Critical'
]);

export type LogLevel = z.infer<typeof LogLevelSchema>;

export const MetricSchema = z.object({
  name: z.string(),
  value: z.number(),
  unit: z.enum(['ms', 'bytes', 'count', 'percent']),
  tags: z.record(z.string()).optional(),
  timestamp: z.date().default(() => new Date())
});

export type Metric = z.infer<typeof MetricSchema>;

export const TraceContextSchema = z.object({
  correlationId: z.string().uuid(),
  parentSpanId: z.string().optional(),
  spanId: z.string().uuid(),
  operationName: z.string()
});

export type TraceContext = z.infer<typeof TraceContextSchema>;

export const HealthStatusSchema = z.enum([
  'Healthy',
  'Degraded',
  'Failed'
]);

export type HealthStatus = z.infer<typeof HealthStatusSchema>;
