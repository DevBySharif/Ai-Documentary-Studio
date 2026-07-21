import { z } from 'zod';

export enum TrackType {
  Video = 'Video',
  Audio = 'Audio',
  Subtitle = 'Subtitle',
  Motion = 'Motion',
  Overlay = 'Overlay',
  Effects = 'Effects',
  Camera = 'Camera',
  Annotation = 'Annotation'
}

export enum InterpolationType {
  Linear = 'Linear',
  EaseIn = 'EaseIn',
  EaseOut = 'EaseOut',
  EaseInOut = 'EaseInOut',
  Bezier = 'Bezier'
}

export const KeyframeSchema = z.object({
  id: z.string().uuid(),
  property: z.string(),
  timeFrame: z.number().int().nonnegative(),
  value: z.any(),
  interpolation: z.nativeEnum(InterpolationType).default(InterpolationType.Linear)
});

export type Keyframe = z.infer<typeof KeyframeSchema>;

export const ClipSchema = z.object({
  id: z.string().uuid(),
  assetId: z.string().uuid(),
  
  // Timeline position
  startFrame: z.number().int().nonnegative(),
  endFrame: z.number().int().nonnegative(),
  
  // Media source position (trimming)
  inPointFrame: z.number().int().nonnegative().default(0),
  outPointFrame: z.number().int().nonnegative(),
  
  playbackSpeed: z.number().default(1.0),
  isVisible: z.boolean().default(true),
  isLocked: z.boolean().default(false),
  
  keyframes: z.array(KeyframeSchema).default([]),
});

export type Clip = z.infer<typeof ClipSchema>;

export const TrackSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(TrackType),
  name: z.string(),
  layerIndex: z.number().int(), // Z-order
  isVisible: z.boolean().default(true),
  isLocked: z.boolean().default(false),
  clips: z.array(ClipSchema).default([])
});

export type Track = z.infer<typeof TrackSchema>;

export enum MarkerType {
  Scene = 'Scene',
  Chapter = 'Chapter',
  Review = 'Review',
  Warning = 'Warning',
  AISuggestion = 'AISuggestion',
  ExportPoint = 'ExportPoint',
  Custom = 'Custom'
}

export const MarkerSchema = z.object({
  id: z.string().uuid(),
  timeFrame: z.number().int().nonnegative(),
  type: z.nativeEnum(MarkerType),
  label: z.string(),
  description: z.string().optional()
});

export type Marker = z.infer<typeof MarkerSchema>;

export const TimelineSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  frameRate: z.number().int().positive(),
  durationFrames: z.number().int().nonnegative().default(0),
  version: z.number().int().nonnegative().default(1),
  tracks: z.array(TrackSchema).default([]),
  markers: z.array(MarkerSchema).default([])
});

export type Timeline = z.infer<typeof TimelineSchema>;
