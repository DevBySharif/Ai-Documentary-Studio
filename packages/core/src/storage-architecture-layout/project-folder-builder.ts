import { ProjectFolderDescriptor } from "./storage-types";

/**
 * Project Folder Structure Generator (Vol 06 Part 04 - Section 5 to Section 16).
 * Builds and initializes the 14 standard subdirectories required for self-contained, portable project folders.
 */
export class ProjectFolderBuilder {
  public buildProjectFolderStructure(projectRootPath: string): ProjectFolderDescriptor {
    const root = projectRootPath.replace(/\\/g, "/");
    return {
      rootPath: root,
      databaseDir: `${root}/database`,
      researchDir: `${root}/research`,
      scriptsDir: `${root}/scripts`,
      storyboardDir: `${root}/storyboard`,
      promptsDir: `${root}/prompts`,
      assetsDir: `${root}/assets`,
      voiceDir: `${root}/voice`,
      timelineDir: `${root}/timeline`,
      reviewDir: `${root}/review`,
      exportsDir: `${root}/exports`,
      backupsDir: `${root}/backups`,
      logsDir: `${root}/logs`,
      cacheDir: `${root}/cache`,
      tempDir: `${root}/temp`,
    };
  }

  public getAssetSubdirectories(assetsDir: string): ReadonlyArray<string> {
    return [
      `${assetsDir}/images`,
      `${assetsDir}/video`,
      `${assetsDir}/audio`,
      `${assetsDir}/music`,
      `${assetsDir}/documents`,
      `${assetsDir}/thumbnails`,
      `${assetsDir}/generated`,
      `${assetsDir}/imports`,
    ];
  }
}
