/**
 * Timeline aggregate root.
 */
export interface Timeline {
  readonly id: string;
  readonly projectId: string;
  readonly durationMs: number;
  readonly frameRate: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly version: number;
}
