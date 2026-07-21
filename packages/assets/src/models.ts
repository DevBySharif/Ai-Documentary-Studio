import { z } from 'zod';

export enum AssetStatus {
  Imported = 'Imported',
  Indexed = 'Indexed',
  Archived = 'Archived',
  Deleted = 'Deleted', // Soft delete
  Purged = 'Purged',   // Hard delete
}

export const AssetMetadataSchema = z.object({
  id: z.string().uuid(),
  hash: z.string(), // SHA-256 Content Hash
  logicalName: z.string(),
  mimeType: z.string(),
  fileExtension: z.string(),
  sizeBytes: z.number().int().nonnegative(),
  status: z.nativeEnum(AssetStatus).default(AssetStatus.Imported),
  version: z.number().int().default(1),
  
  // Storage Location is abstracted; the registry handles resolution via the Storage Provider
  storageKey: z.string(), 

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  
  // Reference counting to prevent deletion
  references: z.number().int().default(0),

  tags: z.array(z.string()).default([]),
});

export type AssetMetadata = z.infer<typeof AssetMetadataSchema>;

export const ImageMetadataSchema = AssetMetadataSchema.extend({
  type: z.literal('image'),
  dimensions: z.object({
    width: z.number(),
    height: z.number(),
  }),
});

export const VideoMetadataSchema = AssetMetadataSchema.extend({
  type: z.literal('video'),
  dimensions: z.object({
    width: z.number(),
    height: z.number(),
  }),
  durationSeconds: z.number(),
  frameRate: z.number(),
});

export const AudioMetadataSchema = AssetMetadataSchema.extend({
  type: z.literal('audio'),
  durationSeconds: z.number(),
  bitrate: z.number().optional(),
});

export const AssetLineageSchema = z.object({
  assetId: z.string().uuid(),
  parentAssetId: z.string().uuid().optional(),
  sourceProvider: z.string().optional(),
  originalPrompt: z.string().optional(),
  generationParameters: z.record(z.string(), z.any()).optional(),
  projectId: z.string().uuid().optional(),
  sceneId: z.string().uuid().optional(),
});

export type AssetLineage = z.infer<typeof AssetLineageSchema>;
