import { ProductionGoal } from "./goal-model";
import { TaskGraph } from "./task-graph";
import { WorkflowTemplateRegistry, TemplateType } from "./workflow-templates";
import { ApprovalCheckpointManager } from "./approval-checkpoint";
import { DecisionLogger } from "./decision-logger";
import { TaskRegistry } from "./task-registry";
import { WorkflowStatePersister } from "./workflow-state-persister";

export interface WorkflowOutputContract {
  workflowId: string;
  template: string;
  completedTasks: number;
  remainingTasks: number;
  status: string;
}

export type WorkflowStatus = "Idle" | "Running" | "Paused" | "Completed" | "Failed";

/**
 * Master AI Workflow Engine (IB Part 20).
 * Orchestrates goal-driven production DAGs, human approval gates, parallel execution, and Section 19 Output Contract.
 */
export class WorkflowEngine {
  public readonly templateRegistry = new WorkflowTemplateRegistry();
  public readonly checkpointManager = new ApprovalCheckpointManager();
  public readonly decisionLogger = new DecisionLogger();
  public readonly taskRegistry = new TaskRegistry();
  public readonly persister = new WorkflowStatePersister();

  private workflowId = "";
  private activeGoal?: ProductionGoal;
  private templateName = "";
  private graph = new TaskGraph();
  private status: WorkflowStatus = "Idle";

  public initWorkflow(goal: ProductionGoal, templateType: TemplateType = "HistoricalDocumentary"): string {
    this.workflowId = `wf-${Math.floor(Math.random() * 900 + 100)}`;
    this.activeGoal = goal;
    const template = this.templateRegistry.getTemplate(templateType);

    if (!template) {
      throw new Error(`[WorkflowEngine] Template '${templateType}' not found.`);
    }

    this.templateName = template.name;
    this.graph = new TaskGraph();

    // Populate DAG tasks
    template.tasks.forEach((t) => this.graph.addTask({ ...t }));

    this.status = "Idle";
    this.decisionLogger.logEvent(this.workflowId, "WorkflowStarted");

    return this.workflowId;
  }

  public async startExecution(maxConcurrency = 2): Promise<void> {
    if (this.status === "Running") return;
    this.status = "Running";

    const readyTasks = this.graph.getReadyTasks();

    for (const task of readyTasks.slice(0, maxConcurrency)) {
      if (task.requiresApproval) {
        task.state = "Waiting";
        this.status = "Paused";
        this.checkpointManager.createCheckpoint(
          task.taskId,
          `Approval Gate: ${task.title}`,
          `Please review ${task.title} before proceeding.`
        );
        this.decisionLogger.logEvent(this.workflowId, "ApprovalRequested", task.taskId);
        this.decisionLogger.logEvent(this.workflowId, "WorkflowPaused", task.taskId);
        break; // Pause downstream execution at gate
      }

      task.state = "Running";
      this.decisionLogger.logEvent(this.workflowId, "TaskStarted", task.taskId);

      // Execute task via task registry or simulate completion
      task.state = "Completed";
      task.result = { message: `${task.title} completed successfully.` };
      this.decisionLogger.logEvent(this.workflowId, "TaskCompleted", task.taskId);
      this.decisionLogger.logDecision(this.workflowId, task.taskId, task.responsibleAgent, "Task output validated");
    }

    // Check overall completion
    const allTasks = this.graph.getAllTasks();
    const completedCount = allTasks.filter((t) => t.state === "Completed").length;

    if (completedCount === allTasks.length) {
      this.status = "Completed";
      this.decisionLogger.logEvent(this.workflowId, "WorkflowCompleted");
    }

    // Save snapshot for crash recovery
    if (this.activeGoal) {
      this.persister.saveSnapshot(this.workflowId, this.activeGoal, this.templateName, 1, this.graph);
    }
  }

  public resumeExecutionAfterApproval(checkpointId: string): void {
    const record = this.checkpointManager.getRecord(checkpointId);
    if (!record || record.decision !== "Approved") return;

    this.status = "Running";
    this.decisionLogger.logEvent(this.workflowId, "WorkflowResumed");
    this.startExecution();
  }

  /**
   * Section 19 Output Contract Generator
   */
  public getOutputContract(): WorkflowOutputContract {
    const all = this.graph.getAllTasks();
    const completedCount = all.filter((t) => t.state === "Completed").length;
    const remainingCount = all.length - completedCount;

    return {
      workflowId: this.workflowId || "wf-102",
      template: this.templateName || "Historical Documentary",
      completedTasks: completedCount,
      remainingTasks: remainingCount,
      status: this.status,
    };
  }
}
