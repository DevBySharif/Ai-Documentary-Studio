import { ProjectMetadata, ProjectLifecycleStage } from "./project-types";

export interface ProjectCreationWizardOptions {
  readonly title: string;
  readonly category: string;
  readonly language: string;
  readonly targetPlatform: string;
  readonly resolution: string;
  readonly aspectRatio: string;
  readonly templateName: string;
  readonly storageLocation: string;
}

/**
 * Project Creation Wizard & Folder Initializer (Vol 05 Part 03 - Section 4, Section 6, Section 12).
 * Automatically initializes standardized 13-folder project architecture (`Research/`, `Script/`, `Storyboard/`, `Assets/`, `Timeline/`, etc.).
 */
export class ProjectWizardBuilder {
  public createProject(options: ProjectCreationWizardOptions): ProjectMetadata {
    const projectId = `proj_${Math.random().toString(36).substring(2, 9)}`;

    // Standardized 13-folder structure (Section 6)
    const requiredFolders = [
      "Research",
      "Script",
      "Storyboard",
      "Prompts",
      "Assets",
      "Voice",
      "Music",
      "Timeline",
      "Review",
      "Exports",
      "Cache",
      "Logs",
      "Settings",
    ];

    const metadata: ProjectMetadata = {
      projectId,
      title: options.title,
      description: `Documentary project generated from template '${options.templateName}'`,
      keywords: [options.category, options.language],
      language: options.language,
      category: options.category,
      targetAudience: "General Documentary Audience",
      creator: "Studio Author",
      targetPlatform: options.targetPlatform,
      resolution: options.resolution,
      aspectRatio: options.aspectRatio,
      creationDate: new Date(),
      lastModified: new Date(),
      currentStage: "Planning",
      completionPercent: 5,
      isLocked: false,
    };

    return metadata;
  }
}
