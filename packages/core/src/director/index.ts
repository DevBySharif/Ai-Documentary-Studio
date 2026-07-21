import { EventBus } from "../event-bus/index.js";
import { EngineRegistry } from "../engine/registry.js";
import { ProjectStateMachine } from "../state/machine.js";
import { Logger } from "../logger/index.js";
import { DecisionPipeline, type PipelineStep } from "../pipeline/index.js";
import { AIProviderFactory } from "../adapter/factory.js";
import { DNAManager, DNACompiler, DNARegistry, type ChannelDNA, type CompiledDNA } from "../dna/index.js";
import { ProjectDNAManager, type ProjectDNA, type CompiledProjectProfile } from "../project/index.js";
import { NarrativeManager, type NarrativeBlueprint, type NarrativePlannerInput } from "../narrative/index.js";
import { StoryManager, type StoryScript, type StoryGeneratorInput } from "../story/index.js";
import { PromptManager, type PromptPlan, type PIEInput } from "../prompt/index.js";
import { VisualDNAManager } from "../vda/index.js";
import { JobQueue } from "../queue/index.js";
import { CacheManager } from "../cache/index.js";
import { WorkflowOrchestrator } from "../workflow/index.js";
import { ProductionIntelligenceLayer } from "../pil/index.js";
import { RenderPackageBuilder } from "../renderer/index.js";
import { ManifestGenerator } from "../manifest/index.js";
import { ExecutionReportBuilder } from "../report/index.js";
import type { AIProvider } from "../adapter/types.js";
import type { EngineInput, EngineOutput } from "../types/engine.js";
import type { ProjectState } from "../types/project.js";
import type { MotionTimeline } from "../editor/types.js";
import type { AudioIntelligenceResult } from "../audio/types.js";
import type { CategoryScore } from "../quality/types.js";
import type { PILReport } from "../pil/types.js";
import type { RenderPackage } from "../renderer/types.js";
import type { ProjectManifest } from "../manifest/types.js";
import type { ExecutionReport } from "../report/types.js";

export interface DirectorConfig {
  defaultProvider?: "openai" | "gemini" | "claude";
  loggerMaxEntries?: number;
}

export class AIDirector {
  public readonly eventBus: EventBus;
  public readonly registry: EngineRegistry;
  public readonly stateMachine: ProjectStateMachine;
  public readonly logger: Logger;
  public readonly providerFactory: AIProviderFactory;
  public readonly dnaManager: DNAManager;
  public readonly dnaRegistry: DNARegistry;
  public readonly dnaCompiler: DNACompiler;
  public readonly projectDNAManager: ProjectDNAManager;
  public readonly narrativeManager: NarrativeManager;
  public readonly storyManager: StoryManager;
  public readonly promptManager: PromptManager;
  public readonly visualDNAManager: VisualDNAManager;
  private pipeline: DecisionPipeline;
  private activeDNA = new Map<string, CompiledDNA>();
  private activeProjectDNA = new Map<string, CompiledProjectProfile>();
  public readonly jobQueue: JobQueue;
  public readonly cache: CacheManager;
  public readonly workflow: WorkflowOrchestrator;
  public readonly pil: ProductionIntelligenceLayer;
  public readonly renderPackageBuilder: RenderPackageBuilder;
  public readonly manifestGenerator: ManifestGenerator;
  public readonly executionReportBuilder: ExecutionReportBuilder;

  readonly RETRY_POLICY: Record<string, number> = {
    ai_generation: 2,
    image_generation: 3,
    whisper: 2,
    render: 1,
  };

  constructor(config: DirectorConfig = {}) {
    this.eventBus = new EventBus();
    this.registry = new EngineRegistry();
    this.stateMachine = new ProjectStateMachine(this.eventBus);
    this.logger = new Logger(config.loggerMaxEntries);
    this.providerFactory = new AIProviderFactory();
    this.pipeline = new DecisionPipeline();
    this.dnaManager = new DNAManager();
    this.dnaCompiler = new DNACompiler();
    this.dnaRegistry = new DNARegistry(this.dnaManager);
    this.projectDNAManager = new ProjectDNAManager();
    this.narrativeManager = new NarrativeManager();
    this.storyManager = new StoryManager();
    this.promptManager = new PromptManager();
    this.visualDNAManager = new VisualDNAManager();
    this.jobQueue = new JobQueue();
    this.cache = new CacheManager();
    this.workflow = new WorkflowOrchestrator();
    this.pil = new ProductionIntelligenceLayer();
    this.renderPackageBuilder = new RenderPackageBuilder();
    this.manifestGenerator = new ManifestGenerator();
    this.executionReportBuilder = new ExecutionReportBuilder();

    if (config.defaultProvider) {
      this.providerFactory.setDefault(config.defaultProvider);
    }

    this.setupEventLogging();
  }

