export interface CodecDescriptor {
  readonly codecId: string;
  readonly family: "H264" | "HEVC" | "AV1" | "ProRes" | "DNxHR" | "ImageSequence";
  readonly isHardwareAccelerated: boolean;
}

export interface ContainerDescriptor {
  readonly extension: string;
  readonly mimeType: string;
  readonly supportedCodecs: ReadonlyArray<string>;
}

/**
 * Codec & Container Abstraction (IB Part 21 - Section 10, Section 11, Section 23).
 * Application depends on codec/container interfaces rather than vendor implementations.
 */
export class ExportProviderRegistry {
  private codecs = new Map<string, CodecDescriptor>();
  private containers = new Map<string, ContainerDescriptor>();

  constructor() {
    this.initDefaults();
  }

  private initDefaults(): void {
    const defaultCodecs: CodecDescriptor[] = [
      { codecId: "H.264", family: "H264", isHardwareAccelerated: true },
      { codecId: "H.265", family: "HEVC", isHardwareAccelerated: true },
      { codecId: "AV1", family: "AV1", isHardwareAccelerated: true },
      { codecId: "ProRes", family: "ProRes", isHardwareAccelerated: false },
      { codecId: "DNxHR", family: "DNxHR", isHardwareAccelerated: false },
    ];

    const defaultContainers: ContainerDescriptor[] = [
      { extension: "mp4", mimeType: "video/mp4", supportedCodecs: ["H.264", "H.265", "AV1"] },
      { extension: "mov", mimeType: "video/quicktime", supportedCodecs: ["ProRes", "H.264", "H.265"] },
      { extension: "mkv", mimeType: "video/x-matroska", supportedCodecs: ["H.264", "H.265", "AV1"] },
      { extension: "mxf", mimeType: "application/mxf", supportedCodecs: ["DNxHR", "ProRes"] },
    ];

    defaultCodecs.forEach((c) => this.codecs.set(c.codecId, c));
    defaultContainers.forEach((c) => this.containers.set(c.extension, c));
  }

  public getCodec(codecId: string): CodecDescriptor | undefined {
    return this.codecs.get(codecId);
  }

  public getContainer(extension: string): ContainerDescriptor | undefined {
    return this.containers.get(extension.toLowerCase());
  }
}
