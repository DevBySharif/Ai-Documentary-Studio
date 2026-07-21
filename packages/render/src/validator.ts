import { Timeline, TimelineValidator } from '@studio/timeline';
import { RenderPreset } from './models';

export class RenderValidator {
  /**
   * Validates the timeline and preset before expensive rendering begins.
   * Throws an Error if validation fails.
   */
  static validate(timeline: Timeline, preset: RenderPreset, destPath: string): void {
    // 1. Timeline Integrity (delegate to timeline package)
    TimelineValidator.validate(timeline);

    // 2. Hardware acceleration checks (mock logic for blueprint)
    if (preset.hardwareAcceleration !== 'none') {
      if (!this.checkHardwareSupport(preset.hardwareAcceleration)) {
        throw new Error(`Requested hardware acceleration '${preset.hardwareAcceleration}' is not available.`);
      }
    }

    // 3. Storage check (mock)
    if (!this.hasWriteAccess(destPath)) {
      throw new Error(`Cannot write to destination path: ${destPath}`);
    }

    // Additional validations like "missing assets" would happen here by cross-referencing the Asset Engine.
  }

  private static checkHardwareSupport(type: string): boolean {
    // Stub implementation
    return true; 
  }

  private static hasWriteAccess(path: string): boolean {
    // Stub implementation
    return true;
  }
}
