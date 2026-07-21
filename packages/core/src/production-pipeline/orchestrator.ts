import type { PipelineInput, ProductionStage, RenderMode, RenderTask, StageContext, RenderScene, ConstructedFrame, EncoderOutput } from "./types.js";
import type { RenderBackend } from "./types.js";
import { ProductionStateMachine } from "./state-machine.js";
import { SceneBuilder } from "./stages/scene.js";
import { CameraBuilder } from "./stages/camera.js";
import { MotionBuilder } from "./stages/motion.js";
import { EffectsBuilder } from "./stages/effects.js";
import { SubtitleBuilder } from "./stages/subtitle.js";
import { AudioBuilder } from "./stages/audio.js";
import { FrameBuilder } from "./stages/frame.js";
import { Encoder } from "./stages/encoder.js";
import { GpuTaskManager } from "./gpu-task-manager.js";

export class RenderOrchestrator {
  private stateMachine: ProductionStateMachine;
  private gpuManager: GpuTaskManager;
  private backends: RenderBackend[] = [];
  private sceneBuilder = new SceneBuilder();
  private cameraBuilder = new CameraBuilder();
  private motionBuilder = new MotionBuilder();
  private effectsBuilder = new EffectsBuilder();
  private subtitleBuilder = new SubtitleBuilder();
  private audioBuilder = new AudioBuilder();
  private frameBuilder = new FrameBuilder();
  private encoder = new Encoder();

  constructor() {
    this.stateMachine = new ProductionStateMachine();
    this.gpuManager = new GpuTaskManager();
  }

  getStateMachine(): ProductionStateMachine {
    return this.stateMachine;
  }

  getGpuManager(): GpuTaskManager {
    return this.gpuManager;
  }

  registerBackend(backend: RenderBackend): void {
    this.backends.push(backend);
  }

  private getBackend(mode: RenderMode): RenderBackend | null {
    return this.backends.find((b) => b.canHandle(mode)) ?? null;
  }

  async render(input: PipelineInput, mode: RenderMode): Promise<EncoderOutput> {
    this.stateMachine.transition("building");

    const context: StageContext = { input, state: {}, errors: [], warnings: [] };
    const stages: ProductionStage[] = [
      "asset_loader", "scene_builder", "camera_builder", "motion_builder",
      "effects_builder", "subtitle_builder", "audio_builder", "frame_builder", "encoder"
    ];

    const schedule = this.scheduleTasks(stages).sort((a, b) => a.priority - b.priority);
    this.gpuManager.allocate(schedule.filter((t) => t.gpuRequired));

    this.stateMachine.transition("rendering");

    const backend = this.getBackend(mode);
    if (backend) {
      return await backend.render(input, mode);
    }

    for (const stage of stages) {
      const result = await this.executeStage(stage, context, mode);
      if (!result.success) {
        this.stateMachine.markFailed();
        throw new Error(`Stage ${stage} failed: ${result.error}`);
      }
    }

    this.stateMachine.transition("validating");
    this.stateMachine.transition("encoding");

    const scenes = context.state.scenes as RenderScene[];
    const totalFrames = scenes.length > 0 ? scenes[scenes.length - 1].timing.endFrame : 0;
    const output = await this.encoder.encode(
      context.state.frames as ConstructedFrame[] ?? [],
      input.renderProfile,
      totalFrames
    );

    this.stateMachine.transition("completed");
    this.gpuManager.releaseAll();

    return output;
  }

  private scheduleTasks(stages: ProductionStage[]): RenderTask[] {
    return stages.map((stage, i) => ({
      taskId: `task_${stage}_${Date.now()}`,
      stage,
      priority: i,
      gpuRequired: ["motion_builder", "effects_builder", "encoder"].includes(stage),
      estimateMs: 1000
    }));
  }

  private async executeStage(stage: ProductionStage, context: StageContext, mode: RenderMode): Promise<{ success: boolean; error?: string }> {
    try {
      switch (stage) {
        case "scene_builder": {
          const scenes = this.sceneBuilder.build(context);
          context.state.scenes = scenes;
          break;
        }
        case "camera_builder": {
          const scenes = context.state.scenes as RenderScene[];
          if (scenes) this.cameraBuilder.build(scenes);
          break;
        }
        case "motion_builder": {
          this.motionBuilder.build(context);
          break;
        }
        case "effects_builder": {
          const scenes = context.state.scenes as RenderScene[];
          const effects = this.effectsBuilder.apply(context.input.channelDNA, scenes?.length ?? 0);
          if (scenes) {
            for (let i = 0; i < scenes.length; i++) {
              scenes[i].effects = effects[i] ?? [];
            }
          }
          break;
        }
        case "subtitle_builder": {
          this.subtitleBuilder.build(context.input.subtitleTimeline);
          break;
        }
        case "audio_builder": {
          const scenes = context.state.scenes as RenderScene[];
          const totalFrames = scenes?.length ? scenes[scenes.length - 1].timing.endFrame : 0;
          this.audioBuilder.sync(context.input.voiceTrack, totalFrames);
          break;
        }
        case "frame_builder": {
          const scenes = context.state.scenes as RenderScene[];
          const totalFrames = scenes?.length ? scenes[scenes.length - 1].timing.endFrame : 0;
          const frames = this.frameBuilder.construct(scenes ?? [], totalFrames);
          context.state.frames = frames;
          break;
        }
        case "encoder":
        case "asset_loader":
          break;
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }
}
