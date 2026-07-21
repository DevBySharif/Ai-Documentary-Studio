export interface DspNode {
  readonly id: string;
  readonly name: string;
  readonly enabled: boolean;
  process(buffer: Float32Array): void;
}

export class DspGainNode implements DspNode {
  public readonly id: string;
  public readonly name = "Gain";
  public enabled = true;
  private gainLinear = 1.0;

  constructor(id: string, gainDb = 0.0) {
    this.id = id;
    this.setGainDb(gainDb);
  }

  public setGainDb(gainDb: number): void {
    this.gainLinear = Math.pow(10, gainDb / 20);
  }

  public process(buffer: Float32Array): void {
    if (!this.enabled || this.gainLinear === 1.0) return;
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] *= this.gainLinear;
    }
  }
}

export class DspLimiterNode implements DspNode {
  public readonly id: string;
  public readonly name = "Limiter";
  public enabled = true;
  private thresholdLinear = 0.95;

  constructor(id: string, thresholdDb = -0.5) {
    this.id = id;
    this.thresholdLinear = Math.pow(10, thresholdDb / 20);
  }

  public process(buffer: Float32Array): void {
    if (!this.enabled) return;
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] > this.thresholdLinear) {
        buffer[i] = this.thresholdLinear;
      } else if (buffer[i] < -this.thresholdLinear) {
        buffer[i] = -this.thresholdLinear;
      }
    }
  }
}

export class DspPipeline {
  private nodes: DspNode[] = [];

  public addNode(node: DspNode): void {
    this.nodes.push(node);
  }

  public process(buffer: Float32Array): void {
    for (const node of this.nodes) {
      if (node.enabled) {
        node.process(buffer);
      }
    }
  }

  public clear(): void {
    this.nodes = [];
  }
}
