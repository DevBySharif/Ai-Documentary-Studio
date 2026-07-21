export type MaskType = "Rectangle" | "Ellipse" | "Polygon" | "Freehand";

export interface MaskPoint {
  readonly x: number;
  readonly y: number;
}

/**
 * Masking System Model (IB Part 16 - Section 15).
 * Masks drive visibility, alpha cutout, and selective effect application.
 */
export interface MaskModel {
  readonly id: string;
  readonly type: MaskType;
  readonly points: ReadonlyArray<MaskPoint>;
  readonly featherPixels: number; // 0 to 100
  readonly inverted: boolean;
  readonly opacity: number; // 0 to 1
  readonly isAnimated: boolean;
}

export function createMask(type: MaskType, points: MaskPoint[]): MaskModel {
  return {
    id: `mask_${Math.random().toString(36).substring(2, 9)}`,
    type,
    points,
    featherPixels: 0,
    inverted: false,
    opacity: 1.0,
    isAnimated: false,
  };
}
