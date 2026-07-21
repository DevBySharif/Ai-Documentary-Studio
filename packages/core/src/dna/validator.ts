import type { ChannelDNA } from "./types.js";

export interface ValidationReport {
  passed: boolean;
  score: number;
  checks: Array<{
    section: string;
    field: string;
    status: "pass" | "warn" | "fail";
    message: string;
  }>;
  warnings: string[];
  errors: string[];
}

export class DNAValidator {
  validate(dna: ChannelDNA): ValidationReport {
    const checks: ValidationReport["checks"] = [];
    const warnings: string[] = [];
    const errors: string[] = [];

    this.checkMetadata(dna, checks, errors);
    this.checkGeneral(dna, checks, errors);
    this.checkStory(dna, checks, warnings);
    this.checkVisual(dna, checks, warnings);
    this.checkPrompt(dna, checks, warnings);
    this.checkEditing(dna, checks, warnings);
    this.checkResearch(dna, checks, warnings);
    this.checkAudio(dna, checks, warnings);
    this.checkThumbnail(dna, checks, warnings);
    this.checkSeo(dna, checks, warnings);
    this.checkQuality(dna, checks, errors);
    this.checkLibraries(dna, checks, warnings);
    this.checkContradictions(dna, checks, warnings);

    const total = checks.length;
    const passed = checks.filter((c) => c.status === "pass").length;
    const score = total > 0 ? Math.round((passed / total) * 100) : 100;

    return {
      passed: errors.length === 0,
      score,
      checks,
      warnings,
      errors,
    };
  }

  private checkMetadata(
    dna: ChannelDNA,
    checks: ValidationReport["checks"],
    errors: string[]
  ): void {
    const m = dna.metadata;
    if (!m.id) { errors.push("Missing metadata.id"); }
    if (!m.name) { errors.push("Missing metadata.name"); }
    if (!m.version) { errors.push("Missing metadata.version"); }

    checks.push({
      section: "metadata",
      field: "id",
      status: m.id ? "pass" : "fail",
      message: m.id ? `ID: ${m.id}` : "Missing DNA ID",
    });
    checks.push({
      section: "metadata",
      field: "version",
      status: m.version ? "pass" : "fail",
      message: m.version ? `Version: ${m.version}` : "Missing version",
    });

    if (m.parentId) {
      checks.push({
        section: "metadata",
        field: "inheritance",
        status: "pass",
        message: `Inherits from: ${m.parentId}`,
      });
    }
  }

  private checkGeneral(
    dna: ChannelDNA,
    checks: ValidationReport["checks"],
    errors: string[]
  ): void {
    const required: Array<keyof typeof dna.general> = [
      "channelName", "targetAudience", "writingDifficulty",
    ];
    for (const field of required) {
      const value = dna.general[field];
      const valid = value !== undefined && value !== null && value !== "";
      if (!valid) errors.push(`Missing general.${field}`);
      checks.push({
        section: "general",
        field,
        status: valid ? "pass" : "fail",
        message: valid ? `${field}: ${value}` : `Missing ${field}`,
      });
    }
  }

  private checkStory(
    dna: ChannelDNA,
    checks: ValidationReport["checks"],
    warnings: string[]
  ): void {
    const s = dna.story;
    if (!s.storyFormula) warnings.push("Story: no story formula defined");
    if (!s.hookFormula) warnings.push("Story: no hook formula defined");
    if (!s.emotionCurve || s.emotionCurve.length === 0) {
      warnings.push("Story: no emotion curve defined");
    }
    checks.push({
      section: "story",
      field: "formulas",
      status: s.storyFormula && s.hookFormula ? "pass" : "warn",
      message: s.storyFormula ? `Formula: ${s.storyFormula}` : "Incomplete story formulas",
    });
    checks.push({
      section: "story",
      field: "pacing",
      status: s.pacingRules.averageSceneLength > 0 ? "pass" : "warn",
      message: `Scene length: ${s.pacingRules.averageSceneLength}s`,
    });
  }

  private checkVisual(
    dna: ChannelDNA,
    checks: ValidationReport["checks"],
    warnings: string[]
  ): void {
    const v = dna.visual;
    if (!v.artStyle) warnings.push("Visual: no art style defined");
    if (!v.colorPalette.primary || v.colorPalette.primary.length === 0) {
      warnings.push("Visual: no primary color palette");
    }
    checks.push({
      section: "visual",
      field: "artStyle",
      status: v.artStyle ? "pass" : "warn",
      message: v.artStyle || "No art style defined",
    });
    checks.push({
      section: "visual",
      field: "colorPalette",
      status: v.colorPalette.primary.length > 0 ? "pass" : "warn",
      message: `${v.colorPalette.primary.length} primary colors`,
    });
  }

