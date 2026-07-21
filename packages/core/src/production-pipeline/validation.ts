import type { ValidationResult, ProductionStage, PipelineInput } from "./types.js";

export class PipelineValidator {
  validate(input: PipelineInput): ValidationResult[] {
    const results: ValidationResult[] = [];

    results.push(this.validateTimeline(input));
    results.push(this.validateAssets(input));
    results.push(this.validateAudio(input));
    results.push(this.validateMotion(input));
    results.push(this.validateSubtitles(input));
    results.push(this.validateEffects(input));
    results.push(this.validateExportProfile(input));

    return results;
  }

  private validateTimeline(input: PipelineInput): ValidationResult {
    const errors: string[] = [];
    if (!input.masterTimeline) errors.push("Missing master timeline");
    return { stage: "asset_loader", valid: errors.length === 0, errors, warnings: [] };
  }

  private validateAssets(input: PipelineInput): ValidationResult {
    const errors: string[] = [];
    if (!input.approvedImages || input.approvedImages.length === 0) errors.push("No approved images");
    return { stage: "scene_builder", valid: errors.length === 0, errors, warnings: [] };
  }

  private validateAudio(input: PipelineInput): ValidationResult {
    const errors: string[] = [];
    if (!input.voiceTrack) errors.push("Missing voice track");
    return { stage: "audio_builder", valid: errors.length === 0, errors, warnings: [] };
  }

  private validateMotion(input: PipelineInput): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!input.motionTimeline) warnings.push("No motion timeline, using defaults");
    return { stage: "motion_builder", valid: true, errors, warnings };
  }

  private validateSubtitles(input: PipelineInput): ValidationResult {
    const errors: string[] = [];
    if (!input.subtitleTimeline) errors.push("Missing subtitle timeline");
    return { stage: "subtitle_builder", valid: errors.length === 0, errors, warnings: [] };
  }

  private validateEffects(_input: PipelineInput): ValidationResult {
    return { stage: "effects_builder", valid: true, errors: [], warnings: [] };
  }

  private validateExportProfile(input: PipelineInput): ValidationResult {
    const errors: string[] = [];
    if (!input.renderProfile) errors.push("Missing render profile");
    return { stage: "encoder", valid: errors.length === 0, errors, warnings: [] };
  }
}
