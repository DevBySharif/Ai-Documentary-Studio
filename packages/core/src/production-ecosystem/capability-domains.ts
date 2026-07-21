export type CapabilityDomainType =
  | "ResearchIntelligence"
  | "WritingIntelligence"
  | "VisualIntelligence"
  | "AudioIntelligence"
  | "EditingIntelligence"
  | "ReviewIntelligence";

export interface DomainCapabilityDescriptor {
  readonly domain: CapabilityDomainType;
  readonly responsibilities: ReadonlyArray<string>;
}

/**
 * AI Capability Groups (Vol 04 Part 01 - Section 7).
 * Divide intelligence layer into 6 major capability domains.
 */
export class CapabilityDomainRegistry {
  private domains = new Map<CapabilityDomainType, DomainCapabilityDescriptor>();

  constructor() {
    this.initDomains();
  }

  private initDomains(): void {
    const descriptors: DomainCapabilityDescriptor[] = [
      { domain: "ResearchIntelligence", responsibilities: ["Fact gathering", "Source comparison", "Citation management", "Timeline creation", "Historical analysis"] },
      { domain: "WritingIntelligence", responsibilities: ["Documentary scripts", "Narration", "Hooks", "Conclusions", "Scene descriptions"] },
      { domain: "VisualIntelligence", responsibilities: ["Storyboards", "Shot planning", "Image prompts", "B-roll planning", "Motion suggestions"] },
      { domain: "AudioIntelligence", responsibilities: ["Voice style", "Narration pacing", "Music planning", "Sound effects", "Audio balancing recommendations"] },
      { domain: "EditingIntelligence", responsibilities: ["Timeline composition", "Clip placement", "Transition suggestions", "Visual rhythm", "Scene pacing"] },
      { domain: "ReviewIntelligence", responsibilities: ["Quality scoring", "Fact checking", "Continuity validation", "Copyright awareness", "Production review"] },
    ];

    descriptors.forEach((d) => this.domains.set(d.domain, d));
  }

  public getDescriptor(domain: CapabilityDomainType): DomainCapabilityDescriptor | undefined {
    return this.domains.get(domain);
  }

  public listDomains(): ReadonlyArray<DomainCapabilityDescriptor> {
    return Array.from(this.domains.values());
  }
}
