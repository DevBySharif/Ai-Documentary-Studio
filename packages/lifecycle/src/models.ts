import { z } from 'zod';

export const ApplicationStateSchema = z.enum([
  'Bootstrapping',
  'Initializing',
  'Ready',
  'Busy',
  'Recovering',
  'ShuttingDown',
  'Terminated'
]);

export type ApplicationState = z.infer<typeof ApplicationStateSchema>;

export const WorkspaceStateSchema = z.enum([
  'Created',
  'Opening',
  'Active',
  'Saving',
  'Closing',
  'Closed',
  'Recovery'
]);

export type WorkspaceState = z.infer<typeof WorkspaceStateSchema>;

export const LifecycleEventSchema = z.enum([
  'ApplicationStarted',
  'WorkspaceOpened',
  'ProjectLoaded',
  'AutosaveCompleted',
  'RecoveryStarted',
  'ShutdownInitiated',
  'ApplicationExited'
]);

export type LifecycleEvent = z.infer<typeof LifecycleEventSchema>;

export const CheckpointSchema = z.object({
  checkpointId: z.string().uuid(),
  timestamp: z.date(),
  applicationState: ApplicationStateSchema,
  activeWorkspaceId: z.string().optional(),
  pendingJobs: z.number().int().default(0),
  isSafeMode: z.boolean().default(false)
});

export type Checkpoint = z.infer<typeof CheckpointSchema>;
