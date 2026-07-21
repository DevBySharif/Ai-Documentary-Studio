import { PromptLibraryTemplateStore } from "./prompt-library-template-store";
import { PromptVariableBlockCompiler } from "./prompt-variable-block-compiler";
import { PromptModelComparator } from "./prompt-model-comparator";
import { PromptScoreDebugger } from "./prompt-score-debugger";
import { BatchPromptGenerator } from "./batch-prompt-generator";

/**
 * Master Prompt Studio UI Engine (Main Vol 05 Part 08).
 * Orchestrates 4-panel prompt engineering IDE layout: Left Prompt Library -> Center Prompt Editor -> Right Variables/Preview/Analysis -> Bottom History/Testing/Comparison.
 */
export class MasterPromptStudioUI {
  public readonly libraryStore = new PromptLibraryTemplateStore();
  public readonly compiler = new PromptVariableBlockCompiler();
  public readonly modelComparator = new PromptModelComparator();
  public readonly scoreDebugger = new PromptScoreDebugger();
  public readonly batchGenerator = new BatchPromptGenerator();

  public previewAndDebugPrompt(templateText: string, variableValues: Record<string, string>): {
    resolvedPrompt: string;
    scores: ReturnType<PromptScoreDebugger["scorePrompt"]>;
    debugIssues: ReturnType<PromptScoreDebugger["debugPrompt"]>;
  } {
    const resolvedPrompt = this.compiler.resolveVariables(templateText, variableValues);
    const scores = this.scoreDebugger.scorePrompt(resolvedPrompt);
    const debugIssues = this.scoreDebugger.debugPrompt(resolvedPrompt);

    return {
      resolvedPrompt,
      scores,
      debugIssues,
    };
  }
}
