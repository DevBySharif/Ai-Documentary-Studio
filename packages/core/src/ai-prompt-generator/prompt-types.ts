export type TargetImageModel =
  | "GPTImage"
  | "FLUX"
  | "SDXL"
  | "Imagen"
  | "Midjourney"
  | "Ideogram"
  | "Generic";

export type VisualStyle =
  | "RealisticDocumentary"
  | "VintageArchive"
  | "OilPainting"
  | "CinematicRealism"
  | "MinimalIllustration"
  | "Watercolor"
  | "Blueprint"
  | "Infographic";

export interface CharacterProfile {
  readonly characterId: string;
  readonly name: string;
  readonly age: string;
  readonly ethnicity: string;
  readonly facialFeatures: string;
  readonly clothing: string;
  readonly hairstyle: string;
}

export interface PromptComponents {
  readonly subject: string;
  readonly action: string;
  readonly environment: string;
  readonly timePeriod: string;
  readonly mood: string;
  readonly composition: string;
  readonly cameraAngle: string;
  readonly lens: string;
  readonly lighting: string;
  readonly colorPalette: string;
  readonly visualStyle: VisualStyle;
  readonly historicalConstraints: ReadonlyArray<string>;
  readonly technicalInstructions: string;
}

export interface CompiledPrompt {
  readonly promptId: string;
  readonly targetModel: TargetImageModel;
  readonly positivePrompt: string;
  readonly negativePrompt?: string;
  readonly modelParameters?: Record<string, unknown>;
  readonly version: number;
}
