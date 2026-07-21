import { ValidationError } from "../errors/preload-errors";

export interface Validator<T> {
  validate(data: unknown): T;
}

export class ValidatorRegistry {
  public static validate<T>(validator: Validator<T> | undefined, data: unknown): T {
    if (!validator) {
      // If no validator is provided, we blindly cast for now (assume any validation happens elsewhere)
      return data as T;
    }

    try {
      return validator.validate(data);
    } catch (e: any) {
      throw new ValidationError(e.message || "Invalid payload schema.");
    }
  }
}
