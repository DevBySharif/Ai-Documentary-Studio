export interface PILPrediction {
  category: string;
  risk: number;
  recommendation: string;
  automatic: boolean;
}

export interface PILOptimization {
  target: string;
  originalValue: string | number;
  optimizedValue: string | number;
  improvement: string;
  expectedGain: number;
}

export interface PILReport {
  predictions: PILPrediction[];
  optimizations: PILOptimization[];
  overallReadiness: number;
  estimatedImprovement: number;
  summary: string;
}
