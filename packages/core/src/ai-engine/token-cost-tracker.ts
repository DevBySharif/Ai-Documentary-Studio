export interface CostRecord {
  readonly jobId: string;
  readonly providerName: string;
  readonly modelId: string;
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly costUsd: number;
  readonly timestamp: Date;
}

/**
 * Token Budgeting & Cost Monitoring System (IB Part 18 - Section 9, Section 16).
 * Estimates token usage and tracks cumulative project costs.
 */
export class TokenCostTracker {
  private records: CostRecord[] = [];
  private totalCostUsd = 0;

  public estimateTokens(text: string): number {
    // Standard approximation: 1 token ~= 4 characters
    return Math.ceil(text.length / 4);
  }

  public recordUsage(
    jobId: string,
    providerName: string,
    modelId: string,
    inputTokens: number,
    outputTokens: number,
    costPer1kInputUsd = 0.003,
    costPer1kOutputUsd = 0.015
  ): CostRecord {
    const costUsd =
      (inputTokens / 1000) * costPer1kInputUsd + (outputTokens / 1000) * costPer1kOutputUsd;

    const record: CostRecord = {
      jobId,
      providerName,
      modelId,
      inputTokens,
      outputTokens,
      costUsd: Math.round(costUsd * 100000) / 100000,
      timestamp: new Date(),
    };

    this.records.push(record);
    this.totalCostUsd += record.costUsd;
    return record;
  }

  public getTotalCostUsd(): number {
    return Math.round(this.totalCostUsd * 10000) / 10000;
  }

  public getRecords(): ReadonlyArray<CostRecord> {
    return this.records;
  }
}
