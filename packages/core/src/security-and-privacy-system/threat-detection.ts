import { SecurityIncident } from './types';

export class ThreatDetection {
  private incidents: SecurityIncident[] = [];

  detectSuspiciousFileAccess(path: string): void {
    if (path.includes('.env') || path.includes('keys')) {
      this.recordIncident("Suspicious File Access", "High", `Attempted access to protected path: ${path}`);
    }
  }

  detectInvalidPluginBehavior(pluginId: string, action: string): void {
    this.recordIncident("Invalid Plugin Behavior", "Critical", `Plugin ${pluginId} attempted unauthorized action: ${action}`);
  }

  private recordIncident(threatType: string, severity: "Low" | "Medium" | "High" | "Critical", description: string): void {
    const incident: SecurityIncident = {
      id: `inc_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      threatType,
      severity,
      description,
      resolved: false
    };
    this.incidents.push(incident);
    console.warn(`[THREAT DETECTED] ${severity} - ${threatType}: ${description}`);
  }
  
  getActiveIncidents(): SecurityIncident[] {
    return this.incidents.filter(i => !i.resolved);
  }
}
