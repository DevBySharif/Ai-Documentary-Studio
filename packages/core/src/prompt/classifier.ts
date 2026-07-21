import type { ImageType } from "./types.js";
import type { ScenePurpose } from "../narrative/types.js";

const PURPOSE_TO_IMAGE_TYPE: Record<string, ImageType> = {
  hook: "master_scene",
  context: "supporting_scene",
  explain: "master_scene",
  reveal: "symbolic_visual",
  evidence: "supporting_scene",
  summarize: "master_scene",
  cta: "master_scene",
  transition: "transition_visual",
};

const VISUAL_INTENT_TO_IMAGE_TYPE: Record<string, ImageType> = {
  new_scene: "master_scene",
  image_reuse: "supporting_scene",
  symbolic_visual: "symbolic_visual",
  word_level_insert: "word_visual",
  diagram: "supporting_scene",
  close_up: "supporting_scene",
  wide_shot: "master_scene",
  motion_graphics: "transition_visual",
};

export class ImageClassifier {
  classifyByPurpose(purpose: ScenePurpose): ImageType {
    return PURPOSE_TO_IMAGE_TYPE[purpose] || "supporting_scene";
  }

  classifyByVisualIntent(visualIntent: string): ImageType {
    return VISUAL_INTENT_TO_IMAGE_TYPE[visualIntent] || "supporting_scene";
  }

  isMasterType(imageType: ImageType): boolean {
    return imageType === "master_scene";
  }

  requiresNewImage(imageType: ImageType): boolean {
    return imageType === "master_scene" || imageType === "word_visual";
  }
}
