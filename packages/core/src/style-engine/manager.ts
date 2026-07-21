import type { PermanentStyleDNA, CharacterDNAProfile, StyleValidationResult, CharacterValidationResult, PromptSanitizationResult, StructuredPromptDNA, DriftReport, ColorLanguageState, StyleLockState, CharacterLockState, ReferenceBoardEntry, DriftThresholds } from "./types.js";
import { PermanentStyleDNABuilder } from "./style-dna.js";
import { CharacterDNAProfileBuilder } from "./character-dna.js";
import { StyleLockManager, CharacterLockManager } from "./lock-manager.js";
import { ColorLanguageManager } from "./color-language.js";
import { SymbolLibraryManager } from "./symbol-library.js";
import { PromptSanitizer } from "./prompt-sanitizer.js";
import { StyleValidator } from "./style-validator.js";
import { CharacterValidator } from "./character-validator.js";
import { StyleReferenceBoard } from "./reference-board.js";
import { PromptDNACompiler } from "./prompt-compiler.js";
import { StyleDriftDetector } from "./drift-detector.js";

export class StyleConsistencyEngine {
  private styleDNABuilder: PermanentStyleDNABuilder;
  private characterDNABuilder: CharacterDNAProfileBuilder;
  private styleLock: StyleLockManager;
  private characterLock: CharacterLockManager;
  private colorLanguage: ColorLanguageManager;
  private symbols: SymbolLibraryManager;
  private sanitizer: PromptSanitizer;
  private styleValidator: StyleValidator;
  private characterValidator: CharacterValidator;
  private referenceBoard: StyleReferenceBoard;
  private promptCompiler: PromptDNACompiler;
  private driftDetector: StyleDriftDetector;

  constructor() {
    this.styleDNABuilder = new PermanentStyleDNABuilder();
    this.characterDNABuilder = new CharacterDNAProfileBuilder();
    this.styleLock = new StyleLockManager();
    this.characterLock = new CharacterLockManager();
    this.colorLanguage = new ColorLanguageManager();
    this.symbols = new SymbolLibraryManager();
    this.sanitizer = new PromptSanitizer();
    this.styleValidator = new StyleValidator();
    this.characterValidator = new CharacterValidator();
    this.referenceBoard = new StyleReferenceBoard();
    this.promptCompiler = new PromptDNACompiler();
    this.driftDetector = new StyleDriftDetector();
  }

  buildStyleDNA(overrides?: Partial<PermanentStyleDNA>): PermanentStyleDNA {
    return this.styleDNABuilder.build(overrides);
  }

  buildCharacterDNA(overrides?: Partial<CharacterDNAProfile>): CharacterDNAProfile {
    return this.characterDNABuilder.build(overrides);
  }

  buildStyleLock(dna: PermanentStyleDNA): StyleLockState {
    return this.styleLock.buildFromDNA(dna);
  }

  buildCharacterLock(dna: CharacterDNAProfile): CharacterLockState {
    return this.characterLock.buildFromDNA(dna);
  }

  buildColorLanguage(overrides?: Partial<ColorLanguageState>): ColorLanguageState {
    return this.colorLanguage.build(overrides);
  }

  sanitizePrompt(
    rawPrompt: string,
    styleLock: StyleLockState,
    characterLock: CharacterLockState,
    colorLanguage: ColorLanguageState
  ): PromptSanitizationResult {
    return this.sanitizer.sanitize(rawPrompt, styleLock, characterLock, colorLanguage);
  }

  validateStyle(generated: Record<string, string>, reference: PermanentStyleDNA): StyleValidationResult {
    return this.styleValidator.validate(generated, reference);
  }

  validateCharacter(detected: Partial<CharacterDNAProfile>, reference: CharacterDNAProfile): CharacterValidationResult {
    return this.characterValidator.validate(detected, reference);
  }

  compilePrompt(
    sceneIntent: string,
    visualIntent: string,
    styleDNA: PermanentStyleDNA,
    characterDNA: CharacterDNAProfile
  ): StructuredPromptDNA {
    return this.promptCompiler.compile(sceneIntent, visualIntent, styleDNA, characterDNA);
  }

  detectDrift(projectId: string, thresholds?: DriftThresholds): DriftReport {
    return this.driftDetector.detect(projectId, thresholds);
  }

  recordDriftSnapshot(
    assetId: string,
    lineThickness: number,
    proportions: number,
    perspective: string,
    lighting: string,
    background: string,
    colorPalette: string[]
  ): void {
    this.driftDetector.record(assetId, {
      assetId, lineThickness, proportions, perspective, lighting, background, colorPalette,
    });
  }

  getSymbolLibrary(): SymbolLibraryManager {
    return this.symbols;
  }

  getReferenceBoard(): StyleReferenceBoard {
    return this.referenceBoard;
  }

  getColorLanguage(): ColorLanguageManager {
    return this.colorLanguage;
  }

  getStyleLockManager(): StyleLockManager {
    return this.styleLock;
  }

  getCharacterLockManager(): CharacterLockManager {
    return this.characterLock;
  }

  getStyleDNABuilder(): PermanentStyleDNABuilder {
    return this.styleDNABuilder;
  }

  getCharacterDNABuilder(): CharacterDNAProfileBuilder {
    return this.characterDNABuilder;
  }
}
