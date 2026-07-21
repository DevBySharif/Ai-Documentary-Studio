import type { AMLayerConfig, AMLayerType, AMEQSettings, AMCompressorSettings } from "./types.js";

export class AMLayerManager {
  private layers: Map<AMLayerType, AMLayerConfig> = new Map();

  constructor() {
    this.initializeDefaults();
  }

  private initializeDefaults(): void {
    const defaultEQ: AMEQSettings = { sub: 0, low: 0, low_mid: 0, mid: 0, high_mid: 0, high: 0, enabled: false };
    const defaultComp: AMCompressorSettings = { threshold: -20, ratio: 3, attack: 5, release: 100, makeupGain: 0, enabled: false };

    this.layers.set("narration", { type: "narration", volume: 0, pan: 0, muted: false, solo: false, eq: { ...defaultEQ }, compressor: { ...defaultComp } });
    this.layers.set("background_music", { type: "background_music", volume: -10, pan: 0, muted: false, solo: false, eq: { ...defaultEQ }, compressor: { ...defaultComp } });
    this.layers.set("ambience", { type: "ambience", volume: -15, pan: 0, muted: false, solo: false, eq: { ...defaultEQ }, compressor: { ...defaultComp } });
    this.layers.set("sound_effects", { type: "sound_effects", volume: -8, pan: 0, muted: false, solo: false, eq: { ...defaultEQ }, compressor: { ...defaultComp } });
    this.layers.set("transition_effects", { type: "transition_effects", volume: -6, pan: 0, muted: false, solo: false, eq: { ...defaultEQ }, compressor: { ...defaultComp } });
  }

  getLayer(type: AMLayerType): AMLayerConfig | undefined {
    return this.layers.get(type);
  }

  setVolume(type: AMLayerType, volume: number): void {
    const layer = this.layers.get(type);
    if (layer) layer.volume = volume;
  }

  setPan(type: AMLayerType, pan: number): void {
    const layer = this.layers.get(type);
    if (layer) layer.pan = pan;
  }

  setMute(type: AMLayerType, muted: boolean): void {
    const layer = this.layers.get(type);
    if (layer) layer.muted = muted;
  }

  setSolo(type: AMLayerType, solo: boolean): void {
    const layer = this.layers.get(type);
    if (layer) layer.solo = solo;
  }

  setEQ(type: AMLayerType, eq: Partial<AMEQSettings>): void {
    const layer = this.layers.get(type);
    if (layer) layer.eq = { ...layer.eq, ...eq };
  }

  setCompressor(type: AMLayerType, comp: Partial<AMCompressorSettings>): void {
    const layer = this.layers.get(type);
    if (layer) layer.compressor = { ...layer.compressor, ...comp };
  }

  getAllLayers(): AMLayerConfig[] {
    return Array.from(this.layers.values());
  }

  getActiveLayers(): AMLayerConfig[] {
    const solos = this.getAllLayers().filter((l) => l.solo);
    if (solos.length > 0) return solos;
    return this.getAllLayers().filter((l) => !l.muted);
  }

  resetAll(): void {
    this.layers.clear();
    this.initializeDefaults();
  }
}
