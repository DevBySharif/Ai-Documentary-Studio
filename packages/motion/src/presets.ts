import { MotionPreset } from './models';

export class MotionPresetRegistry {
  private presets: Map<string, MotionPreset> = new Map();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults() {
    this.register({
      id: 'preset_slow_zoom_in',
      name: 'Slow Documentary Zoom In',
      description: 'A very slow, unnoticeable scale increase over time.',
      category: 'Documentary',
      behavior: 'Zoom',
      intensity: 0.1
    });

    this.register({
      id: 'preset_historical_pan',
      name: 'Historical Photo Pan',
      description: 'A steady horizontal pan across a wide image.',
      category: 'Historical',
      behavior: 'Pan',
      intensity: 0.3
    });

    this.register({
      id: 'preset_dynamic_push',
      name: 'Dynamic Push-In',
      description: 'A fast scale increase designed to emphasize a point.',
      category: 'Cinematic',
      behavior: 'Zoom',
      intensity: 0.8
    });
  }

  register(preset: MotionPreset): void {
    this.presets.set(preset.id, preset);
  }

  get(id: string): MotionPreset | undefined {
    return this.presets.get(id);
  }

  getAll(): MotionPreset[] {
    return Array.from(this.presets.values());
  }
}
