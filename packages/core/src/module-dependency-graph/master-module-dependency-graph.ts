import { CircularDependencyDetector } from "./circular-dependency-detector";
import { EngineLifecycleOrchestrator } from "./engine-lifecycle-orchestrator";
import { StartupShutdownSequenceManager } from "./startup-shutdown-sequence-manager";
import { CommandEventDataFlowDispatcher } from "./command-event-data-flow-dispatcher";
import { BackgroundWorkerQueue } from "./background-worker-queue";
import { ModuleDomainOwnership } from "./dependency-types";

/**
 * Master Module Dependency Graph Engine (Main Vol 06 Part 02).
 * Orchestrates the production pipeline DAG (ProjectManager -> Research -> Script -> Storyboard -> Prompt -> Image -> Voice -> Timeline -> Review -> Export),
 * cross-cutting services, domain ownership boundaries, and cycle prevention.
 */
export class MasterModuleDependencyGraph {
  public readonly cycleDetector = new CircularDependencyDetector();
  public readonly lifecycleOrchestrator = new EngineLifecycleOrchestrator();
  public readonly sequenceManager = new StartupShutdownSequenceManager();
  public readonly dispatcher = new CommandEventDataFlowDispatcher();
  public readonly workerQueue = new BackgroundWorkerQueue();

  constructor() {
    this.initPipelineDag();
  }

  private initPipelineDag(): void {
    // Add forward production pipeline dependencies (Section 3)
    this.cycleDetector.addDependency("ProjectManager", "ResearchEngine");
    this.cycleDetector.addDependency("ResearchEngine", "ScriptEngine");
    this.cycleDetector.addDependency("ScriptEngine", "StoryboardEngine");
    this.cycleDetector.addDependency("StoryboardEngine", "PromptEngine");
    this.cycleDetector.addDependency("PromptEngine", "ImageEngine");
    this.cycleDetector.addDependency("ImageEngine", "VoiceEngine");
    this.cycleDetector.addDependency("VoiceEngine", "TimelineEngine");
    this.cycleDetector.addDependency("TimelineEngine", "ReviewEngine");
    this.cycleDetector.addDependency("ReviewEngine", "ExportEngine");
  }

  public getDomainOwnershipList(): ReadonlyArray<ModuleDomainOwnership> {
    return [
      { moduleName: "ResearchEngine", ownedEntities: ["Sources", "Evidence", "Citations"] },
      { moduleName: "ScriptEngine", ownedEntities: ["Script Documents", "Scenes"] },
      { moduleName: "StoryboardEngine", ownedEntities: ["Shots", "Camera Plans"] },
      { moduleName: "PromptEngine", ownedEntities: ["Prompt Templates", "Variables"] },
      { moduleName: "ImageEngine", ownedEntities: ["Image Generation Jobs", "Candidates"] },
      { moduleName: "VoiceEngine", ownedEntities: ["Narration Audio", "Recordings"] },
      { moduleName: "TimelineEngine", ownedEntities: ["Timeline Composition", "Tracks"] },
      { moduleName: "ReviewEngine", ownedEntities: ["QA Reports", "Approvals"] },
      { moduleName: "ExportEngine", ownedEntities: ["Rendering", "Delivery Packages"] },
    ];
  }
}
