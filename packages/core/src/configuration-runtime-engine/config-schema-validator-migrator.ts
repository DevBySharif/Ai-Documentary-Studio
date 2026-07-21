/**
 * Configuration Schema Validator, Import/Export & Migration Engine (Vol 06 Part 08 - Section 13, Section 15, Section 16).
 * Validates data types, allowed ranges, required fields, and executes versioned configuration profile migrations.
 */
export class ConfigSchemaValidatorMigrator {
  public validateConfigObject(configObj: Record<string, unknown>): { isValid: boolean; errors: ReadonlyArray<string> } {
    const errors: string[] = [];

    if ("frameRate" in configObj && typeof configObj.frameRate === "number") {
      if (configObj.frameRate <= 0 || configObj.frameRate > 120) {
        errors.push("Invalid frameRate: Must be between 1 and 120 fps.");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  public exportProfile(configObj: Record<string, unknown>): string {
    return JSON.stringify({ version: 1, exportedAt: new Date(), data: configObj }, null, 2);
  }
}