  loadDNA(dna: ChannelDNA): CompiledDNA {
    this.dnaRegistry.register(dna);
    const compiled = this.dnaCompiler.compile(dna);
    this.activeDNA.set(dna.metadata.id, compiled);

    this.logger.info(
      "director",
      "system",
      "dna:loaded",
      `Loaded DNA: ${dna.metadata.name} v${dna.metadata.version}`,
      { validationScore: compiled.validation.score }
    );

    return compiled;
  }

  getActiveDNA(projectId: string): CompiledDNA | undefined {
    return this.activeDNA.get(projectId);
  }

  getActiveProjectDNA(projectId: string): CompiledProjectProfile | undefined {
    return this.activeProjectDNA.get(projectId);
  }

  setProjectDNA(projectId: string, dnaId: string): boolean {
    const dna = this.dnaManager.get(dnaId);
    if (!dna) return false;

    const compiled = this.dnaCompiler.compile(dna);
    this.activeDNA.set(projectId, compiled);

    this.logger.info(
      "director",
      projectId,
      "dna:assigned",
      `Assigned DNA: ${dna.metadata.name} to project`
    );

    return true;
  }

  generateProjectDNA(
    projectId: string,
    projectName: string,
    topic: string,
    idea: string,
    channelDnaId: string,
    research?: { keyConcepts: string[]; targetAudience?: string; difficulty?: string }
  ): ProjectDNA | null {
    const channelDNA = this.dnaManager.get(channelDnaId);
    if (!channelDNA) {
      this.logger.error("director", projectId, "projectDna:failed", `Channel DNA not found: ${channelDnaId}`);
      return null;
    }

    this.logger.info("director", projectId, "projectDna:generating", `Generating Project DNA for: ${projectName}`);

    const projectDNA = this.projectDNAManager.generate(projectName, topic, idea, channelDNA, research);
    const compiled = this.projectDNAManager.compile(projectDNA.metadata.id);

    if (compiled) {
      this.activeProjectDNA.set(projectId, compiled);
    }

    this.logger.info("director", projectId, "projectDna:generated",
      `Project DNA generated: ${projectDNA.identity.projectName}`,
      { coreEmotion: projectDNA.coreEmotion, validationScore: compiled?.validation.score }
    );

    return projectDNA;
  }

  approveBlueprint(projectId: string): boolean {
    const projectDNA = this.activeProjectDNA.get(projectId);
    if (!projectDNA) return false;

    const approved = this.projectDNAManager.approveBlueprint(projectDNA.source.metadata.id);
    if (approved) {
      const recompiled = this.projectDNAManager.compile(projectDNA.source.metadata.id);
      if (recompiled) {
        this.activeProjectDNA.set(projectId, recompiled);
      }
      this.logger.info("director", projectId, "blueprint:approved", "Project blueprint approved");
    }
    return approved;
  }

  generateNarrativeBlueprint(
    projectId: string,
    channelDnaId: string
  ): NarrativeBlueprint | null {
    const channelDNA = this.dnaManager.get(channelDnaId);
    const projectDNA = this.activeProjectDNA.get(projectId);
    if (!channelDNA || !projectDNA) {
      this.logger.error("director", projectId, "narrative:failed", "Missing Channel DNA or Project DNA");
      return null;
    }

    this.logger.info("director", projectId, "narrative:generating", "Generating Narrative Blueprint");

    const input: NarrativePlannerInput = {
      projectDna: projectDNA.source,
      channelDna: channelDNA,
      research: {
        keyConcepts: [projectDNA.source.identity.primarySubject, ...projectDNA.source.identity.keywords],
        sources: [],
      },
      idea: projectDNA.source.blueprint.coreQuestion,
    };

    const blueprint = this.narrativeManager.generate(input);
    const report = this.narrativeManager.validateBlueprint(blueprint);

    this.logger.info("director", projectId, "narrative:generated",
      `Blueprint: ${blueprint.sceneCount} scenes, ${blueprint.curiosityLoops.length} curiosity loops`,
      { validationScore: report.score, passed: report.passed }
    );

    return blueprint;
  }

