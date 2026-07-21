export type ASTheme = 'dark' | 'light' | 'system';

export interface ASAppearanceData {
  theme: ASTheme;
  accentColor: string;
  uiScaling: number;
  fontSize: number;
}

const DEFAULTS: ASAppearanceData = {
  theme: 'system',
  accentColor: '#6366f1',
  uiScaling: 100,
  fontSize: 14,
};

export class ASAppearance {
  private settings: ASAppearanceData;

  constructor() {
    this.settings = this.clone(DEFAULTS);
  }

  setTheme(theme: ASTheme): void {
    this.settings.theme = theme;
  }

  getTheme(): ASTheme {
    return this.settings.theme;
  }

  setAccentColor(color: string): void {
    this.settings.accentColor = color;
  }

  getAccentColor(): string {
    return this.settings.accentColor;
  }

  setUiScaling(scaling: number): void {
    this.settings.uiScaling = Math.max(50, Math.min(200, scaling));
  }

  setFontSize(size: number): void {
    this.settings.fontSize = Math.max(8, Math.min(48, size));
  }

  getAll(): ASAppearanceData {
    return this.clone(this.settings);
  }

  resetToDefaults(): void {
    this.settings = this.clone(DEFAULTS);
  }

  private clone<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }
}
