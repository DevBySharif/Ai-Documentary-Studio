import { createStore } from "../core/create-store";

export interface WorkspaceState {
  activeProjectId: string | null;
  theme: "light" | "dark" | "system";
  language: string;
}

export const workspaceStore = createStore<WorkspaceState>({
  activeProjectId: null,
  theme: "system",
  language: "en-US",
});

export const workspaceActions = {
  setActiveProject(projectId: string) {
    workspaceStore.setState(() => ({ activeProjectId: projectId }));
  },
  setTheme(theme: "light" | "dark" | "system") {
    workspaceStore.setState(() => ({ theme }));
  }
};
