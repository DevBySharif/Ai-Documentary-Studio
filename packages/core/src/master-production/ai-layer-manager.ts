import type { MPAIComponent } from "./types.js";

export class MPAILayerManager {
  private readonly components: MPAIComponent[] = [
    "script_gpt", "prompt_gpt", "image_analyzer", "audio_intelligence", "production_director", "qa_ai"
  ];

  getComponents(): MPAIComponent[] {
    return [...this.components];
  }

  isAIComponent(component: string): component is MPAIComponent {
    return this.components.includes(component as MPAIComponent);
  }

  getContractOutput(component: MPAIComponent): string {
    const map: Record<MPAIComponent, string> = {
      script_gpt: "script_package",
      prompt_gpt: "prompt_package",
      image_analyzer: "analysis_report",
      audio_intelligence: "audio_timeline",
      production_director: "production_decision",
      qa_ai: "qa_report"
    };
    return map[component];
  }
}
