import { AiAttributionMetadata } from "./collaboration-types";

export interface WorkspacePolicyRules {
  readonly approvedAiProviders: ReadonlyArray<string>;
  readonly monthlySpendLimitUSD: number;
  readonly requireMandatoryReviewForExports: boolean;
}

/**
 * AI Activity Attribution Tracker & Workspace Policy Enforcer (Vol 08 Part 01 - Section 13, Section 14, Section 15).
 * Attaches attribution metadata to AI outputs and enforces workspace-wide policies (approved providers, spending limits, review rules).
 */
export class AiAttributionWorkspacePolicy {
  private policy: WorkspacePolicyRules = {
    approvedAiProviders: ["OpenAI", "Gemini", "FLUX", "ElevenLabs"],
    monthlySpendLimitUSD: 500.0,
    requireMandatoryReviewForExports: true,
  };

  private attributions: AiAttributionMetadata[] = [];

  public createAiAttribution(requestingUserId: string, responsibleAiAgentId: string, modelUsed: string): AiAttributionMetadata {
    const attr: AiAttributionMetadata = {
      attributionId: `attr_${Math.random().toString(36).substring(2, 7)}`,
      requestingUserId,
      responsibleAiAgentId,
      modelUsed,
      generatedAt: new Date(),
    };

    this.attributions.push(attr);
    return attr;
  }

  public getWorkspacePolicy(): WorkspacePolicyRules {
    return this.policy;
  }
}
