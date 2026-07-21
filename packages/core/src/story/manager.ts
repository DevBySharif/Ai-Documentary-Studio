import { StoryGenerator, type StoryGeneratorInput } from "./generator.js";
import { ScriptValidator } from "./validator.js";
import type { StoryScript, ScriptValidationReport } from "./types.js";

export class StoryManager {
  private generator: StoryGenerator;
  private validator: ScriptValidator;
  private scripts = new Map<string, StoryScript>();

  constructor() {
    this.generator = new StoryGenerator();
    this.validator = new ScriptValidator();
  }

  generate(input: StoryGeneratorInput): StoryScript {
    const script = this.generator.generate(input);
    this.scripts.set(script.metadata.id, script);
    return script;
  }

  get(id: string): StoryScript | undefined {
    return this.scripts.get(id);
  }

  validate(script: StoryScript, targetRuntime: number, blueprintSceneCount: number): ScriptValidationReport {
    return this.validator.validate(script, targetRuntime, blueprintSceneCount);
  }

  approve(id: string): boolean {
    const script = this.scripts.get(id);
    if (!script) return false;
    const report = this.validator.validate(script, script.metadata.runtime, script.metadata.totalScenes);
    if (report.passed) {
      script.metadata.validated = true;
      script.metadata.validationScore = report.score;
      return true;
    }
    return false;
  }
}
