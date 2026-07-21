export class VariableResolver {
  /**
   * Merges multiple context objects into a single variable map.
   * Priority (highest to lowest):
   * 1. Runtime parameters (provided directly to the execution request)
   * 2. Project metadata
   * 3. Default values defined in the template
   */
  static resolve(
    templateVars: string[],
    defaultValues: Record<string, any> = {},
    projectMetadata: Record<string, any> = {},
    runtimeParams: Record<string, any> = {}
  ): Record<string, any> {
    const resolved: Record<string, any> = {};

    for (const variable of templateVars) {
      if (runtimeParams[variable] !== undefined) {
        resolved[variable] = runtimeParams[variable];
      } else if (projectMetadata[variable] !== undefined) {
        resolved[variable] = projectMetadata[variable];
      } else if (defaultValues[variable] !== undefined) {
        resolved[variable] = defaultValues[variable];
      } else {
        throw new Error(`Missing required variable: '${variable}'`);
      }
    }

    return resolved;
  }
}
