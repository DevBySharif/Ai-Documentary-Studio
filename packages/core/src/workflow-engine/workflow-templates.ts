import { WorkflowTask } from "./task-graph";

export type TemplateType =
  | "ShortDocumentary"
  | "LongDocumentary"
  | "HistoricalDocumentary"
  | "EducationalDocumentary"
  | "NewsAnalysis"
  | "Biography"
  | "Custom";

export interface WorkflowTemplate {
  readonly templateId: string;
  readonly name: string;
  readonly type: TemplateType;
  readonly version: number; // Section 24 Versioning
  readonly tasks: ReadonlyArray<WorkflowTask>;
}

/**
 * Declarative Workflow Templates (IB Part 20 - Section 6, Section 11, Section 20).
 * Default sequence: Research -> Outline -> Script -> Storyboard -> Asset Planning -> Voice Planning -> Timeline Assembly -> Review -> Render Preparation.
 */
export class WorkflowTemplateRegistry {
  private templates = new Map<TemplateType, WorkflowTemplate>();

  constructor() {
    this.initDefaultTemplates();
  }

  private initDefaultTemplates(): void {
    const historicalTasks: WorkflowTask[] = [
      { taskId: "t_research", taskType: "Research", title: "Historical Research", responsibleAgent: "ResearchAgent", dependencies: [], requiredInputs: ["topic"], expectedOutputs: ["researchData"], state: "Pending", retryPolicy: { maxRetries: 3, retryCount: 0, backoffMs: 1000 }, requiresApproval: true },
      { taskId: "t_outline", taskType: "Outline", title: "Script Outline", responsibleAgent: "ScriptAgent", dependencies: ["t_research"], requiredInputs: ["researchData"], expectedOutputs: ["outlineDoc"], state: "Pending", retryPolicy: { maxRetries: 3, retryCount: 0, backoffMs: 1000 }, requiresApproval: false },
      { taskId: "t_script", taskType: "Script", title: "Full Scriptwriting", responsibleAgent: "ScriptAgent", dependencies: ["t_outline"], requiredInputs: ["outlineDoc"], expectedOutputs: ["scriptText"], state: "Pending", retryPolicy: { maxRetries: 3, retryCount: 0, backoffMs: 1000 }, requiresApproval: true },
      { taskId: "t_storyboard", taskType: "Storyboard", title: "Visual Storyboard", responsibleAgent: "StoryboardAgent", dependencies: ["t_script"], requiredInputs: ["scriptText"], expectedOutputs: ["storyboardPlan"], state: "Pending", retryPolicy: { maxRetries: 3, retryCount: 0, backoffMs: 1000 }, requiresApproval: true },
      { taskId: "t_asset_plan", taskType: "AssetPlanning", title: "Asset Selection Plan", responsibleAgent: "AssetSelectionAgent", dependencies: ["t_storyboard"], requiredInputs: ["storyboardPlan"], expectedOutputs: ["matchedAssets"], state: "Pending", retryPolicy: { maxRetries: 3, retryCount: 0, backoffMs: 1000 }, requiresApproval: false },
      { taskId: "t_voice_plan", taskType: "VoicePlanning", title: "Voiceover Narration Plan", responsibleAgent: "VoiceoverAgent", dependencies: ["t_script"], requiredInputs: ["scriptText"], expectedOutputs: ["audioFiles"], state: "Pending", retryPolicy: { maxRetries: 3, retryCount: 0, backoffMs: 1000 }, requiresApproval: false },
      { taskId: "t_timeline_asm", taskType: "TimelineAssembly", title: "NLE Timeline Assembly", responsibleAgent: "TimelineAgent", dependencies: ["t_asset_plan", "t_voice_plan"], requiredInputs: ["matchedAssets", "audioFiles"], expectedOutputs: ["timelineId"], state: "Pending", retryPolicy: { maxRetries: 3, retryCount: 0, backoffMs: 1000 }, requiresApproval: true },
      { taskId: "t_review", taskType: "Review", title: "Quality Assurance Review", responsibleAgent: "QaAgent", dependencies: ["t_timeline_asm"], requiredInputs: ["timelineId"], expectedOutputs: ["qaReport"], state: "Pending", retryPolicy: { maxRetries: 3, retryCount: 0, backoffMs: 1000 }, requiresApproval: true },
      { taskId: "t_render_prep", taskType: "RenderPreparation", title: "Final Render Staging", responsibleAgent: "QaAgent", dependencies: ["t_review"], requiredInputs: ["qaReport"], expectedOutputs: ["exportJobId"], state: "Pending", retryPolicy: { maxRetries: 3, retryCount: 0, backoffMs: 1000 }, requiresApproval: false },
    ];

    const historicalTemplate: WorkflowTemplate = {
      templateId: "tmpl_historical_v1",
      name: "Historical Documentary",
      type: "HistoricalDocumentary",
      version: 1,
      tasks: historicalTasks,
    };

    this.templates.set("HistoricalDocumentary", historicalTemplate);
  }

  public getTemplate(type: TemplateType): WorkflowTemplate | undefined {
    return this.templates.get(type);
  }
}
