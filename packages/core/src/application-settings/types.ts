export type ASSettingsLevel =
  | 'system'
  | 'application'
  | 'workspace'
  | 'channel'
  | 'project'
  | 'scene';

export interface ASSettingsCategory {
  id: string;
  label: string;
  description: string;
  order: number;
}

export interface ASSetting {
  key: string;
  value: unknown;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  category: string;
  level: ASSettingsLevel;
  label: string;
  description: string;
  validValues?: unknown[];
  min?: number;
  max?: number;
}

export interface ASProfile {
  name: string;
  settings: Record<string, unknown>;
  description: string;
  isDefault?: boolean;
}

export interface ASHistoryEntry {
  id: string;
  key: string;
  previousValue: unknown;
  newValue: unknown;
  timestamp: number;
  user: string;
  source: string;
}

export interface ASOutputContract {
  settings: Record<string, unknown>;
  workspace: {
    id: string;
    name: string;
    path: string;
  };
  theme: 'dark' | 'light' | 'system';
  providers: {
    ai?: string;
    image?: string;
    voice?: string;
    render?: string;
  };
  status: 'valid' | 'invalid' | 'partial';
}
