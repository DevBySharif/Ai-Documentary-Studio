import type { DNASection } from "./types.js";

export class DNAStructure {
  private defaults: DNASection = {
    identity: {}, storyRules: {}, scriptRules: {}, promptRules: {},
    artStyle: {}, characterRules: {}, sceneRules: {}, motionRules: {},
    subtitleRules: {}, audioRules: {}, qaRules: {}, exportRules: {}
  };

  create(custom?: Partial<DNASection>): DNASection {
    return { ...this.defaults, ...custom };
  }

  getSectionNames(): string[] {
    return Object.keys(this.defaults);
  }

  getDefault(key: keyof DNASection): Record<string, unknown> {
    return { ...this.defaults[key] };
  }
}
