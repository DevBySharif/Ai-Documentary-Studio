import type { CharacterLock, ArtStyleLock, LightingStyle } from "./types.js";
import type { ChannelDNA } from "../dna/types.js";
import type { ProjectDNA } from "../project/types.js";

export class ConsistencyManager {
  buildCharacterLock(dna: ChannelDNA): CharacterLock {
    return {
      characterName: dna.visual.characterStyle || "default_character",
      clothing: dna.visual.characterStyle || "minimalist",
      bodyShape: "simple_geometric",
      expressionStyle: "minimalist_abstract",
      artStyle: dna.visual.artStyle || "minimalist_vector",
      poseRules: ["facing_camera", "profile", "gesturing"],
    };
  }

  buildArtStyleLock(channelDNA: ChannelDNA, projectDNA: ProjectDNA): ArtStyleLock {
    const cp = channelDNA.visual.colorPalette;
    return {
      artStyle: channelDNA.visual.artStyle || "minimalist_vector",
      colorPalette: [...(cp.primary || []), ...(cp.accent || [])],
      primaryColors: cp.primary || ["#4A90D9", "#2C3E50"],
      accentColors: cp.accent || ["#E74C3C", "#F1C40F"],
      backgroundStyle: channelDNA.visual.backgroundStyle || "clean_neutral",
      lighting: this.resolveLighting(channelDNA, projectDNA),
      cameraStyle: channelDNA.visual.composition || "cinematic",
      composition: channelDNA.visual.composition || "rule_of_thirds",
      perspective: channelDNA.visual.perspective || "2d_flat",
      outlineThickness: channelDNA.visual.outlineThickness || "medium",
      negativeSpace: channelDNA.visual.negativeSpace || "balanced",
    };
  }

  private resolveLighting(channelDNA: ChannelDNA, projectDNA: ProjectDNA): LightingStyle {
    const base = channelDNA.visual.lighting.default || "soft_diffuse";
    const dramaMap: Record<string, LightingStyle> = {
      dramatic: "dramatic_side",
      calm: "soft_diffuse",
      suspense: "moody_low_key",
      mysterious: "rim_lighting",
      hopeful: "natural_window",
      scientific: "studio_soft",
    };
    return dramaMap[projectDNA.coreEmotion] || (base as LightingStyle);
  }

  generateStyleSuffix(lock: ArtStyleLock, characterLock?: CharacterLock): string {
    const parts: string[] = [];
    parts.push(`Style: ${lock.artStyle}`);
    parts.push(`Colors: ${lock.primaryColors.join(", ")}`);
    parts.push(`Lighting: ${lock.lighting}`);
    parts.push(`Composition: ${lock.composition}`);
    parts.push(`Perspective: ${lock.perspective}`);
    if (characterLock) {
      parts.push(`Character: ${characterLock.characterName}`);
      parts.push(`Expression: ${characterLock.expressionStyle}`);
    }
    return parts.join(", ");
  }
}
