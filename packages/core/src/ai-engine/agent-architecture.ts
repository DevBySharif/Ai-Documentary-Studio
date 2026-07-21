import { TaskType } from "./model-router";

export interface AgentTaskRequest {
  readonly taskId: string;
  readonly prompt: string;
  readonly contextData?: Record<string, unknown>;
}

export interface AgentTaskResponse {
  readonly taskId: string;
  readonly agentName: string;
  readonly result: string;
  readonly status: "Completed" | "Failed";
}

/**
 * Base Specialized Agent class (IB Part 18 - Section 10, Section 20).
 * Agents cooperate through structured task handoffs rather than free-form chat.
 */
export abstract class BaseAgent {
  abstract readonly agentName: string;
  abstract readonly taskType: TaskType;

  public abstract executeTask(request: AgentTaskRequest): Promise<AgentTaskResponse>;
}

export class ResearchAgent extends BaseAgent {
  public readonly agentName = "ResearchAgent";
  public readonly taskType: TaskType = "Research";

  public async executeTask(request: AgentTaskRequest): Promise<AgentTaskResponse> {
    return {
      taskId: request.taskId,
      agentName: this.agentName,
      result: `[Research Summary]: ${request.prompt}`,
      status: "Completed",
    };
  }
}

export class ScriptAgent extends BaseAgent {
  public readonly agentName = "ScriptAgent";
  public readonly taskType: TaskType = "Scriptwriting";

  public async executeTask(request: AgentTaskRequest): Promise<AgentTaskResponse> {
    return {
      taskId: request.taskId,
      agentName: this.agentName,
      result: `[Script Draft]: ${request.prompt}`,
      status: "Completed",
    };
  }
}

export class StoryboardAgent extends BaseAgent {
  public readonly agentName = "StoryboardAgent";
  public readonly taskType: TaskType = "Storyboard";

  public async executeTask(request: AgentTaskRequest): Promise<AgentTaskResponse> {
    return {
      taskId: request.taskId,
      agentName: this.agentName,
      result: `[Storyboard Plan]: ${request.prompt}`,
      status: "Completed",
    };
  }
}

export class TimelineAgent extends BaseAgent {
  public readonly agentName = "TimelineAgent";
  public readonly taskType: TaskType = "TimelineEdit";

  public async executeTask(request: AgentTaskRequest): Promise<AgentTaskResponse> {
    return {
      taskId: request.taskId,
      agentName: this.agentName,
      result: `[Timeline Edit Structure]: ${request.prompt}`,
      status: "Completed",
    };
  }
}

export class AssetSelectionAgent extends BaseAgent {
  public readonly agentName = "AssetSelectionAgent";
  public readonly taskType: TaskType = "AssetSelection";

  public async executeTask(request: AgentTaskRequest): Promise<AgentTaskResponse> {
    return {
      taskId: request.taskId,
      agentName: this.agentName,
      result: `[Asset Match List]: ${request.prompt}`,
      status: "Completed",
    };
  }
}

export class VoiceoverAgent extends BaseAgent {
  public readonly agentName = "VoiceoverAgent";
  public readonly taskType: TaskType = "Voiceover";

  public async executeTask(request: AgentTaskRequest): Promise<AgentTaskResponse> {
    return {
      taskId: request.taskId,
      agentName: this.agentName,
      result: `[Voiceover Plan]: ${request.prompt}`,
      status: "Completed",
    };
  }
}

export class QaAgent extends BaseAgent {
  public readonly agentName = "QaAgent";
  public readonly taskType: TaskType = "QA";

  public async executeTask(request: AgentTaskRequest): Promise<AgentTaskResponse> {
    return {
      taskId: request.taskId,
      agentName: this.agentName,
      result: `[QA Verification Passed]: ${request.prompt}`,
      status: "Completed",
    };
  }
}
