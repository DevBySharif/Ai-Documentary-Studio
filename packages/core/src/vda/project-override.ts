import type { VisualDNAProfile, DefaultFraming } from "./types.js";
import type { ProjectDNA } from "../project/types.js";

export interface VisualOverride {
  colorMood?: string[];
  lightingMood?: string;
  cameraPreference?: DefaultFraming;
  symbolSet?: string[];
  visualDensity?: "minimal" | "balanced" | "detailed";
}

export class ProjectOverrideManager {
  apply(profile: VisualDNAProfile, projectDNA: ProjectDNA): VisualDNAProfile {
    const override = this.extractOverrides(projectDNA);
    if (!override) return profile;

    const result = { ...profile };

    if (override.colorMood) {
      result.colors = {
        ...result.colors,
        primary: [...override.colorMood],
      };
    }

    if (override.lightingMood) {
      result.lighting = {
        ...result.lighting,
        mood: override.lightingMood as any,
      };
    }

    if (override.cameraPreference) {
      result.camera = {
        ...result.camera,
        default: override.cameraPreference,
      };
    }

    if (override.symbolSet) {
      result.metaphors = result.metaphors.filter(
        (m) => override.symbolSet!.includes(m.concept)
      );
    }

    if (override.visualDensity) {
      result.environment = {
        ...result.environment,
        objectDensity: override.visualDensity,
      };
      result.complexity = override.visualDensity === "detailed" ? "detailed" :
        override.visualDensity === "minimal" ? "simple" : "medium";
    }

    return result;
  }

  private extractOverrides(projectDNA: ProjectDNA): VisualOverride | null {
    const overrides: VisualOverride = {};
    let hasOverride = false;

    if (projectDNA.colorLanguage) {
      const moodColors = projectDNA.colorLanguage.dominant;
      if (moodColors && moodColors.length > 0) {
        overrides.colorMood = moodColors;
        hasOverride = true;
      }
    }

    const emotion = projectDNA.coreEmotion;
    const lightMoodMap: Record<string, string> = {
      curiosity: "calm",
      fear: "dramatic",
      wonder: "warm",
      hope: "warm",
      suspense: "dramatic",
      calm: "neutral",
      mystery: "dramatic",
      urgency: "dramatic",
      reflection: "calm",
    };

    if (lightMoodMap[emotion]) {
      overrides.lightingMood = lightMoodMap[emotion];
      hasOverride = true;
    }

    if (projectDNA.visualObjective) {
      const visualMap: Record<string, DefaultFraming> = {
        minimal: "wide_shot",
        symbolic: "close_up",
        scientific: "medium_shot",
        cinematic: "wide_shot",
        emotional: "close_up",
      };
      const framing = visualMap[projectDNA.visualObjective];
      if (framing) {
        overrides.cameraPreference = framing;
        hasOverride = true;
      }
    }

    if (projectDNA.editingObjective === "cinematic" && !overrides.visualDensity) {
      overrides.visualDensity = "detailed";
      hasOverride = true;
    }
    if (projectDNA.editingObjective === "minimal") {
      overrides.visualDensity = "minimal";
      hasOverride = true;
    }

    return hasOverride ? overrides : null;
  }
}