  private checkPrompt(
    dna: ChannelDNA,
    checks: ValidationReport["checks"],
    warnings: string[]
  ): void {
    const p = dna.prompt;
    if (!p.promptPrefix && !p.promptSuffix) {
      warnings.push("Prompt: no prefix or suffix defined");
    }
    if (p.negativePrompt.length === 0) {
      warnings.push("Prompt: no negative prompts defined");
    }
    checks.push({
      section: "prompt",
      field: "structure",
      status: p.promptPrefix || p.promptSuffix ? "pass" : "warn",
      message: "Prefix/suffix: " + (p.promptPrefix ? "yes" : "no"),
    });
    checks.push({
      section: "prompt",
      field: "characterLock",
      status: p.characterLock.enabled ? "pass" : "warn",
      message: p.characterLock.enabled
        ? `Lock mode: ${p.characterLock.mode}`
        : "Character lock disabled",
    });
  }

  private checkEditing(
    dna: ChannelDNA,
    checks: ValidationReport["checks"],
    warnings: string[]
  ): void {
    const e = dna.editing;
    if (!e.cameraMotion.default) warnings.push("Editing: no default camera motion");
    if (e.holdDuration.minimum <= 0) warnings.push("Editing: invalid minimum hold duration");
    checks.push({
      section: "editing",
      field: "cameraMotion",
      status: e.cameraMotion.default ? "pass" : "warn",
      message: `Default motion: ${e.cameraMotion.default || "none"}`,
    });
  }

  private checkResearch(
    dna: ChannelDNA,
    checks: ValidationReport["checks"],
    warnings: string[]
  ): void {
    const r = dna.research;
    if (r.preferredSources.length === 0) warnings.push("Research: no preferred sources");
    checks.push({
      section: "research",
      field: "sources",
      status: r.preferredSources.length > 0 ? "pass" : "warn",
      message: `${r.preferredSources.length} source types`,
    });
  }

  private checkAudio(
    dna: ChannelDNA,
    checks: ValidationReport["checks"],
    warnings: string[]
  ): void {
    const a = dna.audio;
    if (!a.preferredVoice.voiceId) warnings.push("Audio: no voice selected");
    checks.push({
      section: "audio",
      field: "voice",
      status: a.preferredVoice.voiceId ? "pass" : "warn",
      message: a.preferredVoice.voiceId
        ? `Voice: ${a.preferredVoice.voiceId}`
        : "No voice selected",
    });
  }

  private checkThumbnail(
    dna: ChannelDNA,
    checks: ValidationReport["checks"],
    warnings: string[]
  ): void {
    const t = dna.thumbnail;
    if (!t.formula) warnings.push("Thumbnail: no formula defined");
    checks.push({
      section: "thumbnail",
      field: "formula",
      status: t.formula ? "pass" : "warn",
      message: t.formula || "No formula defined",
    });
  }

  private checkSeo(
    dna: ChannelDNA,
    checks: ValidationReport["checks"],
    warnings: string[]
  ): void {
    const s = dna.seo;
    if (!s.titleFormula) warnings.push("SEO: no title formula defined");
    checks.push({
      section: "seo",
      field: "titleFormula",
      status: s.titleFormula ? "pass" : "warn",
      message: s.titleFormula || "No title formula",
    });
  }

  private checkQuality(
    dna: ChannelDNA,
    checks: ValidationReport["checks"],
    errors: string[]
  ): void {
    const q = dna.quality;
    const t = q.thresholds;
    if (t.characterConsistency < 0 || t.characterConsistency > 100) {
      errors.push("Quality: characterConsistency out of range (0-100)");
    }
    if (t.artStyleConsistency < 0 || t.artStyleConsistency > 100) {
      errors.push("Quality: artStyleConsistency out of range (0-100)");
    }
    if (!q.onFailure) errors.push("Quality: no failure strategy defined");
    checks.push({
      section: "quality",
      field: "thresholds",
      status: errors.length === 0 ? "pass" : "fail",
      message: `Character: ${t.characterConsistency}%, Style: ${t.artStyleConsistency}%`,
    });
  }

  private checkLibraries(
    dna: ChannelDNA,
    checks: ValidationReport["checks"],
    warnings: string[]
  ): void {
    const vl = dna.visualLibrary;
    if (vl.characters.length === 0) warnings.push("Visual Library: no characters defined");
    if (vl.symbols && Object.keys(vl.symbols).length === 0) {
      warnings.push("Visual Library: no symbols defined");
    }
    checks.push({
      section: "visualLibrary",
      field: "characters",
      status: vl.characters.length > 0 ? "pass" : "warn",
      message: `${vl.characters.length} characters`,
    });
  }

  private checkContradictions(
    dna: ChannelDNA,
    checks: ValidationReport["checks"],
    warnings: string[]
  ): void {
    if (dna.prompt.imageReuseRules.strategy === "prefer_new" &&
        dna.editing.holdDuration.maximum > 15) {
      warnings.push("Contradiction: prefer_new images + long hold durations = limited visual variety");
    }
    if (dna.story.pacingRules.averageSceneLength > 120 &&
        dna.editing.holdDuration.maximum < 5) {
      warnings.push("Contradiction: long scenes + short holds = excessive image changes");
    }
    checks.push({
      section: "contradictions",
      field: "crossSection",
      status: warnings.length === 0 ? "pass" : "warn",
      message: warnings.length > 0
        ? `${warnings.length} potential contradictions`
        : "No contradictions detected",
    });
  }
}
