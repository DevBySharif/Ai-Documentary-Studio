import { PromptCompositionSections } from "./prompt-intelligence-types";

/**
 * Context-Aware Prompting & Dynamic Variable Injector (Vol 07 Part 05 - Section 5, Section 6, Section 7).
 * Injects project memory/script context into 7 standard composition sections (`System -> Context -> Task -> Style -> Constraints -> Format -> Hints`).
 */
export class ContextVariableInjector {
  public injectVariables(templateText: string, variables: Record<string, string>): string {
    let result = templateText;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{{${key}}}`, "g"), value);
    }
    return result;
  }

  public assembleCompositionSections(
    contextText: string,
    taskInstructionsText: string,
    styleRulesText: string,
    outputFormatText: string
  ): PromptCompositionSections {
    return {
      systemInstructions: "You are an expert AI Documentary Assistant adhering to strict factual accuracy.",
      projectContext: `Project Context:\n${contextText}`,
      taskInstructions: `Task:\n${taskInstructionsText}`,
      styleRules: `Style Guidelines:\n${styleRulesText}`,
      constraints: "Constraints: Do not hallucinate unverified historical details.",
      outputFormat: `Output Format:\n${outputFormatText}`,
      validationHints: "Validation: Return clean structured response.",
    };
  }

  public flattenSections(sections: PromptCompositionSections): string {
    return [
      sections.systemInstructions,
      sections.projectContext,
      sections.taskInstructions,
      sections.styleRules,
      sections.constraints,
      sections.outputFormat,
      sections.validationHints,
    ]
      .filter((s) => s.trim().length > 0)
      .join("\n\n");
  }
}
