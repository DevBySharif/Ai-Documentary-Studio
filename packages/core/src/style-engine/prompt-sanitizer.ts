import type { PromptSanitizationResult, StyleLockState, CharacterLockState, ColorLanguageState } from "./types.js";

const CONFLICTING_PATTERNS = [
  "anime", "manga", "cartoon", "3d", "photorealistic", "realistic",
  "oil painting", "watercolor", "pastel", "pencil sketch", "charcoal",
  "vibrant", "neon", "rainbow", "graffiti", "pixel art", "low poly",
  "cyberpunk", "steampunk", "fantasy", "medieval", "retro",
];

const CONFLICTING_CHARACTER_DESCRIPTIONS = [
  "realistic face", "detailed eyes", "photorealistic skin",
  "detailed hair", "realistic hands", "detailed clothing",
  "3d render", "high polygon",
];

export class PromptSanitizer {
  sanitize(prompt: string, styleLock: StyleLockState, _characterLock: CharacterLockState, _colorLanguage: ColorLanguageState): PromptSanitizationResult {
    if (!prompt) throw new Error("Prompt string is required");
    if (!styleLock) throw new Error("StyleLockState is required");

    const removedElements: string[] = [];
    const warnings: string[] = [];
    let sanitized = prompt;

    for (const pattern of CONFLICTING_PATTERNS) {
      if (sanitized.toLowerCase().includes(pattern)) {
        const regex = new RegExp(pattern, "gi");
        sanitized = sanitized.replace(regex, "");
        removedElements.push(pattern);
      }
    }

    for (const pattern of CONFLICTING_CHARACTER_DESCRIPTIONS) {
      if (sanitized.toLowerCase().includes(pattern)) {
        const regex = new RegExp(pattern, "gi");
        sanitized = sanitized.replace(regex, "");
        removedElements.push(pattern);
      }
    }

    sanitized = sanitized.replace(/\s+/g, " ").trim();

    const artStyleStr = (styleLock.artStyle ?? "minimal_documentary_stick").replace(/_/g, " ");
    const lightingStr = (styleLock.lighting ?? "soft_cinematic").replace(/_/g, " ");

    if (!sanitized.toLowerCase().includes(artStyleStr)) {
      sanitized += `, ${artStyleStr}`;
    }

    if (!sanitized.toLowerCase().includes(lightingStr)) {
      sanitized += `, ${lightingStr} lighting`;
    }

    if (removedElements.length > 0) {
      warnings.push(`Removed conflicting styles: ${removedElements.join(", ")}`);
    }

    if (prompt !== sanitized) {
      warnings.push("Prompt was modified to enforce channel DNA consistency");
    }

    return { originalPrompt: prompt, sanitizedPrompt: sanitized, removedElements, warnings };
  }
}
