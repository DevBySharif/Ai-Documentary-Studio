import { NarrativePlanner, type NarrativePlannerInput } from "./planner.js";
import { NarrativeValidator, type NarrativeValidationReport } from "./validator.js";
import type { NarrativeBlueprint } from "./types.js";
import type { ProjectDNA } from "../project/types.js";
import type { ChannelDNA } from "../dna/types.js";

export class NarrativeManager {
  private planner: NarrativePlanner;
  private validator: NarrativeValidator;
  private blueprints = new Map<string, NarrativeBlueprint>();

  constructor() {
    this.planner = new NarrativePlanner();
    this.validator = new NarrativeValidator();
  }

  generate(input: NarrativePlannerInput): NarrativeBlueprint {
    const blueprint = this.planner.plan(input);
    this.blueprints.set(blueprint.metadata.id, blueprint);
    return blueprint;
  }

  get(id: string): NarrativeBlueprint | undefined {
    return this.blueprints.get(id);
  }

  validate(id: string): NarrativeValidationReport | null {
    const blueprint = this.blueprints.get(id);
    if (!blueprint) return null;
    const report = this.validator.validate(blueprint);
    blueprint.metadata.validated = report.passed;
    blueprint.metadata.validationScore = report.score;
    return report;
  }

  validateBlueprint(blueprint: NarrativeBlueprint): NarrativeValidationReport {
    return this.validator.validate(blueprint);
  }

  approve(id: string): boolean {
    const blueprint = this.blueprints.get(id);
    if (!blueprint) return false;
    const report = this.validator.validate(blueprint);
    if (report.passed) {
      blueprint.metadata.validated = true;
      blueprint.metadata.validationScore = report.score;
      return true;
    }
    return false;
  }
}
