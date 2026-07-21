import { Transform, SubjectAnchor } from './models';
import { InterpolationEngine } from './interpolation';
import { InterpolationType } from '@studio/timeline';

export class VirtualCamera {
  /**
   * Evaluates the camera transform for a specific frame between two keyframes.
   */
  static evaluate(
    startTransform: Transform,
    endTransform: Transform,
    startFrame: number,
    endFrame: number,
    currentFrame: number,
    easing: InterpolationType = InterpolationType.Linear
  ): Transform {
    if (currentFrame <= startFrame) return startTransform;
    if (currentFrame >= endFrame) return endTransform;

    const duration = endFrame - startFrame;
    const progress = (currentFrame - startFrame) / duration;

    return {
      x: InterpolationEngine.interpolateValue(startTransform.x, endTransform.x, progress, easing),
      y: InterpolationEngine.interpolateValue(startTransform.y, endTransform.y, progress, easing),
      scale: InterpolationEngine.interpolateValue(startTransform.scale, endTransform.scale, progress, easing),
      rotation: InterpolationEngine.interpolateValue(startTransform.rotation, endTransform.rotation, progress, easing),
      opacity: InterpolationEngine.interpolateValue(startTransform.opacity, endTransform.opacity, progress, easing),
    };
  }
}

export class KenBurnsEngine {
  /**
   * Generates a start and end transform to simulate a Ken Burns effect.
   * If a semantic anchor is provided, it attempts to end the movement focusing on that anchor.
   */
  static generate(
    canvasWidth: number,
    canvasHeight: number,
    intensity: number = 0.5,
    anchor?: SubjectAnchor
  ): { start: Transform, end: Transform } {
    
    const start: Transform = { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0 };
    const end: Transform = { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0 };

    // Standard Zoom in
    const maxScale = 1.0 + (0.5 * intensity);
    end.scale = maxScale;

    if (anchor && anchor.bounds) {
      // Calculate pan to center the anchor
      const anchorCenterX = anchor.bounds.x + (anchor.bounds.width / 2);
      const anchorCenterY = anchor.bounds.y + (anchor.bounds.height / 2);

      // Convert absolute anchor position to relative pan offsets based on scale
      // This is simplified math for the blueprint
      end.x = (canvasWidth / 2) - anchorCenterX;
      end.y = (canvasHeight / 2) - anchorCenterY;
    } else {
      // Random gentle pan
      end.x = (Math.random() - 0.5) * 100 * intensity;
      end.y = (Math.random() - 0.5) * 100 * intensity;
    }

    return { start, end };
  }
}
