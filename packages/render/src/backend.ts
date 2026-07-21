import { RenderPreset } from './models';
import { Timeline } from '@studio/timeline';

/**
 * Abstraction for underlying render engines (e.g. FFmpeg, WebGL, Cloud API)
 */
export interface IRenderBackend {
  /**
   * Prepares the backend with the required output settings.
   */
  initialize(preset: RenderPreset, outputFile: string): Promise<void>;

  /**
   * Submits a mathematical timeline state for a specific frame to be rendered and written to the encoder.
   */
  renderFrame(timeline: Timeline, frameNumber: number): Promise<void>;

  /**
   * Called to cleanly close the encoding streams and finalize the muxing.
   */
  finalize(): Promise<void>;

  /**
   * Pauses the active encoding session if supported by the backend.
   */
  pause(): Promise<void>;

  /**
   * Resumes a paused encoding session.
   */
  resume(): Promise<void>;

  /**
   * Aborts the render and cleans up partial files.
   */
  cancel(): Promise<void>;
}