  approveNarrativeBlueprint(projectId: string): boolean {
    const projectDNA = this.activeProjectDNA.get(projectId);
    if (!projectDNA) return false;

    const approved = this.narrativeManager.approve(projectDNA.source.metadata.id);
    if (approved) {
      this.stateMachine.transition(projectId, "planning", "Narrative Blueprint approved");
      this.logger.info("director", projectId, "narrative:approved", "Narrative Blueprint approved — ready for Script Engine");
    }
    return approved;
  }

  generateStory(
    projectId: string,
    channelDnaId: string
  ): StoryScript | null {
    const channelDNA = this.dnaManager.get(channelDnaId);
    const projectDNA = this.activeProjectDNA.get(projectId);
    if (!channelDNA || !projectDNA) {
      this.logger.error("director", projectId, "story:failed", "Missing Channel DNA or Project DNA");
      return null;
    }

    const blueprint = this.narrativeManager.get(projectDNA.source.metadata.id);
    if (!blueprint) {
      this.logger.error("director", projectId, "story:failed", "No Narrative Blueprint found — generate blueprint first");
      return null;
    }

    if (!blueprint.metadata.validated) {
      this.logger.error("director", projectId, "story:blocked", "Narrative Blueprint not validated — approve blueprint first");
      return null;
    }

    this.logger.info("director", projectId, "story:generating", "Generating Story Script from Blueprint");

    const input: StoryGeneratorInput = {
      blueprint,
      channelDNA,
      projectDNA: projectDNA.source,
    };

    const script = this.storyManager.generate(input);

    this.logger.info("director", projectId, "story:generated",
      `Script: ${script.metadata.totalScenes} scenes, ${script.metadata.runtime}s runtime`,
      { validationScore: script.metadata.validationScore, passed: script.metadata.validated }
    );

    return script;
  }

  approveStory(projectId: string): boolean {
    const projectDNA = this.activeProjectDNA.get(projectId);
    if (!projectDNA) return false;

    const script = this.storyManager.get(projectDNA.source.metadata.id);
    if (!script) return false;

    const approved = this.storyManager.approve(script.metadata.id);
    if (approved) {
      this.stateMachine.transition(projectId, "writing", "Story Script approved");
      this.logger.info("director", projectId, "story:approved", "Story Script approved — ready for Prompt Engine");
    }
    return approved;
  }

  generatePromptPlan(
    projectId: string,
    channelDnaId: string
  ): PromptPlan | null {
    const channelDNA = this.dnaManager.get(channelDnaId);
    const projectDNA = this.activeProjectDNA.get(projectId);
    if (!channelDNA || !projectDNA) {
      this.logger.error("director", projectId, "prompt:failed", "Missing Channel DNA or Project DNA");
      return null;
    }

    const blueprint = this.narrativeManager.get(projectDNA.source.metadata.id);
    const script = this.storyManager.get(projectDNA.source.metadata.id);
    if (!blueprint || !script) {
      this.logger.error("director", projectId, "prompt:failed", "Missing Blueprint or Script — generate story first");
      return null;
    }

    if (!script.metadata.validated) {
      this.logger.error("director", projectId, "prompt:blocked", "Story Script not validated — approve story first");
      return null;
    }

    this.logger.info("director", projectId, "prompt:generating", "Generating Prompt Intelligence Plan with Visual DNA");

    const visualDNA = this.visualDNAManager.compileWithProject(channelDNA, projectDNA.source);
    this.logger.info("director", projectId, "vda:compiled", `Visual DNA: ${visualDNA.metadata.name}`);

    const input: PIEInput = {
      script,
      blueprint,
      channelDNA,
      projectDNA: projectDNA.source,
    };

    const plan = this.promptManager.generate(input);

    const vdaValidation = this.visualDNAManager.validator.validatePrompts(
      plan.scenePrompts.map((sp) => ({
        sceneIndex: sp.scene,
        imageType: sp.image_type,
        prompt: sp.prompt,
        negativePrompt: sp.negative_prompt,
        reuse: sp.reuse,
        camera: sp.camera,
        motion: sp.motion,
        lighting: "soft_diffuse",
        artStyleLock: { artStyle: visualDNA.art.technique, colorPalette: visualDNA.colors.primary, primaryColors: visualDNA.colors.primary, accentColors: visualDNA.colors.accent, backgroundStyle: visualDNA.environment.backgroundComplexity, lighting: visualDNA.lighting.mood as any, cameraStyle: visualDNA.camera.default, composition: visualDNA.composition.defaultRule, perspective: visualDNA.environment.perspective, outlineThickness: visualDNA.art.outline, negativeSpace: visualDNA.environment.negativeSpaceRules.join(", ") },
        estimatedDuration: sp.estimated_duration,
        concepts: [visualDNA.metaphors[0]?.concept || "unknown"],
        emotion: "calm",
      })),
      visualDNA
    );

    this.logger.info("director", projectId, "prompt:generated",
      `Prompt Plan: ${plan.metadata.totalPrompts} prompts, ${plan.metadata.totalNewImages} new/ ${plan.metadata.totalReuses} reuse | VDA: ${vdaValidation.score}%`,
      { promptScore: plan.metadata.validationScore, vdaScore: vdaValidation.score, vdaPassed: vdaValidation.passed }
    );

    return plan;
  }

