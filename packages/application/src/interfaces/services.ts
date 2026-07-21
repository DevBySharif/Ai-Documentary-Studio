/**
 * Base interfaces for service layers.
 */

export interface ApplicationService {
  // Marker interface for application services
}

export interface WorkflowService {
  // Marker interface for workflow orchestration services
}

export interface BackgroundService {
  start(): Promise<void>;
  stop(): Promise<void>;
}
