import { Repository } from "./repository";
import { Timeline } from "../models/timeline";

export interface TimelineRepository extends Repository<Timeline, string> {
  findByProjectId(projectId: string): Promise<Timeline | undefined>;
}
