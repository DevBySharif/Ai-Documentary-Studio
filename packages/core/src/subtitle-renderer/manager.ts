import type { SRSubtitleLine, SRWord, SRExportFormat, SRAnimationStyle, SRPosition, SRQualityScore } from "./types.js";
import { SRWordHighlightEngine } from "./word-highlight.js";
import { SRPhraseGrouping } from "./phrase-grouping.js";
import { SRAILineBreakEngine } from "./line-break.js";
import { SRReadingSpeedAnalyzer } from "./reading-speed.js";
import { SRSmartPositioning } from "./smart-positioning.js";
import { SRSafeAreaSystem } from "./safe-area.js";
import { SRFontSystem } from "./font-system.js";
import { SRKeywordEmphasisEngine } from "./keyword-emphasis.js";
import { SRSubtitleAnimations } from "./animations.js";
import { SRExportManager } from "./export.js";
import { SRAISubtitleDirector } from "./ai-director.js";
import { SRAdaptiveKeywordEmphasis } from "./adaptive-emphasis.js";
import { SRVisualCollisionDetector } from "./collision-detector.js";
import { SRSubtitleQualityAnalyzer } from "./quality-analyzer.js";
import { SRSubtitleValidator } from "./validation.js";

export class SRSubtitleRenderingEngine {
  readonly wordHighlight: SRWordHighlightEngine;
  readonly phraseGrouping: SRPhraseGrouping;
  readonly lineBreak: SRAILineBreakEngine;
  readonly readingSpeed: SRReadingSpeedAnalyzer;
  readonly positioning: SRSmartPositioning;
  readonly safeArea: SRSafeAreaSystem;
  readonly fontSystem: SRFontSystem;
  readonly keywordEmphasis: SRKeywordEmphasisEngine;
  readonly animations: SRSubtitleAnimations;
  readonly exportManager: SRExportManager;
  readonly aiDirector: SRAISubtitleDirector;
  readonly adaptiveEmphasis: SRAdaptiveKeywordEmphasis;
  readonly collisionDetector: SRVisualCollisionDetector;
  readonly qualityAnalyzer: SRSubtitleQualityAnalyzer;
  readonly validator: SRSubtitleValidator;

  constructor() {
    this.wordHighlight = new SRWordHighlightEngine();
    this.phraseGrouping = new SRPhraseGrouping();
    this.lineBreak = new SRAILineBreakEngine();
    this.readingSpeed = new SRReadingSpeedAnalyzer();
    this.positioning = new SRSmartPositioning();
    this.safeArea = new SRSafeAreaSystem();
    this.fontSystem = new SRFontSystem();
    this.keywordEmphasis = new SRKeywordEmphasisEngine();
    this.animations = new SRSubtitleAnimations();
    this.exportManager = new SRExportManager();
    this.aiDirector = new SRAISubtitleDirector();
    this.adaptiveEmphasis = new SRAdaptiveKeywordEmphasis();
    this.collisionDetector = new SRVisualCollisionDetector();
    this.qualityAnalyzer = new SRSubtitleQualityAnalyzer();
    this.validator = new SRSubtitleValidator();
  }

  generateLines(
    words: Array<{ text: string; start: number; end: number; confidence: number }>,
    emotion: string,
    sceneBrightness: number,
    faceBox: { x: number; y: number; width: number; height: number } | null = null
  ): { lines: SRSubtitleLine[]; quality: SRQualityScore } {
    const highlighted = this.wordHighlight.generate(words);
    const phrases = this.phraseGrouping.group(highlighted);
    const decision = this.aiDirector.decide(emotion, "hold", sceneBrightness, 0.3, 0.3);
    const position = this.positioning.determinePosition("adaptive", faceBox, sceneBrightness);

    const lines: SRSubtitleLine[] = phrases.map((p) => {
      const lineText = p.text;
      const animation: SRAnimationStyle = decision.animation;
      return {
        text: lineText,
        start: p.start * 1000,
        end: p.end * 1000,
        position,
        x: 0,
        y: position === "bottom" ? 0.88 : position === "top" ? 0.05 : 0.4,
        animation,
        highlightedWord: p.words.find((w) => w.isHighlighted)?.text
      };
    });

    const quality = this.qualityAnalyzer.analyze(lines, words.length, words.length > 0 ? words[words.length - 1].end * 1000 : 0);
    return { lines, quality };
  }

  export(lines: SRSubtitleLine[], format: SRExportFormat): string {
    return this.exportManager.export(lines, format);
  }
}
