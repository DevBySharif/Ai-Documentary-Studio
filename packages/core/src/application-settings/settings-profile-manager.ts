import { ASProfile } from './types';

const DEFAULT_PROFILES: ASProfile[] = [
  {
    name: 'High Performance',
    description: 'Maximum performance for high-end machines',
    isDefault: true,
    settings: {
      cpuUsageLimit: 90,
      gpuUsageLimit: 95,
      ramLimit: 8192,
      backgroundRendering: true,
      concurrentJobs: 4,
      cacheSize: 2048,
      previewQuality: 'high',
      hardwareAcceleration: true,
      multiThreadRendering: true,
      renderPriority: 'high',
      autoSaveInterval: 120,
    },
  },
  {
    name: 'Low-End PC',
    description: 'Optimized for older or low-spec machines',
    isDefault: true,
    settings: {
      cpuUsageLimit: 50,
      gpuUsageLimit: 40,
      ramLimit: 2048,
      backgroundRendering: false,
      concurrentJobs: 1,
      cacheSize: 256,
      previewQuality: 'low',
      hardwareAcceleration: false,
      multiThreadRendering: false,
      renderPriority: 'low',
      autoSaveInterval: 600,
    },
  },
  {
    name: 'Maximum Quality',
    description: 'Best output quality for final renders',
    isDefault: true,
    settings: {
      resolution: '3840x2160',
      fps: 60,
      codec: 'av1',
      bitrate: 50000,
      qualityProfile: 'ultra',
      cachePolicy: { enabled: true, ttlMs: 604800000, maxEntries: 100 },
      previewQuality: 'original',
      renderPriority: 'critical',
      hardwareAcceleration: true,
      multiThreadRendering: true,
      styleLock: true,
    },
  },
  {
    name: 'Fast Draft',
    description: 'Quick previews and drafts with minimal quality',
    isDefault: true,
    settings: {
      resolution: '1280x720',
      fps: 24,
      codec: 'h264',
      bitrate: 2000,
      qualityProfile: 'draft',
      previewQuality: 'low',
      renderPriority: 'low',
      hardwareAcceleration: false,
      multiThreadRendering: false,
      concurrentJobs: 3,
      cacheSize: 128,
    },
  },
  {
    name: 'Laptop Mode',
    description: 'Power-efficient settings for battery operation',
    isDefault: true,
    settings: {
      cpuUsageLimit: 60,
      gpuUsageLimit: 50,
      ramLimit: 3072,
      backgroundRendering: false,
      concurrentJobs: 1,
      cacheSize: 512,
      previewQuality: 'medium',
      hardwareAcceleration: true,
      multiThreadRendering: false,
      renderPriority: 'low',
      autoSaveInterval: 300,
    },
  },
];

export class ASSettingsProfileManager {
  private profiles: Map<string, ASProfile> = new Map();
  private currentProfile: string | null = null;

  constructor() {
    for (const profile of DEFAULT_PROFILES) {
      this.profiles.set(profile.name, this.clone(profile));
    }
  }

  createProfile(name: string, settings: Record<string, unknown>, description: string): boolean {
    if (this.profiles.has(name)) return false;
    this.profiles.set(name, {
      name,
      settings: this.clone(settings),
      description,
      isDefault: false,
    });
    return true;
  }

  getProfile(name: string): ASProfile | undefined {
    const profile = this.profiles.get(name);
    return profile ? this.clone(profile) : undefined;
  }

  applyProfile(name: string): Record<string, unknown> | null {
    const profile = this.profiles.get(name);
    if (!profile) return null;
    this.currentProfile = name;
    return this.clone(profile.settings);
  }

  listProfiles(): ASProfile[] {
    return Array.from(this.profiles.values()).map((p) => this.clone(p));
  }

  deleteProfile(name: string): boolean {
    const profile = this.profiles.get(name);
    if (!profile || profile.isDefault) return false;
    this.profiles.delete(name);
    if (this.currentProfile === name) {
      this.currentProfile = null;
    }
    return true;
  }

  getDefaultProfiles(): ASProfile[] {
    return DEFAULT_PROFILES.map((p) => this.clone(p));
  }

  getCurrentProfileName(): string | null {
    return this.currentProfile;
  }

  updateProfile(name: string, settings: Record<string, unknown>): boolean {
    const profile = this.profiles.get(name);
    if (!profile) return false;
    profile.settings = this.clone(settings);
    return true;
  }

  private clone<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }
}
