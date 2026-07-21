import { IpcWrapper } from "../ipc/ipc-wrapper";
import { Disposable } from "../events/disposable";
import { CreateProjectPayload, ProjectDto, ProjectChannels } from "../contracts/project.contracts";

export interface ProjectApi {
  create(payload: CreateProjectPayload): Promise<ProjectDto>;
  getById(id: string): Promise<ProjectDto | null>;
  onProjectUpdated(callback: (project: ProjectDto) => void): Disposable;
}

export const projectApi: ProjectApi = {
  create(payload: CreateProjectPayload): Promise<ProjectDto> {
    return IpcWrapper.invoke(ProjectChannels.CREATE, payload);
  },
  
  getById(id: string): Promise<ProjectDto | null> {
    return IpcWrapper.invoke(ProjectChannels.GET_BY_ID, id);
  },
  
  onProjectUpdated(callback: (project: ProjectDto) => void): Disposable {
    return IpcWrapper.subscribe(ProjectChannels.ON_UPDATED, callback);
  }
};
