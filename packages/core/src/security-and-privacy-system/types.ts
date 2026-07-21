export type PermissionLevel = "Read" | "Edit" | "Render" | "Export" | "Delete" | "Admin";

export interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  rules: Record<string, any>;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  action: string;
  actorId: string;
  targetId: string;
  details: string;
}

export interface SecurityIncident {
  id: string;
  timestamp: string;
  threatType: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  description: string;
  resolved: boolean;
}

export interface OutputContract {
  vault: string;
  encryption: string;
  plugins: string;
  audit: string;
  status: string;
}
