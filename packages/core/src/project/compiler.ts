import { ProjectValidator } from "./validator.js";
import type { ProjectDNA, CompiledProjectProfile } from "./types.js";

interface CompilerCache {
  metaphorLookup: Record<string, string>;
  colorMap: Record<string, string[]>;
  cameraMap: Record<string, string>;
  compiledAt: string;
}

export class ProjectCompiler {
  private cache = new Map<string, CompilerCache>();
  private validator: ProjectValidator;

  constructor() {
    this.validator = new ProjectValidator();
  }

  compile(dna: ProjectDNA): CompiledProjectProfile {
    const validation = this.validator.validate(dna);
    const cached = this.cache.get(dna.metadata.id);

    if (cached && cached.compiledAt >= dna.metadata.updatedAt) {
      return this.buildFromCache(dna, validation, cached);
    }

    const metaphorLookup: Record<string, string> = {};
    for (const entry of dna.metaphorLibrary) {
      metaphorLookup[entry.concept] = entry.promptTemplate;
    }

    const colorMap: Record<string, string[]> = {};
    colorMap.dominant = dna.colorLanguage.dominant;
    colorMap.accent = dna.colorLanguage.accent;
    colorMap.background = dna.colorLanguage.background;

    const cameraMap: Record<string, string> = {};
    cameraMap.reflection = dna.cameraLanguage.reflection;
    cameraMap.explanation = dna.cameraLanguage.explanation;
    cameraMap.concept = dna.cameraLanguage.concept;
    cameraMap.emotion = dna.cameraLanguage.emotion;
    cameraMap.default = dna.cameraLanguage.default;

    const compiled: CompiledProjectProfile = {
      source: dna,
      compiledAt: new Date().toISOString(),
      version: dna.metadata.version,
      runtime: {
        identity: dna.identity as unknown as Record<string, unknown>,
        emotion: {
          core: dna.coreEmotion,
          timeline: dna.blueprint.emotionTimeline,
        } as unknown as Record<string, unknown>,
        visual: {
          objective: dna.visualObjective,
          color: dna.colorLanguage,
          camera: dna.cameraLanguage,
        } as unknown as Record<string, unknown>,
        editing: {
          objective: dna.editingObjective,
          pacing: dna.pacing,
        } as unknown as Record<string, unknown>,
        pacing: dna.pacing as unknown as Record<string, unknown>,
        intelligence: dna.intelligence,
      },
      cache: {
        metaphorLookup,
        colorMap,
        cameraMap,
        avoidSet: new Set(dna.intelligence.avoidList),
        patternSet: new Set(dna.intelligence.preferredPatterns),
      },
      validation: {
        passed: validation.passed,
        score: validation.score,
        checks: validation.checks,
      },
    };

    this.cache.set(dna.metadata.id, {
      metaphorLookup,
      colorMap,
      cameraMap,
      compiledAt: compiled.compiledAt,
    });

    return compiled;
  }

  invalidateCache(projectId: string): void {
    this.cache.delete(projectId);
  }

  private buildFromCache(
    dna: ProjectDNA,
    validation: { passed: boolean; score: number; checks: Array<{ field: string; status: "pass" | "warn" | "fail"; message: string }> },
    cache: CompilerCache
  ): CompiledProjectProfile {
    return {
      source: dna,
      compiledAt: cache.compiledAt,
      version: dna.metadata.version,
      runtime: {
        identity: dna.identity as unknown as Record<string, unknown>,
        emotion: { core: dna.coreEmotion },
        visual: { objective: dna.visualObjective },
        editing: { objective: dna.editingObjective },
        pacing: dna.pacing as unknown as Record<string, unknown>,
        intelligence: dna.intelligence,
      },
      cache: {
        metaphorLookup: cache.metaphorLookup,
        colorMap: cache.colorMap,
        cameraMap: cache.cameraMap,
        avoidSet: new Set(dna.intelligence.avoidList),
        patternSet: new Set(dna.intelligence.preferredPatterns),
      },
      validation: {
        passed: validation.passed,
        score: validation.score,
        checks: validation.checks,
      },
    };
  }
}
