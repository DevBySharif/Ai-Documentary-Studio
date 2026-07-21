import { VisualDNACompiler } from "./compiler.js";
import { MetaphorLibrary } from "./metaphor.js";
import { VisualGrammarEngine } from "./grammar.js";
import { ConsistencyEngine } from "./consistency.js";
import { VisualValidator } from "./validator.js";
import { ProjectOverrideManager } from "./project-override.js";
import { createZennProfile } from "./zenn.js";
import type { VisualDNAProfile } from "./types.js";
import type { ChannelDNA } from "../dna/types.js";
import type { ProjectDNA } from "../project/types.js";

export class VisualDNAManager {
  private compiler: VisualDNACompiler;
  private projectOverride: ProjectOverrideManager;
  private profiles = new Map<string, VisualDNAProfile>();
  public validator: VisualValidator;
  public consistency: ConsistencyEngine;

  constructor() {
    this.compiler = new VisualDNACompiler();
    this.projectOverride = new ProjectOverrideManager();
    this.validator = new VisualValidator();
    this.consistency = new ConsistencyEngine();
  }

  compile(channelDNA: ChannelDNA): VisualDNAProfile {
    const profile = this.compiler.compile(channelDNA);
    this.profiles.set(profile.metadata.id, profile);
    return profile;
  }

  compileWithProject(channelDNA: ChannelDNA, projectDNA: ProjectDNA): VisualDNAProfile {
    const profile = this.compiler.compile(channelDNA);
    const overridden = this.projectOverride.apply(profile, projectDNA);
    this.profiles.set(overridden.metadata.id, overridden);
    return overridden;
  }

  getZennProfile(channelDnaId: string): VisualDNAProfile {
    return createZennProfile(channelDnaId);
  }

  get(id: string): VisualDNAProfile | undefined {
    return this.profiles.get(id);
  }

  createMetaphorLibrary(profile: VisualDNAProfile): MetaphorLibrary {
    return new MetaphorLibrary(profile.metaphors);
  }

  createGrammarEngine(profile: VisualDNAProfile): VisualGrammarEngine {
    return new VisualGrammarEngine(profile.grammar);
  }
}
