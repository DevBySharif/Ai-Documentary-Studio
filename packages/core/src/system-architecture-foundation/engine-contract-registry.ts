import { EngineContractType, EngineContractDescriptor } from "./architecture-types";

/**
 * Engine Contract Registry (Vol 06 Part 01 - Section 11, Section 13).
 * Registers public interface contracts for all 8 core engines (Research, Script, Storyboard, Prompt, Image, Voice, Timeline, Export).
 */
export class EngineContractRegistry {
  private contracts = new Map<EngineContractType, EngineContractDescriptor>();

  constructor() {
    this.initDefaultContracts();
  }

  private initDefaultContracts(): void {
    const engines: { type: EngineContractType; methods: string[] }[] = [
      { type: "ResearchEngine", methods: ["collectEvidence", "validateCitations"] },
      { type: "ScriptEngine", methods: ["draftScript", "analyzeReadability"] },
      { type: "StoryboardEngine", methods: ["generateShots", "assignCameraLanguage"] },
      { type: "PromptEngine", methods: ["compilePrompt", "resolveVariables"] },
      { type: "ImageEngine", methods: ["enqueueGeneration", "evaluateCandidates"] },
      { type: "VoiceEngine", methods: ["synthesizeSpeech", "applyAudioCleanup"] },
      { type: "TimelineEngine", methods: ["composeTimeline", "executeRippleTrim"] },
      { type: "ExportEngine", methods: ["validatePreflight", "renderMasterPackage"] },
    ];

    engines.forEach((e) => {
      this.contracts.set(e.type, {
        engineType: e.type,
        publicMethods: e.methods,
        isHealthy: true,
      });
    });
  }

  public getContract(type: EngineContractType): EngineContractDescriptor | undefined {
    return this.contracts.get(type);
  }

  public listAllContracts(): ReadonlyArray<EngineContractDescriptor> {
    return Array.from(this.contracts.values());
  }
}
