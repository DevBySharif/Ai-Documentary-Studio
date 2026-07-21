export interface CreateProjectPayload {
  name: string;
  templateId?: string;
}

export interface ProjectDto {
  id: string;
  name: string;
  createdAt: string;
}

export const ProjectChannels = {
  CREATE: "project:create",
  GET_BY_ID: "project:getById",
  ON_UPDATED: "project:updated",
} as const;
