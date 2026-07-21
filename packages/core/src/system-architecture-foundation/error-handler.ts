import { DomainError, ApplicationError } from './types';

export class ErrorHandler {
  static translateDomainError(error: DomainError): ApplicationError {
    // In a real implementation, this would look up localized strings based on the domain error code
    return {
      code: error.code,
      message: `A system error occurred in the ${error.domain} module.`,
      details: error.message,
      isRecoverable: true
    };
  }

  static createCriticalError(message: string): ApplicationError {
    return {
      code: "SYS_CRITICAL",
      message: "A critical system error occurred.",
      details: message,
      isRecoverable: false
    };
  }
}
