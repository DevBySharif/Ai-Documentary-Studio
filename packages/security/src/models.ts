import { z } from 'zod';

export const DataClassificationSchema = z.enum([
  'Public',
  'Internal',
  'Sensitive',
  'Secret'
]);

export type DataClassification = z.infer<typeof DataClassificationSchema>;

export const SecurityEventSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.date(),
  domain: z.enum(['Plugin', 'AIProvider', 'Filesystem', 'IPC', 'Network', 'Core']),
  action: z.string(),
  subjectId: z.string(), // e.g., plugin id or user id
  status: z.enum(['Allowed', 'Denied', 'Failed', 'Audit']),
  details: z.record(z.any()).optional(),
  classification: DataClassificationSchema.default('Internal')
});

export type SecurityEvent = z.infer<typeof SecurityEventSchema>;

export const SecurityPolicySchema = z.object({
  allowUnsignedPlugins: z.boolean().default(false),
  allowNetworkAccess: z.boolean().default(true),
  requireSecureIPC: z.boolean().default(true),
  auditLogLevel: z.enum(['All', 'DeniedOnly', 'None']).default('DeniedOnly'),
  maxPluginFailuresBeforeSuspend: z.number().int().default(5)
});

export type SecurityPolicy = z.infer<typeof SecurityPolicySchema>;
