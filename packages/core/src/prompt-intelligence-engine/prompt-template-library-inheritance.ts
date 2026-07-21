import { PromptTemplateDescriptor } from "./prompt-intelligence-types";

/**
 * Central Prompt Template Library & Inheritance Engine (Vol 07 Part 05 - Section 4, Section 11, Section 15).
 * Manages reusable prompt templates and supports template inheritance (Base Cinematic -> Historical Doc -> World War II Variant).
 */
export class PromptTemplateLibraryInheritance {
  private templates = new Map<string, PromptTemplateDescriptor>();

  constructor() {
    this.initDefaultTemplates();
  }

  private initDefaultTemplates(): void {
    const baseCinematic: PromptTemplateDescriptor = {
      templateId: "tmpl_base_cinematic",
      templateName: "Base Cinematic Image Template",
      category: "CinematicImage",
      templateText: "Cinematic {{aspectRatio}} shot of {{sceneDescription}}, {{visualStyle}} lighting, 8k documentary photograph.",
      requiredVariables: ["aspectRatio", "sceneDescription", "visualStyle"],
      version: 1,
    };

    const historicalDoc: PromptTemplateDescriptor = {
      templateId: "tmpl_historical_ww2",
      templateName: "WWII Historical Variant",
      parentTemplateId: "tmpl_base_cinematic",
      category: "CinematicImage",
      templateText: "Cinematic {{aspectRatio}} historical documentary photo of {{sceneDescription}}, WWII 1940s authentic uniform, {{visualStyle}} mood.",
      requiredVariables: ["aspectRatio", "sceneDescription", "visualStyle"],
      version: 1,
    };

    this.templates.set(baseCinematic.templateId, baseCinematic);
    this.templates.set(historicalDoc.templateId, historicalDoc);
  }

  public getTemplate(templateId: string): PromptTemplateDescriptor | undefined {
    return this.templates.get(templateId);
  }

  public listTemplates(): ReadonlyArray<PromptTemplateDescriptor> {
    return Array.from(this.templates.values());
  }
}
