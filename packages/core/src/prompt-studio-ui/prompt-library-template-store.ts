import { PromptTemplateDescriptor, PromptCategory } from "./prompt-ui-types";

/**
 * Prompt Library, Template Store & Inheritance Engine (Vol 05 Part 08 - Section 4, Section 6, Section 9).
 * Manages organized prompt library, reusable templates, and prompt inheritance (parent -> child overrides).
 */
export class PromptLibraryTemplateStore {
  private templates: PromptTemplateDescriptor[] = [
    {
      promptId: "prompt_hist_portrait",
      title: "Historical Master Portrait",
      category: "ImageGeneration",
      templateText: "Cinematic 8K portrait of {{Character}} in {{Year}}, {{Lighting}} lighting, {{Camera}} angle.",
      variables: [
        { name: "Character", defaultValue: "Historical Figure", description: "Subject name" },
        { name: "Year", defaultValue: "1845", description: "Historical year" },
        { name: "Lighting", defaultValue: "Dramatic Rembrandt", description: "Lighting style" },
        { name: "Camera", defaultValue: "Medium Eye-Level", description: "Camera angle" },
      ],
      versionNumber: 1,
    },
  ];

  public getLibraryByCategory(category: PromptCategory): ReadonlyArray<PromptTemplateDescriptor> {
    return this.templates.filter((t) => t.category === category);
  }

  public createChildPrompt(parentPromptId: string, childTitle: string, overridesText: string): PromptTemplateDescriptor {
    const parent = this.templates.find((t) => t.promptId === parentPromptId);
    const child: PromptTemplateDescriptor = {
      promptId: `prompt_child_${Math.random().toString(36).substring(2, 7)}`,
      title: childTitle,
      category: parent ? parent.category : "ImageGeneration",
      parentPromptId,
      templateText: overridesText || (parent ? parent.templateText : ""),
      variables: parent ? parent.variables : [],
      versionNumber: 1,
    };
    this.templates.push(child);
    return child;
  }
}
