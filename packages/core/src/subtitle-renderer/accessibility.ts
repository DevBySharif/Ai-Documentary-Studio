export interface SRAccessibilityConfig {
  highContrast: boolean;
  fontSizeScale: number;
  subtitleBackground: boolean;
  speakerLabels: boolean;
  soundDescriptions: boolean;
  captionMode: "auto" | "manual" | "hybrid";
}

export class SRAccessibilityEngine {
  private config: SRAccessibilityConfig = {
    highContrast: false,
    fontSizeScale: 1,
    subtitleBackground: true,
    speakerLabels: false,
    soundDescriptions: false,
    captionMode: "auto"
  };

  configure(config: Partial<SRAccessibilityConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): SRAccessibilityConfig {
    return { ...this.config };
  }

  getFontSize(baseSize: number): number {
    return baseSize * this.config.fontSizeScale;
  }

  getTextColor(baseColor: string): string {
    if (!this.config.highContrast) return baseColor;
    return "#FFFFFF";
  }

  getBackgroundColor(): string | null {
    if (!this.config.subtitleBackground) return null;
    if (this.config.highContrast) return "rgba(0,0,0,0.9)";
    return "rgba(0,0,0,0.6)";
  }

  addSpeakerLabel(text: string, speaker: string): string {
    if (!this.config.speakerLabels) return text;
    return `[${speaker}] ${text}`;
  }

  addSoundDescription(description: string): string | null {
    if (!this.config.soundDescriptions) return null;
    return `[${description}]`;
  }

  enableHighContrast(): void {
    this.config.highContrast = true;
    this.config.subtitleBackground = true;
  }

  enableSpeakerLabels(): void {
    this.config.speakerLabels = true;
  }

  enableSoundDescriptions(): void {
    this.config.soundDescriptions = true;
  }
}
