import { z } from 'zod';

export const ReleaseChannelSchema = z.enum([
  'LTS',
  'Stable',
  'Beta',
  'Alpha',
  'Nightly',
  'Internal'
]);

export type ReleaseChannel = z.infer<typeof ReleaseChannelSchema>;

export const UpdatePolicySchema = z.enum([
  'Automatic',
  'Manual',
  'EnterpriseManaged',
  'Deferred'
]);

export type UpdatePolicy = z.infer<typeof UpdatePolicySchema>;

export const ReleaseManifestSchema = z.object({
  version: z.string(),
  buildId: z.string(),
  commitHash: z.string(),
  buildTimestamp: z.string().datetime(),
  channel: ReleaseChannelSchema,
  checksums: z.record(z.string()), // e.g. { "installer.exe": "sha256-..." }
  signatures: z.record(z.string()),
  requiresMigration: z.boolean().default(false),
  compatibility: z.object({
    minOSVersion: z.string().optional(),
    requiredDependencies: z.array(z.string()).optional()
  })
});

export type ReleaseManifest = z.infer<typeof ReleaseManifestSchema>;

export const UpdateStateSchema = z.enum([
  'Idle',
  'Checking',
  'Downloading',
  'Verifying',
  'Staging',
  'ReadyToInstall',
  'Error'
]);

export type UpdateState = z.infer<typeof UpdateStateSchema>;
