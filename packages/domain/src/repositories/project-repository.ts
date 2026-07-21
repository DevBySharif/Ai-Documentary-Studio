import { Repository } from "./repository";
import { Project } from "../models/project";

export interface ProjectRepository extends Repository<Project, string> {
  findByName(name: string): Promise<Project | undefined>;
  findAllByWorkspace(workspaceId: string): Promise<ReadonlyArray<Project>>;
}
