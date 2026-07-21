import type { MasterEvent, MasterRenderPackage } from "./types.js";

export class MasterRenderPackageBuilder {
  private sealed = false;

  build(events: MasterEvent[]): MasterRenderPackage {
    const pkg: MasterRenderPackage = {
      timeline: events.sort((a, b) => a.start - b.start),
      images: this.collectUnique(events, "image_id"),
      motionPaths: this.collectUnique(events, "motion_path"),
      voice: "",
      subtitles: [],
      wordInserts: [],
      effects: [],
      metadata: {},
      projectManifest: {},
      sealed: false,
    };

    for (const event of events) {
      if (event.layer === "subtitle") {
        pkg.subtitles.push({
          start: event.start,
          end: event.end,
          text: (event.data?.text as string) ?? "",
        });
      }

      if (event.layer === "word_insert") {
        pkg.wordInserts.push({
          time: event.start,
          word: (event.data?.word as string) ?? "",
          duration: event.duration,
        });
      }

      if (event.layer === "effects" && event.data?.effect) {
        pkg.effects.push(event.data.effect as string);
      }

      if (event.layer === "narration" && event.data?.voiceFile) {
        pkg.voice = event.data.voiceFile as string;
      }
    }

    return pkg;
  }

  seal(pkg: MasterRenderPackage): MasterRenderPackage {
    return {
      ...pkg,
      sealed: true,
      projectManifest: {
        ...pkg.projectManifest,
        sealedAt: new Date().toISOString(),
        eventCount: pkg.timeline.length,
        totalRuntime: pkg.timeline.length > 0
          ? pkg.timeline[pkg.timeline.length - 1].end
          : 0,
      },
    };
  }

  private collectUnique(events: MasterEvent[], key: string): string[] {
    const values = new Set<string>();
    for (const event of events) {
      const val = event.data?.[key];
      if (typeof val === "string") values.add(val);
    }
    return Array.from(values);
  }
}
