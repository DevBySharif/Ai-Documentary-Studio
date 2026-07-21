import { api } from "./api";
import type { Project } from "@/types";

export const projectService = {
  list: () => api.get<Project[]>("/projects"),

  get: (id: string) => api.get<Project>(`/projects/${id}`),

  create: (data: Partial<Project>) =>
    api.post<Project>("/projects", data),

  update: (id: string, data: Partial<Project>) =>
    api.put<Project>(`/projects/${id}`, data),

  delete: (id: string) => api.delete<void>(`/projects/${id}`),
};
