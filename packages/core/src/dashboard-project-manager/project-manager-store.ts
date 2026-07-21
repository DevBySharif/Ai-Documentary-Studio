import { ProjectCardSummary, ProjectTemplateType } from "./dashboard-types";

/**
 * Project Manager & Template Store (Vol 05 Part 02 - Section 6, Section 7, Section 8, Section 16).
 * Manages Recent Projects, Pinned Projects, Project Templates, and quick resume states.
 */
export class ProjectManagerStore {
  private projects: ProjectCardSummary[] = [];

  constructor() {
    this.initDefaultProjects();
  }

  private initDefaultProjects(): void {
    this.projects = [
      {
        projectId: "proj_hist_1",
        title: "The Industrial Revolution: Iron & Steam",
        thumbnailUrl: "https://assets.studio.internal/thumb_ind.png",
        lastOpenedAt: new Date("2026-07-21T18:00:00Z"),
        currentPhase: "TimelineComposition",
        completionPercent: 75,
        isPinned: true,
      },
      {
        projectId: "proj_sci_2",
        title: "Quantum Horizons: Exploring Deep Space",
        thumbnailUrl: "https://assets.studio.internal/thumb_space.png",
        lastOpenedAt: new Date("2026-07-20T14:30:00Z"),
        currentPhase: "Script",
        completionPercent: 40,
        isPinned: false,
      },
    ];
  }

  public getRecentProjects(limit = 5): ReadonlyArray<ProjectCardSummary> {
    return [...this.projects].sort((a, b) => b.lastOpenedAt.getTime() - a.lastOpenedAt.getTime()).slice(0, limit);
  }

  public getPinnedProjects(): ReadonlyArray<ProjectCardSummary> {
    return this.projects.filter((p) => p.isPinned);
  }

  public togglePinProject(projectId: string): void {
    const proj = this.projects.find((p) => p.projectId === projectId);
    if (proj) {
      const idx = this.projects.indexOf(proj);
      this.projects[idx] = { ...proj, isPinned: !proj.isPinned };
    }
  }

  public createFromTemplate(templateType: ProjectTemplateType, title: string): ProjectCardSummary {
    const newProj: ProjectCardSummary = {
      projectId: `proj_${Math.random().toString(36).substring(2, 9)}`,
      title: title || `New ${templateType}`,
      thumbnailUrl: "https://assets.studio.internal/thumb_new.png",
      lastOpenedAt: new Date(),
      currentPhase: "Research",
      completionPercent: 5,
      isPinned: false,
    };
    this.projects.push(newProj);
    return newProj;
  }
}
