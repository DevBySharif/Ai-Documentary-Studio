import type { EngineInput, EngineOutput } from "../types/engine.js";
import { EventBus } from "../event-bus/index.js";

export abstract class BaseEngine {
  public readonly name: string;
  public readonly version: string;
  protected eventBus: EventBus;

  constructor(name: string, version: string, eventBus: EventBus) {
    this.name = name;
    this.version = version;
    this.eventBus = eventBus;
  }

  abstract validate(input: EngineInput): boolean;
  abstract process(input: EngineInput): Promise<EngineOutput>;

  async execute(input: EngineInput): Promise<EngineOutput> {
    const startTime = performance.now();

    await this.eventBus.emit("engine:before", {
      engine: this.name,
      projectId: input.projectId,
      timestamp: new Date().toISOString(),
    });

    if (!this.validate(input)) {
      const output: EngineOutput = {
        success: false,
        confidence: 0,
        data: {},
        warnings: ["Input validation failed"],
        errors: ["Required fields missing or invalid"],
      };

      await this.eventBus.emit("engine:error", {
        engine: this.name,
        projectId: input.projectId,
        output,
        timestamp: new Date().toISOString(),
      });

      return output;
    }

    try {
      const output = await this.process(input);
      const duration = performance.now() - startTime;

      await this.eventBus.emit("engine:after", {
        engine: this.name,
        projectId: input.projectId,
        output,
        duration,
        timestamp: new Date().toISOString(),
      });

      return output;
    } catch (error) {
      const output: EngineOutput = {
        success: false,
        confidence: 0,
        data: {},
        warnings: [],
        errors: [error instanceof Error ? error.message : "Unknown error"],
      };

      await this.eventBus.emit("engine:error", {
        engine: this.name,
        projectId: input.projectId,
        output,
        error,
        timestamp: new Date().toISOString(),
      });

      return output;
    }
  }
}
