export class MRParallaxEngine {
  apply(layers: Array<{ speed: number; offsetX: number; offsetY: number }>, cameraDx: number, cameraDy: number): Array<{ offsetX: number; offsetY: number }> {
    return layers.map((layer) => ({
      offsetX: layer.offsetX + cameraDx * (layer.speed / 10),
      offsetY: layer.offsetY + cameraDy * (layer.speed / 10) * 0.5
    }));
  }

  getLayerSpeeds(): number[] {
    return [4, 3, 2, 1, 0.5];
  }
}
