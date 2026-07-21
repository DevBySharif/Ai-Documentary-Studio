import type { ProjectMemoryState, SceneMemoryEntry } from "./types.js";

export class ProjectMemoryStore {
  private projects = new Map<string, ProjectMemoryState>();
  private scenes = new Map<string, Map<number, SceneMemoryEntry>>();

  initProject(projectId: string): ProjectMemoryState {
    const state: ProjectMemoryState = {
      projectId,
      currentStage: "created",
      currentScene: 0,
      completedScenes: [],
      currentRuntime: 0,
      activeCharacter: "",
      activeSymbols: [],
      activeColorMood: "neutral",
      storyProgress: 0,
    };
    this.projects.set(projectId, state);
    this.scenes.set(projectId, new Map());
    return state;
  }

  getProject(projectId: string): ProjectMemoryState | undefined {
    return this.projects.get(projectId);
  }

  updateStage(projectId: string, stage: string): void {
    const p = this.projects.get(projectId);
    if (p) p.currentStage = stage;
  }

  getScene(projectId: string, scene: number): SceneMemoryEntry | undefined {
    return this.scenes.get(projectId)?.get(scene);
  }

  setScene(projectId: string, scene: SceneMemoryEntry): void {
    const map = this.scenes.get(projectId);
    if (map) map.set(scene.sceneNumber, scene);
  }

  completeScene(projectId: string, sceneNumber: number): void {
    const p = this.projects.get(projectId);
    if (p && !p.completedScenes.includes(sceneNumber)) {
      p.completedScenes.push(sceneNumber);
      p.currentScene = sceneNumber + 1;
      p.storyProgress = Math.round((p.completedScenes.length / Math.max(p.completedScenes.length + 3, 1)) * 100);
    }
  }

  addImageToScene(projectId: string, sceneNumber: number, imageId: string): void {
    const scene = this.scenes.get(projectId)?.get(sceneNumber);
    if (scene) scene.generatedImages.push(imageId);
  }
}
