import { z } from 'zod';

export class ResponseValidator {
  /**
   * Validates a parsed JSON object against a Zod schema.
   * Throws if malformed, ensuring domain logic receives clean data.
   */
  static validate<T>(data: any, schema: z.ZodSchema<T>): T {
    const result = schema.safeParse(data);
    if (!result.success) {
      throw new Error(`Structured Output Validation Failed: ${result.error.message}`);
    }
    return result.data;
  }

  /**
   * Attempts to extract and parse JSON from a raw text response,
   * handling common LLM markdown artifacts (e.g., ```json ... ```)
   */
  static extractAndParseJSON(rawText: string): any {
    const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/) || rawText.match(/```([\s\S]*?)```/);
    const jsonString = jsonMatch ? jsonMatch[1] : rawText;

    try {
      return JSON.parse(jsonString);
    } catch (e: any) {
      throw new Error(`Failed to parse JSON from AI response: ${e.message}`);
    }
  }
}
