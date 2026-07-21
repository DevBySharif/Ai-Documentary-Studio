import { CoreModuleId } from "./workspace-types";

export interface ModuleDescriptor {
  readonly moduleId: CoreModuleId;
  readonly title: string;
  readonly iconName: string;
  readonly primaryShortcut: string;
  readonly description: string;
}

/**
 * Core 12 Module Registry (Vol 05 Part 01 - Section 6, Section 9, Section 10).
 * Registers all 12 persistent documentary production modules.
 */
export class ModuleRegistry {
  private modules = new Map<CoreModuleId, ModuleDescriptor>();

  constructor() {
    this.initModules();
  }

  private initModules(): void {
    const list: ModuleDescriptor[] = [
      { moduleId: "Dashboard", title: "Dashboard", iconName: "layout-dashboard", primaryShortcut: "Ctrl+1", description: "Operational command center" },
      { moduleId: "Projects", title: "Projects", iconName: "folder-kanban", primaryShortcut: "Ctrl+2", description: "Project management & workspace switching" },
      { moduleId: "Research", title: "Research", iconName: "book-open", primaryShortcut: "Ctrl+3", description: "Fact discovery & citation notebook" },
      { moduleId: "Script", title: "Script", iconName: "file-text", primaryShortcut: "Ctrl+4", description: "Narrative scriptwriting & voiceover draft" },
      { moduleId: "Storyboard", title: "Storyboard", iconName: "film", primaryShortcut: "Ctrl+5", description: "Cinematic shot planning & scene decomposition" },
      { moduleId: "Assets", title: "Assets", iconName: "image", primaryShortcut: "Ctrl+6", description: "Content-addressable asset library" },
      { moduleId: "PromptStudio", title: "Prompt Studio", iconName: "sparkles", primaryShortcut: "Ctrl+7", description: "Multi-model prompt engineering & optimization" },
      { moduleId: "ImageGeneration", title: "Image Generation", iconName: "wand2", primaryShortcut: "Ctrl+8", description: "Parallel candidate image generation orchestrator" },
      { moduleId: "Voice", title: "Voice Director", iconName: "mic", primaryShortcut: "Ctrl+9", description: "Narration casting & speech production" },
      { moduleId: "Timeline", title: "Timeline Editor", iconName: "sliders", primaryShortcut: "Ctrl+0", description: "Multi-track NLE timeline composer" },
      { moduleId: "Review", title: "Review & Fact Check", iconName: "shield-check", primaryShortcut: "Ctrl+Shift+R", description: "Independent fact-check & publish readiness report" },
      { moduleId: "Export", title: "Export & Publish", iconName: "download", primaryShortcut: "Ctrl+Shift+E", description: "Final render pipeline & multi-platform publishing" },
    ];

    list.forEach((m) => this.modules.set(m.moduleId, m));
  }

  public getModule(id: CoreModuleId): ModuleDescriptor | undefined {
    return this.modules.get(id);
  }

  public listAllModules(): ReadonlyArray<ModuleDescriptor> {
    return Array.from(this.modules.values());
  }
}