  approvePromptPlan(projectId: string): boolean {
    const projectDNA = this.activeProjectDNA.get(projectId);
    if (!projectDNA) return false;

    const plan = this.promptManager.get(projectDNA.source.metadata.id);
    if (!plan) return false;

    const approved = this.promptManager.approve(plan.metadata.id);
    if (approved) {
      this.stateMachine.transition(projectId, "scene_planning", "Prompt Plan approved (includes storyboard)");
      this.logger.info("director", projectId, "prompt:approved", "Prompt Plan approved — ready for Google Flow image generation");
    }
    return approved;
  }

  getDefaultProvider(): AIProvider {
    return this.providerFactory.getDefault();
  }

  async executePipeline(
    projectId: string,
    steps: PipelineStep[],
    initialData: Record<string, unknown>
  ): Promise<{ success: boolean; outputs: EngineOutput[] }> {
    const activeDNA = this.activeDNA.get(projectId);
    if (!activeDNA) {
      this.logger.error("director", projectId, "pipeline:blocked", "No active DNA for project");
      return { success: false, outputs: [] };
    }

    const pipeline = new DecisionPipeline();
    steps.forEach((s) => pipeline.addStep(s));

    const activeProjectDNA = this.activeProjectDNA.get(projectId);

    const input: EngineInput = {
      projectId,
      data: {
        ...initialData,
        _dna: activeDNA.runtime,
        _dnaValidation: activeDNA.validation,
        _projectDna: activeProjectDNA?.runtime,
        _projectDnaValidation: activeProjectDNA?.validation,
        _projectIntelligence: activeProjectDNA?.cache,
      },
    };

    this.logger.info(
      "director",
      projectId,
      "pipeline:start",
      `Executing pipeline with ${steps.length} steps using DNA: ${activeDNA.version}`
    );

    const result = await pipeline.execute(input);

    if (result.success) {
      this.logger.info("director", projectId, "pipeline:complete", "Pipeline completed successfully", {
        stepCount: steps.length,
        decisionCount: result.decisions.length,
      });
    } else {
      const failedStep = steps[result.outputs.length - 1];
      this.logger.error("director", projectId, "pipeline:failed", `Pipeline failed at step: ${failedStep?.name}`, {
        output: result.outputs[result.outputs.length - 1],
      });
    }

    return { success: result.success, outputs: result.outputs };
  }

  async processProject(
    projectId: string,
    idea: string,
    channelDnaId: string,
    projectName?: string
  ): Promise<{ success: boolean; state: ProjectState }> {
    this.logger.info("director", projectId, "project:start", `Processing project: ${idea.slice(0, 50)}...`);

    const channelDNA = this.dnaManager.get(channelDnaId);
    if (!channelDNA) {
      this.logger.error("director", projectId, "project:failed", `Channel DNA not found: ${channelDnaId}`);
      return { success: false, state: "failed" };
    }

    this.activeDNA.set(projectId, this.dnaCompiler.compile(channelDNA));

    const projectDNA = this.generateProjectDNA(
      projectId,
      projectName ?? idea.slice(0, 50),
      idea.slice(0, 80),
      idea,
      channelDnaId
    );

    if (!projectDNA) {
      this.logger.error("director", projectId, "project:failed", "Failed to generate Project DNA");
      return { success: false, state: "failed" };
    }

    await this.stateMachine.transition(projectId, "researching", "AI Director: Channel DNA + Project DNA loaded");

    return { success: true, state: this.stateMachine.getState(projectId) };
  }

