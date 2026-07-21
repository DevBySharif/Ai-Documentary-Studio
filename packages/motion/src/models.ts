import { z } from 'zod';
import { InterpolationType } from '@studio/timeline';

export const TransformSchema = z.object({
  x: z.number().default(0),
  y: z.number().default(0),
  scale: z.number().positive().default(1),
  rotation: z.number().default(0),
  opacity: z.number().min(0).max(1).default(1),
});

export type Transform = z.infer<typeof TransformSchema>;

export const SubjectAnchorSchema = z.object({
  id: z.string(),
  type: z.enum(['Face', 'Person', 'Building', 'Object', 'Text', 'Custom']),
  bounds: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number()
  }).optional(),
});

export type SubjectAnchor = z.infer<typeof SubjectAnchorSchema>;

export const MotionPresetSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(['Documentary', 'Historical', 'Cinematic', 'Map', 'Default']),
  // In a real system this would map to a series of relative keyframes or a function
  behavior: z.enum(['Pan', 'Zoom', 'Rotate', 'KenBurns', 'Custom']),
  intensity: z.number().min(0).max(1).default(0.5)
});

export type MotionPreset = z.infer<typeof MotionPresetSchema>;

export const TransitionTypeSchema = z.enum([
  'Cut',
  'CrossDissolve',
  'FadeToBlack',
  'Wipe',
  'Push',
  'Slide',
  'ZoomBlur'
]);

export const TransitionSchema = z.object({
  id: z.string().uuid(),
  type: TransitionTypeSchema,
  durationFrames: z.number().int().positive(),
  easing: z.nativeEnum(InterpolationType).default(InterpolationType.EaseInOut)
});

export type Transition = z.infer<typeof TransitionSchema>;
