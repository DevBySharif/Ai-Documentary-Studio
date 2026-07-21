export interface ProjectManifest {
  projectId: string;
  channelDna: string;
  runtime: number;
  sceneCount: number;
  imageCount: number;
  reuseRate: number;
  voice: string;
  status: string;
  qualityScore: number;
  createdAt: string;
  engines: string[];
  warnings: string[];
}
