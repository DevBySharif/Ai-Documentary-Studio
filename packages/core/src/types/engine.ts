export interface EngineInput {
  projectId: string;
  idea?: string;
  dna?: {
    channel: Record<string, unknown>;
    project: Record<string, unknown>;
  };
  data?: Record<string, unknown>;
}

export interface EngineOutput {
  success: boolean;
  confidence: number;
  data: Record<string, unknown>;
  warnings: string[];
  errors: string[];
  metadata?: Record<string, unknown>;
}

export interface EngineResult<T = Record<string, unknown>> {
  success: boolean;
  confidence: number;
  data: T;
  warnings: string[];
  errors: string[];
}

export interface Decision {
  id: string;
  engine: string;
  action: string;
  input: Record<string, unknown>;
  options: Array<Record<string, unknown>>;
  selected: Record<string, unknown>;
  confidence: number;
  timestamp: string;
  duration: number;
}
