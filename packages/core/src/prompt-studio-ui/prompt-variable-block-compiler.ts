import { PromptVariable, PromptBlockItem } from "./prompt-ui-types";

/**
 * Dynamic Variable Resolver, Reusable Block & Component Library Compiler (Vol 05 Part 08 - Section 7, Section 8, Section 10, Section 17).
 * Compiles dynamic variables (e.g. {{Character}}) and reusable prompt blocks (Camera language, Negative prompts) into final prompt text.
 */
export class PromptVariableBlockCompiler {
  private blocks: PromptBlockItem[] = [
    {
      blockId: "block_cam_1",
      name: "Cinematic Camera Preset",
      category: "Camera",
      contentText: "Shot on 35mm lens, f/2.8 depth of field, subtle film grain.",
    },
    {
      blockId: "block_neg_1",
      name: "Standard Negative Prompt",
      category: "NegativePrompt",
      contentText: "avoid oversaturation, blurry details, modern artifacts, cartoon rendering",
    },
  ];

  public resolveVariables(templateText: string, variableValues: Record<string, string>): string {
    let resolved = templateText;
    Object.entries(variableValues).forEach(([key, val]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      resolved = resolved.replace(regex, val);
    });
    return resolved;
  }

  public appendBlock(promptText: string, blockId: string): string {
    const block = this.blocks.find((b) => b.blockId === blockId);
    if (!block) return promptText;
    return `${promptText} -- ${block.contentText}`;
  }
}
