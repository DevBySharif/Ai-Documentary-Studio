export type AudioBusType =
  | "Master"
  | "Music"
  | "Dialogue"
  | "Effects"
  | "Ambient"
  | "Preview";

export interface AudioBus {
  readonly id: string;
  readonly name: string;
  readonly type: AudioBusType;
  readonly gainDb: number;
  readonly effectIds: ReadonlyArray<string>;
  readonly targetBusId?: string; // Routing to another bus (or Master)
}

export class BusRoutingMatrix {
  private buses = new Map<string, AudioBus>();

  constructor() {
    this.initDefaultBuses();
  }

  private initDefaultBuses(): void {
    const master: AudioBus = { id: "master_bus", name: "Master Bus", type: "Master", gainDb: 0, effectIds: [] };
    const dialogue: AudioBus = { id: "dialogue_bus", name: "Dialogue Bus", type: "Dialogue", gainDb: 0, effectIds: [], targetBusId: "master_bus" };
    const music: AudioBus = { id: "music_bus", name: "Music Bus", type: "Music", gainDb: 0, effectIds: [], targetBusId: "master_bus" };
    const fx: AudioBus = { id: "effects_bus", name: "Effects Bus", type: "Effects", gainDb: 0, effectIds: [], targetBusId: "master_bus" };
    const ambient: AudioBus = { id: "ambient_bus", name: "Ambient Bus", type: "Ambient", gainDb: 0, effectIds: [], targetBusId: "master_bus" };
    const preview: AudioBus = { id: "preview_bus", name: "Preview Bus", type: "Preview", gainDb: 0, effectIds: [], targetBusId: "master_bus" };

    [master, dialogue, music, fx, ambient, preview].forEach((bus) => this.buses.set(bus.id, bus));
  }

  public getBus(id: string): AudioBus | undefined {
    return this.buses.get(id);
  }

  public setBusGain(id: string, gainDb: number): void {
    const bus = this.buses.get(id);
    if (bus) {
      this.buses.set(id, { ...bus, gainDb });
    }
  }

  public listBuses(): ReadonlyArray<AudioBus> {
    return Array.from(this.buses.values());
  }
}
