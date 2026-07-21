import type { DAError, DAErrorCategory, DALogLevel } from "./types.js";

export class DAErrorHandling {
  private errors: DAError[] = [];

  report(code: string, category: DAErrorCategory, severity: DALogLevel, message: string, suggestion: string, diagnostics: Record<string, unknown>): DAError {
    const err: DAError = { code, category, severity, message, recoverySuggestion: suggestion, diagnosticDetails: diagnostics };
    this.errors.push(err);
    return err;
  }

  getErrors(): DAError[] {
    return [...this.errors];
  }

  getCriticalErrors(): DAError[] {
    return this.errors.filter((e) => e.severity === "critical");
  }

  clear(): void {
    this.errors = [];
  }
}
