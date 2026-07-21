import { PromptTemplateLibraryInheritance } from "./prompt-template-library-inheritance";
import { ContextVariableInjector } from "./context-variable-injector";
import { ModelAdaptationOptimizer } from "./model-adaptation-optimizer";
import { PromptScorerRepairAbtesting } from "./prompt-scorer-repair-abtesting";
import { CompiledPromptResult, TargetModelFamily } from "./prompt-intelligence-types";

/**
 * Master Prompt Intelligence Engine (Main Vol 07 Part 05).
 * Core entry point for transforming user intent into optimized, structured prompts tailored to specific AI capabilities and model families.
 */
export class MasterPromptIntelligenceEngine {
  public readonly library = new PromptTemplateLibraryInheritance();
  public readonly injector = new ContextVariableInjector();
  public readonly optimizer = new ModelAdaptationOptimizer();
  public readonly scorerRepair = new PromptScorerRepairAbtesting();

  public compilePrompt(
    templateId: string,
    variables: Record<string, string>,
    targetModelFamily: TargetModelFamily = "LanguageModel",
    contextText = "Battle of Midway documentary project"
  ): CompiledPromptResult {
    const tmpl = this.library.getTemplate(templateId) || this.library.listTemplates()[0];
    const injected = this.injector.injectVariables(tmpl.templateText, variables);
    const adapted = this.optimizer.adaptPromptForModel(injected, targetModelFamily);
    const optimized = this.optimizer.optimizeTokens(adapted);
    const scoreCard = this.scorerRepair.calculateScore(optimized);

    return {
      promptId: `prm_${Math.random().toString(36).substring(2, 7)}`,
      templateId: tmpl.templateId,
      targetModelFamily,
      compiledText: optimized,
      tokenEstimate: Math.ceil(optimized.length / 4),
      scoreCard,
      createdAt: new Date(),
    };
  }
}
