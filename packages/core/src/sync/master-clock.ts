export class SyncMasterClock {
  private audioDuration: number = 0;

  setDuration(duration: number): void {
    this.audioDuration = duration;
  }

  getDuration(): number {
    return this.audioDuration;
  }

  align(time: number): number {
    return Math.max(0, Math.min(time, this.audioDuration));
  }

  isBefore(time: number, reference: number): boolean {
    return this.align(time) < this.align(reference);
  }

  isAfter(time: number, reference: number): boolean {
    return this.align(time) > this.align(reference);
  }

  isWithin(time: number, start: number, end: number): boolean {
    const t = this.align(time);
    return t >= this.align(start) && t <= this.align(end);
  }

  durationBetween(start: number, end: number): number {
    return Math.abs(this.align(end) - this.align(start));
  }
}
