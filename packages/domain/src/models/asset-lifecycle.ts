/**
 * Stable lifecycle stages for an Asset.
 * Transitions emit domain events.
 */
export const enum AssetLifecycleStatus {
  Imported = "Imported",
  Indexed = "Indexed",
  Referenced = "Referenced",
  Processed = "Processed",
  Archived = "Archived",
  Removed = "Removed",
}

/**
 * Asset categories supported by the media storage system.
 */
export const enum AssetCategory {
  Video = "Video",
  Audio = "Audio",
  Image = "Image",
  Document = "Document",
  Subtitle = "Subtitle",
  Font = "Font",
  MotionPreset = "MotionPreset",
  Lut = "Lut",
  AiOutput = "AiOutput",
  Generated = "Generated",
}
