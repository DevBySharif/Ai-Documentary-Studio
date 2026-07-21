import { ValidationResult } from './types';

export class GoldenMasterTesting {
  private masterOutputs: Map<string, any> = new Map();

  setReferenceOutput(workflowId: string, outputData: any): void {
    this.masterOutputs.set(workflowId, outputData);
  }

  compareOutput(workflowId: string, newOutput: any): ValidationResult {
    const reference = this.masterOutputs.get(workflowId);
    if (!reference) {
      return { isValid: false, errors: [`No Golden Master found for ${workflowId}`], warnings: [] };
    }

    const differences = this.deepCompare(reference, newOutput);
    
    return {
      isValid: differences.length === 0,
      errors: differences,
      warnings: []
    };
  }

  private deepCompare(ref: any, target: any): string[] {
    // Advanced JSON diff logic
    if (JSON.stringify(ref) !== JSON.stringify(target)) {
      return ["Outputs do not match exactly."];
    }
    return [];
  }
}
