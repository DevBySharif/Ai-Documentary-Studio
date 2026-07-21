import { Alert, AlertSeverity } from './types';

export class AlertSystem {
  private activeAlerts: Map<string, Alert> = new Map();
  private listeners: Array<(alert: Alert) => void> = [];

  dispatchAlert(severity: AlertSeverity, message: string, source: string): void {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      severity,
      message,
      source
    };

    this.activeAlerts.set(alert.id, alert);
    this.notifyListeners(alert);
  }

  resolveAlert(alertId: string): void {
    this.activeAlerts.delete(alertId);
  }

  getActiveAlerts(): Alert[] {
    return Array.from(this.activeAlerts.values());
  }

  subscribe(listener: (alert: Alert) => void): void {
    this.listeners.push(listener);
  }

  private notifyListeners(alert: Alert): void {
    for (const listener of this.listeners) {
      listener(alert);
    }
  }
}
