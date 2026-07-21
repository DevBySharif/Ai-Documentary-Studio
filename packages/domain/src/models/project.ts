/**
 * Project aggregate root.
 */
export interface Project {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly version: number;
}
