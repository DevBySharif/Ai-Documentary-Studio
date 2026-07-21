import { z } from 'zod';

export const RenderPresetSchema = z.object({
  id: z.string(),
  name: z.string(),
  width: z.number().int().positive().default(1920),
  height: z.number().int().positive().default(1080),
  fps: z.number().int().positive().default(60),
  videoCodec: z.string().default('h264'),
  audioCodec: z.string().default('aac'),
  videoBitrate: z.string().default('8000k'),
  audioBitrate: z.string().default('320k'),
  hardwareAcceleration: z.enum(['none', 'nvenc', 'qsv', 'videotoolbox']).default('none')
});

export type RenderPreset = z.infer<typeof RenderPresetSchema>;

export const RenderStatusSchema = z.enum([
  'Pending',
  'Initializing',
  'Rendering',
  'Paused',
  'Completed',
  'Failed',
  'Cancelled'
]);

export const RenderJobSchema = z.object({
  id: z.string().uuid(),
  timelineId: z.string(),
  timelineVersion: z.number(),
  preset: RenderPresetSchema,
  status: RenderStatusSchema.default('Pending'),
  progress: z.number().min(0).max(100).default(0),
  framesRendered: z.number().int().default(0),
  totalFrames: z.number().int(),
  outputFile: z.string(),
  error: z.string().optional(),
  createdAt: z.date(),
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
});

export type RenderJob = z.infer<typeof RenderJobSchema>;

export const RenderSegmentSchema = z.object({
  id: z.string().uuid(),
  jobId: z.string().uuid(),
  startFrame: z.number().int(),
  endFrame: z.number().int(),
  outputFile: z.string(),
  status: RenderStatusSchema.default('Pending'),
});

export type RenderSegment = z.infer<typeof RenderSegmentSchema>;
