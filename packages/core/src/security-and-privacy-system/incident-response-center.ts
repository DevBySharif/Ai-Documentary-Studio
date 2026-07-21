import { ThreatDetection } from './threat-detection';
import { SecurityIncident } from './types';

export class IncidentResponseCenter {
  constructor(private threatDetection: ThreatDetection) {}

  getIncidentTimeline(): SecurityIncident[] {
    // In production this would query a database table
    return this.threatDetection.getActiveIncidents().sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  resolveIncident(incidentId: string, resolutionNotes: string): void {
    const incidents = this.threatDetection.getActiveIncidents();
    const incident = incidents.find(i => i.id === incidentId);
    if (incident) {
      incident.resolved = true;
      console.log(`Resolved incident ${incidentId}: ${resolutionNotes}`);
    }
  }
}
