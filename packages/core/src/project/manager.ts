import { ProjectValidator, type ProjectValidationReport } from "./validator.js";
import { ProjectCompiler } from "./compiler.js";
import { ProjectDNAGenerator } from "./generator.js";
import type { ProjectDNA, CompiledProjectProfile } from "./types.js";
import type { ChannelDNA } from "../dna/types.js";

interface ProjectVersion {
  number: string;
  dna: ProjectDNA;
  changeLog: string[];
  createdAt: string;
}

interface ProjectEntry {
  current: ProjectDNA;
  versions: ProjectVersion[];
  createdAt: string;
}

export class ProjectDNAManager {
  private entries = new Map<string, ProjectEntry>();
  private validator: ProjectValidator;
  private compiler: ProjectCompiler;
  private generator: ProjectDNAGenerator;

  constructor() {
    this.validator = new ProjectValidator();
    this.compiler = new ProjectCompiler();
    this.generator = new ProjectDNAGenerator();
  }

  generate(
    projectName: string,
    topic: string,
    idea: string,
    channelDna: ChannelDNA,
    research?: { keyConcepts: string[]; targetAudience?: string; difficulty?: string }
  ): ProjectDNA {
    const dna = this.generator.generate({
      projectName,
      topic,
      idea,
      channelDna,
      research: research ?? { keyConcepts: [topic] },
    });

    const entry: ProjectEntry = {
      current: dna,
      versions: [{
        number: dna.metadata.version,
        dna: this.deepClone(dna),
        changeLog: dna.metadata.changeLog,
        createdAt: dna.metadata.createdAt,
      }],
      createdAt: dna.metadata.createdAt,
    };

    this.entries.set(dna.metadata.id, entry);
    return dna;
  }

  get(id: string): ProjectDNA | undefined {
    return this.entries.get(id)?.current;
  }

  update(id: string, updates: Partial<ProjectDNA>): ProjectDNA | null {
    const entry = this.entries.get(id);
    if (!entry) return null;

    const updated = this.deepClone(entry.current);
    for (const key of Object.keys(updates) as Array<keyof ProjectDNA>) {
      const val = updates[key];
      if (val !== undefined) {
        (updated as unknown as Record<string, unknown>)[key] = val as unknown as Record<string, unknown>;
      }
    }

    updated.metadata.version = this.bumpVersion(entry.current.metadata.version);
    updated.metadata.updatedAt = new Date().toISOString();
    updated.metadata.changeLog = [updates.metadata?.changeLog?.[0] ?? "Updated"];

    entry.versions.push({
      number: updated.metadata.version,
      dna: this.deepClone(updated),
      changeLog: updated.metadata.changeLog,
      createdAt: updated.metadata.updatedAt,
    });

    entry.current = updated;
    this.compiler.invalidateCache(id);

    return updated;
  }

  getVersion(id: string, version: string): ProjectDNA | undefined {
    return this.entries.get(id)?.versions.find((v) => v.number === version)?.dna;
  }

  getVersionHistory(id: string) {
    return this.entries.get(id)?.versions ?? [];
  }

  compile(id: string): CompiledProjectProfile | null {
    const dna = this.get(id);
    if (!dna) return null;
    return this.compiler.compile(dna);
  }

  validate(id: string): ProjectValidationReport | null {
    const dna = this.get(id);
    if (!dna) return null;
    return this.validator.validate(dna);
  }

  approveBlueprint(id: string): boolean {
    const dna = this.get(id);
    if (!dna) return false;
    dna.blueprint.approved = true;
    dna.metadata.updatedAt = new Date().toISOString();
    return true;
  }

  private bumpVersion(current: string): string {
    const parts = current.split(".").map(Number);
    if (parts.length !== 3) return "1.0.0";
    parts[2] += 1;
    return parts.join(".");
  }

  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}
