import * as path from "path";

/**
 * Canonical workspace directory names.
 */
export const WORKSPACE_DIRS = {
  PROJECTS: "Projects",
  CACHE: "Cache",
  EXPORTS: "Exports",
  BACKUPS: "Backups",
  PLUGINS: "Plugins",
  LOGS: "Logs",
  TEMP: "Temp",
  SETTINGS: "Settings",
} as const;

/**
 * Canonical project subdirectory names.
 */
export const PROJECT_DIRS = {
  TIMELINE: "timeline",
  ASSETS: "assets",
  AUDIO: path.join("assets", "audio"),
  VIDEO: path.join("assets", "video"),
  IMAGES: path.join("assets", "images"),
  DOCUMENTS: path.join("assets", "documents"),
  EXPORTS: "exports",
  CACHE: "cache",
  THUMBNAILS: path.join("cache", "thumbnails"),
  METADATA: "metadata",
} as const;

/**
 * Resolves deterministic absolute paths for the workspace and each project.
 */
export class PathResolver {
  constructor(private readonly workspaceRoot: string) {}

  // ─── Workspace paths ───────────────────────────────────────────────────────

  public workspacePath(...segments: string[]): string {
    return path.join(this.workspaceRoot, ...segments);
  }

  public projectsDir(): string {
    return this.workspacePath(WORKSPACE_DIRS.PROJECTS);
  }

  public cacheDir(): string {
    return this.workspacePath(WORKSPACE_DIRS.CACHE);
  }

  public tempDir(): string {
    return this.workspacePath(WORKSPACE_DIRS.TEMP);
  }

  public backupsDir(): string {
    return this.workspacePath(WORKSPACE_DIRS.BACKUPS);
  }

  public logsDir(): string {
    return this.workspacePath(WORKSPACE_DIRS.LOGS);
  }

  // ─── Project paths ─────────────────────────────────────────────────────────

  public projectRoot(projectId: string): string {
    return path.join(this.projectsDir(), projectId);
  }

  public projectAssets(projectId: string): string {
    return path.join(this.projectRoot(projectId), PROJECT_DIRS.ASSETS);
  }

  public projectThumbnails(projectId: string): string {
    return path.join(this.projectRoot(projectId), PROJECT_DIRS.THUMBNAILS);
  }

  public projectExports(projectId: string): string {
    return path.join(this.projectRoot(projectId), PROJECT_DIRS.EXPORTS);
  }

  public projectMetadata(projectId: string): string {
    return path.join(this.projectRoot(projectId), PROJECT_DIRS.METADATA);
  }

  // ─── Asset paths ───────────────────────────────────────────────────────────

  /**
   * Content-addressable path using asset hash prefix sharding
   * (e.g. <workspace>/cache/ab/abcdef1234...ext)
   */
  public contentAddressedPath(hash: string, extension: string): string {
    const prefix = hash.substring(0, 2);
    return path.join(this.cacheDir(), prefix, `${hash}${extension}`);
  }

  public thumbnailPath(projectId: string, assetId: string): string {
    return path.join(this.projectThumbnails(projectId), `${assetId}.jpg`);
  }
}
