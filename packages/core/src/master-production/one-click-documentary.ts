export class MPOneClickDocumentary {
  private readonly workflow: string[] = [
    "topic", "channel_dna", "ai_planning", "script", "prompts",
    "images", "voice", "timeline", "motion", "effects",
    "qa", "export", "ready_to_upload"
  ];

  private currentIndex = -1;

  getWorkflow(): string[] {
    return [...this.workflow];
  }

  getCurrentStep(): string | null {
    return this.currentIndex >= 0 ? this.workflow[this.currentIndex] : null;
  }

  advance(): string | null {
    if (this.currentIndex < this.workflow.length - 1) {
      this.currentIndex++;
      return this.workflow[this.currentIndex];
    }
    return null;
  }

  getCheckpoints(): string[] {
    return ["ai_planning", "script", "qa", "ready_to_upload"];
  }

  isComplete(): boolean {
    return this.currentIndex >= this.workflow.length - 1;
  }

  reset(): void {
    this.currentIndex = -1;
  }
}
