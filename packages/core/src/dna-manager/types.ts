export type DNAVersionStatus = "draft" | "validated" | "locked";

export interface DNASection {
  identity: Record<string, unknown>;
  storyRules: Record<string, unknown>;
  scriptRules: Record<string, unknown>;
  promptRules: Record<string, unknown>;
  artStyle: Record<string, unknown>;
  characterRules: Record<string, unknown>;
  sceneRules: Record<string, unknown>;
  motionRules: Record<string, unknown>;
  subtitleRules: Record<string, unknown>;
  audioRules: Record<string, unknown>;
  qaRules: Record<string, unknown>;
  exportRules: Record<string, unknown>;
}

export interface DNAVersion {
  version: string;
  timestamp: number;
  status: DNAVersionStatus;
  sections: DNASection;
}

export interface DNAValidationResult {
  storyRules: boolean;
  promptRules: boolean;
  artStyle: boolean;
  motionRules: boolean;
  subtitleRules: boolean;
  exportRules: boolean;
  allValid: boolean;
}

export interface DNAKnowledgeEntry {
  category: string;
  key: string;
  value: unknown;
  timestamp: number;
}

export interface DNAPerformanceMetrics {
  qaPassRate: number;
  imageRegenerationRate: number;
  avgRenderTime: number;
  promptSuccessRate: number;
  subtitleCorrectionRate: number;
  productionDuration: number;
}

export interface DNAEvolutionSuggestion {
  category: string;
  suggestion: string;
  impact: string;
  approved: boolean;
}

export interface DNAOutputContract {
  channel: string;
  dnaVersion: string;
  status: string;
  locked: boolean;
  compatible: boolean;
}
