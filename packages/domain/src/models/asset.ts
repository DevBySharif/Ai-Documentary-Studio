/**
 * Asset aggregate root.
 */
export interface Asset {
  readonly id: string;
  readonly name: string;
  readonly filePath: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly createdAt: Date;
  readonly projectId: string;
}
