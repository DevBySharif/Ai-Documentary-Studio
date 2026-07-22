import { ComplexityTokenEconomyManager } from "./complexity-token-economy-manager";
import { ContextBudgetingCacheEngine } from "./context-budgeting-cache-engine";
import { ProviderCostSchedulerForecaster } from "./provider-cost-scheduler-forecaster";
import { BudgetEnforcementEfficiencyTracker } from "./budget-enforcement-efficiency-tracker";
import { CostForecastDescriptor, CacheHitDescriptor } from "./cost-optimization-types";

/**
 * Master AI Cost Optimization Framework Engine (Main Vol 07 Part 10).
 * Core entry point for 7-stage cost optimization pipeline (`Task → Complexity → Context Optimization → Model Selection → Execution → Resource Analysis → Feedback`).
 */
export class MasterAiCostOptimization {
  public readonly complexityManager = new ComplexityTokenEconomyManager();
  public readonly contextCacheEngine = new ContextBudgetingCacheEngine();
  public readonly forecasterScheduler = new ProviderCostSchedulerForecaster();
  public readonly budgetTracker = new BudgetEnforcementEfficiencyTracker();

  public optimizeWorkflowExecution(
    taskName: string,
    rawPromptText: string,
    cacheKey: string,
    currentProjectSpendUSD = 0.5
  ): {
    complexity: ReturnType<ComplexityTokenEconomyManager["classifyTaskComplexity"]>;
    compressedPrompt: string;
    cacheHit: CacheHitDescriptor;
    forecast: CostForecastDescriptor;
    isBudgetOk: boolean;
  } {
    const complexity = this.complexityManager.classifyTaskComplexity(taskName, rawPromptText);
    const { compressedPrompt } = this.complexityManager.compressTokenEconomy(rawPromptText);
    const cacheHit = this.contextCacheEngine.checkExecutionCache(cacheKey);
    const forecast = this.forecasterScheduler.forecastWorkflowCost(complexity);
    const budgetCheck = this.budgetTracker.checkBudgetLimits(currentProjectSpendUSD, forecast.estimatedTotalWorkflowCostUSD);

    return {
      complexity,
      compressedPrompt,
      cacheHit,
      forecast,
      isBudgetOk: budgetCheck.isWithinBudget,
    };
  }
}