  getDecisions(): DecisionPipeline {
    return this.pipeline;
  }

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    category: string,
    projectId: string,
    maxRetries?: number
  ): Promise<{ success: boolean; result?: T; error?: string }> {
    const retries = maxRetries ?? this.RETRY_POLICY[category] ?? 2;
    let lastError: string | undefined;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await operation();
        if (attempt > 0) {
          this.logger.info("director", projectId, `${category}:retry_success`, `Succeeded on retry ${attempt}/${retries}`);
        }
        return { success: true, result };
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
        this.logger.warn("director", projectId, `${category}:retry`, `Attempt ${attempt + 1}/${retries + 1} failed: ${lastError}`);

        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 1000));
        }
      }
    }

    this.logger.error("director", projectId, `${category}:exhausted`, `All ${retries + 1} attempts failed`);
    return { success: false, error: lastError };
  }

  async analyzeProduction(
    projectId: string,
    script: StoryScript,
    promptPlan: PromptPlan,
    audio: AudioIntelligenceResult,
    motionTimeline: MotionTimeline,
    qualityScores: Record<string, CategoryScore>
  ): Promise<PILReport> {
    this.logger.info("director", projectId, "pil:analyzing", "Production Intelligence Layer analyzing project");
    const report = this.pil.analyze(script, promptPlan, audio, motionTimeline, qualityScores);
    this.logger.info("director", projectId, "pil:complete", `PIL readiness: ${report.overallReadiness}%`);
    return report;
  }

  buildRenderPackage(
    projectId: string,
    script: StoryScript,
    promptPlan: PromptPlan,
    audio: AudioIntelligenceResult,
    motionTimeline: MotionTimeline,
    qualityScore: number
  ): RenderPackage {
    this.logger.info("director", projectId, "render:building", "Building immutable render package");
    const pkg = this.renderPackageBuilder.build(projectId, script, promptPlan, audio, motionTimeline, qualityScore);
    const sealed = this.renderPackageBuilder.seal(pkg);
    this.logger.info("director", projectId, "render:sealed", `Render package sealed: ${sealed.metadata.imageCount} images, ${sealed.metadata.totalDuration}s`);
    return sealed;
  }

  generateManifest(
    projectId: string,
    channelDna: string,
    script: StoryScript,
    promptPlan: PromptPlan,
    voice: string,
    qualityScore: number,
    warnings: string[]
  ): ProjectManifest {
    const manifest = this.manifestGenerator.generate(projectId, channelDna, script, promptPlan, voice, qualityScore, warnings);
    this.cache.set(`manifest_${projectId}`, "project_manifest", manifest);
    this.logger.info("director", projectId, "manifest:generated", `Manifest: ${manifest.runtime}s, ${manifest.imageCount} images, ${manifest.reuseRate}% reuse`);
    return manifest;
  }

  generateExecutionReport(
    projectId: string,
    params: {
      totalRuntime: number;
      imagesGenerated: number;
      imagesReused: number;
      promptCount: number;
      motionCount: number;
      renderDuration: number;
      qualityScore: number;
      synchronizationScore: number;
      errors: string[];
      warnings: string[];
      engineTimings: Array<{ engine: string; durationMs: number }>;
    }
  ): ExecutionReport {
    this.logger.info("director", projectId, "report:generating", "Generating production execution report");
    return this.executionReportBuilder.build({ ...params, projectId });
  }

  private setupEventLogging(): void {
    this.eventBus.on("engine:before", (payload) => {
      this.logger.info(
        payload.engine as string,
        payload.projectId as string,
        "engine:before",
        `Engine starting execution`
      );
    });

    this.eventBus.on("engine:after", (payload) => {
      const output = payload.output as EngineOutput;
      this.logger.info(
        payload.engine as string,
        payload.projectId as string,
        "engine:after",
        `Engine completed with confidence ${output.confidence}`,
        { duration: payload.duration, confidence: output.confidence }
      );
    });

    this.eventBus.on("engine:error", (payload) => {
      const output = payload.output as EngineOutput;
      this.logger.error(
        payload.engine as string,
        payload.projectId as string,
        "engine:error",
        `Engine failed`,
        { errors: output.errors, error: payload.error }
      );
    });

    this.eventBus.on("state:changed", (payload) => {
      this.logger.info(
        "stateMachine",
        payload.projectId as string,
        "state:changed",
        `State transition: ${payload.from} → ${payload.to}`,
        { reason: payload.reason }
      );
    });
  }
}
