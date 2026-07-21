export class GRTileRendering {
  private tileSize = 512;

  configure(tileSize: number): void {
    this.tileSize = tileSize;
  }

  getTiles(width: number, height: number): Array<{ x: number; y: number; w: number; h: number }> {
    const tiles: Array<{ x: number; y: number; w: number; h: number }> = [];
    for (let y = 0; y < height; y += this.tileSize) {
      for (let x = 0; x < width; x += this.tileSize) {
        tiles.push({ x, y, w: Math.min(this.tileSize, width - x), h: Math.min(this.tileSize, height - y) });
      }
    }
    return tiles;
  }

  needsTiling(width: number, height: number): boolean {
    const threshold = 3840;
    return width > threshold || height > threshold;
  }

  getTileCount(width: number, height: number): number {
    return this.getTiles(width, height).length;
  }

  getTileSize(): number {
    return this.tileSize;
  }
}
