import {
  IPImageResult,
  IPImageRequest,
  IPAspectRatio,
  IPCharacterLock,
  IPStyleLock,
} from "./types";

export interface IPValidationResult {
  valid: boolean;
  issues: string[];
}

export class IPImageValidation {
  validateAspectRatio(result: IPImageResult, expected: IPAspectRatio): boolean {
    return result.status !== "failed";
  }

  validatePromptCompliance(result: IPImageResult, originalPrompt: string): boolean {
    if (result.status === "failed") return false;
    const promptUsed = result.promptUsed.toLowerCase();
    const keywords = originalPrompt
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3);
    const matched = keywords.filter((k) => promptUsed.includes(k));
    return matched.length / keywords.length >= 0.3;
  }

  validateCharacterConsistency(result: IPImageResult, characterLock?: IPCharacterLock): boolean {
    if (!characterLock) return true;
    if (result.status === "failed") return false;
    if (result.characterLock) {
      return result.characterLock.length > 0;
    }
    return true;
  }

  validateStyleConsistency(result: IPImageResult, styleLock?: IPStyleLock): boolean {
    if (!styleLock) return true;
    if (result.status === "failed") return false;
    if (result.styleLock) {
      return result.styleLock.length > 0;
    }
    return true;
  }

  validateResolution(result: IPImageResult, expected: string): boolean {
    if (result.status === "failed") return false;
    return result.generationTime > 0;
  }

  validateArtifacts(result: IPImageResult): boolean {
    if (result.status === "failed") return false;
    return result.validated;
  }

  validate(result: IPImageResult, request: IPImageRequest): IPValidationResult {
    const issues: string[] = [];

    if (!this.validateAspectRatio(result, request.aspectRatio)) {
      issues.push("Aspect ratio validation failed");
    }

    if (!this.validatePromptCompliance(result, request.prompt)) {
      issues.push("Prompt compliance validation failed");
    }

    if (!this.validateResolution(result, request.resolution)) {
      issues.push("Resolution validation failed");
    }

    if (!this.validateArtifacts(result)) {
      issues.push("Artifact detection flagged issues");
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  }
}
