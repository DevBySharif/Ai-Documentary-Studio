import { ConfidenceScore } from './types';

export class RecoveryConfidenceAnalyzer {
  
  analyzeRecoveredState(dbIntact: boolean, missingAssets: number, corruptJobs: number): ConfidenceScore {
    if (!dbIntact) return "Inconsistent";
    
    if (missingAssets === 0 && corruptJobs === 0) {
      return "FullyRecovered";
    }

    if (missingAssets > 0 || corruptJobs > 0) {
      if (missingAssets > 5 || corruptJobs > 5) {
        return "RequiresVerification";
      }
      return "PartiallyRecovered";
    }

    return "RequiresVerification";
  }

  getRecommendationMessage(score: ConfidenceScore): string {
    switch (score) {
      case "FullyRecovered":
        return "All data was successfully recovered. Safe to continue.";
      case "PartiallyRecovered":
        return "Some minor assets or background jobs were lost. Please review the timeline.";
      case "RequiresVerification":
        return "Multiple inconsistencies detected. Please run the Project Health Scanner.";
      case "Inconsistent":
        return "Critical database corruption. Please restore from an older backup.";
    }
  }
}
