import { PDEntityRecord } from "./types";

export class PDDataValidation {
  validateForeignKeys(record: PDEntityRecord): boolean {
    if (!record.projectId && record.type !== "workspace" && record.type !== "user" && record.type !== "setting" && record.type !== "plugin") {
      return false;
    }
    return true;
  }

  validateRequiredFields(record: PDEntityRecord, requiredFields: string[]): boolean {
    for (const field of requiredFields) {
      if (record.data[field] === undefined || record.data[field] === null) {
        return false;
      }
    }
    return true;
  }

  validateVersion(record: PDEntityRecord, expectedVersion: number): boolean {
    return record.version === expectedVersion;
  }

  validateRelationshipIntegrity(record: PDEntityRecord): boolean {
    if (!record.id || !record.type) return false;
    if (record.version < 1) return false;
    return true;
  }

  validate(
    record: PDEntityRecord,
    rules: { field: string; required?: boolean; type?: string; min?: number; max?: number }[]
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    for (const rule of rules) {
      const value = record.data[rule.field];
      if (rule.required && (value === undefined || value === null)) {
        errors.push(`Field '${rule.field}' is required`);
      }
      if (rule.type && value !== undefined && value !== null) {
        if (rule.type === "string" && typeof value !== "string") {
          errors.push(`Field '${rule.field}' must be a string`);
        }
        if (rule.type === "number" && typeof value !== "number") {
          errors.push(`Field '${rule.field}' must be a number`);
        }
      }
      if (typeof value === "number") {
        if (rule.min !== undefined && value < rule.min) {
          errors.push(`Field '${rule.field}' must be >= ${rule.min}`);
        }
        if (rule.max !== undefined && value > rule.max) {
          errors.push(`Field '${rule.field}' must be <= ${rule.max}`);
        }
      }
    }
    return { valid: errors.length === 0, errors };
  }
}
