export type LogLevel = "Debug" | "Info" | "Warning" | "Error" | "Critical";

export interface DomainError {
  code: string;
  message: string;
  domain: string;
}

export interface ApplicationError {
  code: string;
  message: string; // User-friendly message
  details?: string;
  isRecoverable: boolean;
}
