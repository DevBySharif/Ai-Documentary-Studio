export type EmbeddingVector = number[];

export type VisualCameraAngle = "wide" | "medium" | "close_up" | "extreme_close_up" | "top" | "side" | "low_angle" | "high_angle";

export type MoodTag = "curiosity" | "reflection" | "wonder" | "calm" | "urgency" | "hope" | "mystery" | "awe" | "fear" | "surprise" | "suspense" | "melancholy" | "neutral";

export type CompositionType = "centered" | "rule_of_thirds" | "negative_space" | "symmetrical" | "leading_lines" | "framed" | "birds_eye" | "dynamic";

export type LightingType = "soft" | "hard" | "ambient" | "cinematic" | "dramatic" | "natural" | "backlit" | "diffused";

export type AnalysisDimension = "main_subject" | "background" | "objects" | "lighting" | "mood" | "composition" | "color_palette" | "camera_angle" | "depth" | "aspect_ratio" | "quality";

export interface ImageAnalysis {
  assetId: string;
  mainSubject: string[];
  background: string;
  objects: string[];
  lighting: LightingType;
  mood: MoodTag;
  composition: CompositionType;
  colorPalette: string[];
  cameraAngle: VisualCameraAngle;
  depth: "flat" | "shallow" | "medium" | "deep";
  aspectRatio: string;
  qualityScore: number;
  sharpness: number;
  analyzedAt: string;
}

export interface VisualDNASignature {
  style: string;
  mood: string;
  camera: string;
  lighting: string;
  color: string;
  emotion: string;
}

export interface ImageFingerprintData {
  assetId: string;
  imageHash: string;
  perceptualHash: string;
  differenceHash: string;
  averageHash: string;
  embeddingId: string;
}

export interface PromptRecord {
  assetId: string;
  originalPrompt: string;
  negativePrompt: string;
  model: string;
  generationDate: string;
  seed: number;
  aspectRatio: string;
  qualitySettings: string;
}

export interface AssetTag {
  tag: string;
  confidence: number;
  category: "concept" | "object" | "emotion" | "theme" | "symbol";
}

export interface MemoryAssetEntry {
  assetId: string;
  imagePath: string;
  thumbnailPath: string;
  analysis: ImageAnalysis;
  embedding: EmbeddingVector;
  visualDNA: VisualDNASignature;
  fingerprint: ImageFingerprintData;
  prompt: PromptRecord;
  tags: AssetTag[];
  channelId: string;
  isGlobal: boolean;
  createdAt: string;
}

export interface GlobalAssetLibrary {
  assets: Map<string, MemoryAssetEntry>;
  universalSymbols: string[];
  commonObjects: string[];
  natureTags: string[];
  spaceTags: string[];
  abstractConcepts: string[];
}

export interface ChannelAssetLibrary {
  channelId: string;
  channelDNA: VisualDNASignature;
  characterStyle: string;
  promptTemplates: string[];
  motionPreferences: string[];
  colorLanguage: string[];
  storyStyle: string;
  assets: Map<string, MemoryAssetEntry>;
}
