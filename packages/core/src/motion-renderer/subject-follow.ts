export class MRSubjectFollowMode {
  private target: { x: number; y: number } | null = null;

  setTarget(x: number, y: number): void {
    this.target = { x, y };
  }

  clearTarget(): void {
    this.target = null;
  }

  follow(currentX: number, currentY: number, smoothing = 0.1): { x: number; y: number } {
    if (!this.target) return { x: currentX, y: currentY };
    return {
      x: currentX + (this.target.x - currentX) * smoothing,
      y: currentY + (this.target.y - currentY) * smoothing
    };
  }

  hasTarget(): boolean {
    return this.target !== null;
  }

  getTarget(): { x: number; y: number } | null {
    return this.target ? { ...this.target } : null;
  }
}
