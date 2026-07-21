import type { PDProjectStage } from "./types.js";

export class PDFutureAutonomousMode {
  private supported: boolean = true;

  isSupported(): boolean {
    return this.supported;
  }

  getWorkflow(): string[] {
    return ["topic", "script", "prompts", "images", "voice", "timeline", "video", "qa", "export"];
  }

  getCheckpoints(): PDProjectStage[] {
    return ["planning", "review", "qa", "export"];
  }

  enable(): void {
    this.supported = true;
  }

  disable(): void {
    this.supported = false;
  }
}
