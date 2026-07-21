import { DNAValidator, type ValidationReport } from "./validator.js";
import type { ChannelDNA, PromptTemplate, MotionPreset } from "./types.js";
import type { CompiledDNA } from "./types.js";

export type { CompiledDNA };

interface CompilerCache {
  promptTemplates: PromptTemplate[];
  motionPresets: MotionPreset[];
  visualSymbols: Record<string, string>;
  compiledAt: string;
}

export class DNACompiler {
  private cache = new Map<string, CompilerCache>();
  private validator: DNAValidator;

  constructor() {
    this.validator = new DNAValidator();
  }

  compile(dna: ChannelDNA): CompiledDNA {
    const validation = this.validator.validate(dna);
    const cached = this.cache.get(dna.metadata.id);

    if (cached && cached.compiledAt >= dna.metadata.updatedAt) {
      return this.buildFromCache(dna, validation, cached);
    }

    const compiled: CompiledDNA = {
      source: dna,
      compiledAt: new Date().toISOString(),
      version: dna.metadata.version,
      runtime: this.buildRuntimeConfig(dna),
      cache: {
        promptTemplates: this.compilePromptTemplates(dna),
        motionPresets: this.compileMotionPresets(dna),
        visualSymbols: this.compileVisualSymbols(dna),
      },
      validation: {
        passed: validation.passed,
        score: validation.score,
        warnings: validation.warnings,
        errors: validation.errors,
      },
    };

    this.cache.set(dna.metadata.id, {
      promptTemplates: compiled.cache.promptTemplates,
      motionPresets: compiled.cache.motionPresets,
      visualSymbols: compiled.cache.visualSymbols,
      compiledAt: compiled.compiledAt,
    });

    return compiled;
  }

  getFromCache(dnaId: string): CompiledDNA | undefined {
    const cached = this.cache.get(dnaId);
    if (!cached) return undefined;

    return {
      source: {} as ChannelDNA,
      compiledAt: cached.compiledAt,
      version: "",
      runtime: {
        storyConfig: {},
        promptConfig: {},
        editingConfig: {},
        visualConfig: {},
      },
      cache: cached,
      validation: { passed: true, score: 100, warnings: [], errors: [] },
    };
  }

  invalidateCache(dnaId: string): void {
    this.cache.delete(dnaId);
  }

  clearCache(): void {
    this.cache.clear();
  }

  private buildFromCache(
    dna: ChannelDNA,
    validation: ValidationReport,
    cache: CompilerCache
  ): CompiledDNA {
    return {
      source: dna,
      compiledAt: cache.compiledAt,
      version: dna.metadata.version,
      runtime: this.buildRuntimeConfig(dna),
      cache: {
        promptTemplates: cache.promptTemplates,
        motionPresets: cache.motionPresets,
        visualSymbols: cache.visualSymbols,
      },
      validation: {
        passed: validation.passed,
        score: validation.score,
        warnings: validation.warnings,
        errors: validation.errors,
      },
    };
  }

  private buildRuntimeConfig(dna: ChannelDNA): CompiledDNA["runtime"] {
    return {
      storyConfig: {
        formula: dna.story.storyFormula,
        hookFormula: dna.story.hookFormula,
        pacing: dna.story.pacingRules,
        emotionCurve: dna.story.emotionCurve,
        curiosityRules: dna.story.curiosityRules,
        openLoopRules: dna.story.openLoopRules,
      },
      promptConfig: {
        characterLock: dna.prompt.characterLock,
        styleLock: dna.prompt.styleLock,
        imageReuse: dna.prompt.imageReuseRules,
        wordPrompts: dna.prompt.wordPromptRules,
        consistency: dna.prompt.consistencyRules,
      },
      editingConfig: {
        cameraMotion: dna.editing.cameraMotion,
        zoom: dna.editing.zoomRules,
        pan: dna.editing.panRules,
        holdDuration: dna.editing.holdDuration,
        transitions: dna.editing.transitionStyle,
        emotionMapping: dna.editing.emotionMapping,
      },
      visualConfig: {
        artStyle: dna.visual.artStyle,
        colorPalette: dna.visual.colorPalette,
        cameraLanguage: dna.visual.cameraLanguage,
        composition: dna.visual.composition,
        lighting: dna.visual.lighting,
      },
    };
  }

  private compilePromptTemplates(dna: ChannelDNA): PromptTemplate[] {
    const templates = [...dna.promptLibrary.templates];
    const sp = dna.prompt.scenePromptRules;

    for (const [purpose, rule] of Object.entries(sp)) {
      const existing = templates.find((t) => t.name === purpose);
      if (!existing) {
        templates.push({
          id: crypto.randomUUID(),
          name: purpose,
          category: "scene",
          template: rule,
          variables: ["subject", "environment", "emotion"],
        });
      }
    }

    return templates.map((t) => ({
      ...t,
      template: dna.prompt.promptPrefix + " " + t.template + " " + dna.prompt.promptSuffix,
    }));
  }

  private compileMotionPresets(dna: ChannelDNA): MotionPreset[] {
    const presets = [...dna.motionLibrary.presets];
    const emotionMap = dna.editing.emotionMapping;
    const zoomMap = dna.editing.zoomRules.emotionMapping;

    for (const [emotion, rules] of Object.entries(emotionMap)) {
      const existing = presets.find((p) => p.name === emotion);
      if (!existing) {
        presets.push({
          id: crypto.randomUUID(),
          name: emotion,
          narrativeFunction: emotion,
          motionType: rules.motion,
          parameters: {
            transition: rules.transition,
            holdDuration: rules.holdDuration,
            zoomSpeed: zoomMap[emotion]?.speed ?? dna.editing.zoomRules.slowSpeed,
          },
          duration: rules.holdDuration,
        });
      }
    }

    return presets;
  }

  private compileVisualSymbols(dna: ChannelDNA): Record<string, string> {
    return {
      ...dna.visual.visualSymbolism,
      ...Object.fromEntries(
        Object.entries(dna.visualLibrary.symbols).map(([key, sym]) => [
          key,
          sym.promptTemplate,
        ])
      ),
    };
  }
}
