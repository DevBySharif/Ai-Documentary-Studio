import { IncidentRecord } from './types';

export class AutomaticIncidentLog {
  private log: IncidentRecord[] = [];

  recordEvent(event: string, details: string, durationMs?: number): void {
    const record: IncidentRecord = {
      id: `inc_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      event,
      details,
      durationMs
    };
    this.log.push(record);
    this.persistLog(record);
  }

  getRecentIncidents(limit: number = 10): IncidentRecord[] {
    return this.log.slice(-limit);
  }

  private persistLog(record: IncidentRecord): void {
    // Append to a rolling JSON line log on disk
  }
}
