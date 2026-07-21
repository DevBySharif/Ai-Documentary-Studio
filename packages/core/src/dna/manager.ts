import { DNAValidator, type ValidationReport } from "./validator.js";
import { DNACompiler } from "./compiler.js";
import type { ChannelDNA, DNAExportFormat } from "./types.js";
import type { CompiledDNA } from "./compiler.js";

interface DNAVersion {
  number: string;
  dna: ChannelDNA;
  changeLog: string[];
  createdAt: string;
}

interface DNAEntry {
  current: ChannelDNA;
  versions: DNAVersion[];
  archived: boolean;
  createdAt: string;
}

export class DNAManager {
  private entries = new Map<string, DNAEntry>();
  private validator: DNAValidator;
  private compiler: DNACompiler;
  private defaultId?: string;

  constructor() {
    this.validator = new DNAValidator();
    this.compiler = new DNACompiler();
  }

  create(dna: ChannelDNA): { dna: ChannelDNA; validation: ValidationReport } {
    const validation = this.validator.validate(dna);

    const entry: DNAEntry = {
      current: dna,
      versions: [
        {
          number: dna.metadata.version,
          dna: this.deepClone(dna),
          changeLog: dna.metadata.changeLog,
          createdAt: dna.metadata.createdAt,
        },
      ],
      archived: false,
      createdAt: dna.metadata.createdAt,
    };

    this.entries.set(dna.metadata.id, entry);
    return { dna, validation };
  }

  get(id: string): ChannelDNA | undefined {
    return this.entries.get(id)?.current;
  }

  getAll(): ChannelDNA[] {
    return Array.from(this.entries.values())
      .filter((e) => !e.archived)
      .map((e) => e.current);
  }

  update(id: string, updates: Partial<ChannelDNA>): { dna: ChannelDNA; validation: ValidationReport } | null {
    const entry = this.entries.get(id);
    if (!entry) return null;

    const updated = this.applyUpdates(entry.current, updates);
    const validation = this.validator.validate(updated);

    entry.versions.push({
      number: updated.metadata.version,
      dna: this.deepClone(updated),
      changeLog: updated.metadata.changeLog,
      createdAt: updated.metadata.updatedAt,
    });

    entry.current = updated;
    this.compiler.invalidateCache(id);

    return { dna: updated, validation };
  }

  delete(id: string): boolean {
    return this.entries.delete(id);
  }

  archive(id: string): boolean {
    const entry = this.entries.get(id);
    if (!entry) return false;
    entry.archived = true;
    return true;
  }

  unarchive(id: string): boolean {
    const entry = this.entries.get(id);
    if (!entry) return false;
    entry.archived = false;
    return true;
  }

  duplicate(id: string, newName?: string): ChannelDNA | null {
    const original = this.entries.get(id);
    if (!original) return null;

    const clone = this.deepClone(original.current);
    clone.metadata.id = crypto.randomUUID();
    clone.metadata.name = newName ?? `${clone.metadata.name} (Copy)`;
    clone.metadata.version = "1.0.0";
    clone.metadata.parentId = undefined;
    clone.metadata.createdAt = new Date().toISOString();
    clone.metadata.updatedAt = new Date().toISOString();
    clone.metadata.changeLog = ["Duplicated from " + original.current.metadata.name];

    this.create(clone);
    return clone;
  }

  getVersion(id: string, version: string): ChannelDNA | undefined {
    return this.entries.get(id)?.versions.find((v) => v.number === version)?.dna;
  }

  getVersionHistory(id: string): DNAVersion[] {
    return this.entries.get(id)?.versions ?? [];
  }

  rollback(id: string, version: string): ChannelDNA | null {
    const entry = this.entries.get(id);
    if (!entry) return null;

    const target = entry.versions.find((v) => v.number === version);
    if (!target) return null;

    entry.current = this.deepClone(target.dna);
    entry.current.metadata.updatedAt = new Date().toISOString();
    entry.current.metadata.changeLog = [`Rolled back to version ${version}`];

    return entry.current;
  }

  setDefault(id: string): void {
    this.defaultId = id;
  }

  getDefault(): ChannelDNA | undefined {
    return this.defaultId ? this.get(this.defaultId) : undefined;
  }

  async exportDNA(id: string, format: DNAExportFormat): Promise<string | null> {
    const dna = this.get(id);
    if (!dna) return null;

    switch (format) {
      case "json":
        return JSON.stringify(dna, null, 2);
      case "yaml":
        return this.toYAML(dna);
      case "markdown":
        return this.toMarkdown(dna);
      default:
        return JSON.stringify(dna, null, 2);
    }
  }

  importDNA(data: string, format: DNAExportFormat): ChannelDNA | null {
    try {
      let dna: ChannelDNA;
      switch (format) {
        case "json":
          dna = JSON.parse(data);
          break;
        default:
          dna = JSON.parse(data);
      }

      dna.metadata.id = dna.metadata.id || crypto.randomUUID();
      dna.metadata.createdAt = dna.metadata.createdAt || new Date().toISOString();
      dna.metadata.updatedAt = new Date().toISOString();

      this.create(dna);
      return dna;
    } catch {
      return null;
    }
  }

  compile(id: string): CompiledDNA | null {
    const dna = this.get(id);
    if (!dna) return null;
    return this.compiler.compile(dna);
  }

  validate(id: string): ValidationReport | null {
    const dna = this.get(id);
    if (!dna) return null;
    return this.validator.validate(dna);
  }

  private applyUpdates(original: ChannelDNA, updates: Partial<ChannelDNA>): ChannelDNA {
    const result = this.deepClone(original);

    for (const key of Object.keys(updates) as Array<keyof ChannelDNA>) {
      const val = updates[key];
      if (val === undefined) continue;

      if (
        val !== null &&
        result[key] !== null &&
        typeof val === "object" &&
        !Array.isArray(val) &&
        typeof result[key] === "object" &&
        !Array.isArray(result[key])
      ) {
        (result as unknown as Record<string, unknown>)[key] = this.deepMerge(
          result[key] as unknown as Record<string, unknown>,
          val as unknown as Record<string, unknown>
        );
      } else {
        (result as unknown as Record<string, unknown>)[key] = val;
      }
    }

    result.metadata.updatedAt = new Date().toISOString();
    result.metadata.version = this.bumpVersion(original.metadata.version);
    result.metadata.changeLog = [updates.metadata?.changeLog?.[0] ?? "Updated via manager"];

    return result;
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

  private deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
    const result = { ...target };
    for (const key of Object.keys(source)) {
      const val = source[key];
      if (val === undefined) continue;
      if (
        val !== null &&
        result[key] !== null &&
        typeof val === "object" &&
        !Array.isArray(val) &&
        typeof result[key] === "object" &&
        !Array.isArray(result[key])
      ) {
        result[key] = this.deepMerge(
          result[key] as Record<string, unknown>,
          val as Record<string, unknown>
        );
      } else {
        result[key] = val;
      }
    }
    return result;
  }

  private toYAML(dna: ChannelDNA): string {
    const lines: string[] = ["# AI Documentary Studio - Channel DNA", "---"];
    const add = (key: string, value: unknown, indent = 0) => {
      const prefix = "  ".repeat(indent);
      if (value === null || value === undefined) return;
      if (typeof value === "string") {
        lines.push(`${prefix}${key}: "${value.replace(/"/g, '\\"')}"`);
      } else if (typeof value === "number" || typeof value === "boolean") {
        lines.push(`${prefix}${key}: ${value}`);
      } else if (Array.isArray(value)) {
        lines.push(`${prefix}${key}:`);
        for (const item of value) {
          if (typeof item === "string") {
            lines.push(`${prefix}  - "${item.replace(/"/g, '\\"')}"`);
          } else if (typeof item === "object") {
            lines.push(`${prefix}  -`);
            for (const [k, v] of Object.entries(item as Record<string, unknown>)) {
              add(k, v, indent + 3);
            }
          }
        }
      } else if (typeof value === "object") {
        lines.push(`${prefix}${key}:`);
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
          add(k, v, indent + 1);
        }
      }
    };
    add("metadata", dna.metadata);
    add("general", dna.general);
    return lines.join("\n");
  }

  private toMarkdown(dna: ChannelDNA): string {
    let md = `# Channel DNA: ${dna.metadata.name}\n\n`;
    md += `**Version:** ${dna.metadata.version}  \n`;
    md += `**Category:** ${dna.metadata.category}  \n`;
    md += `**Description:** ${dna.metadata.description}  \n\n`;

    md += `## Story DNA\n`;
    md += `- Formula: ${dna.story.storyFormula}\n`;
    md += `- Hook: ${dna.story.hookFormula}\n`;
    md += `- Avg Scene Length: ${dna.story.pacingRules.averageSceneLength}s\n`;
    md += `- Avg Sentence Length: ${dna.story.pacingRules.averageSentenceLength} words\n\n`;

    md += `## Visual DNA\n`;
    md += `- Art Style: ${dna.visual.artStyle}\n`;
    md += `- Character Style: ${dna.visual.characterStyle}\n`;
    md += `- Composition: ${dna.visual.composition}\n`;
    md += `- Colors: ${dna.visual.colorPalette.primary.join(", ")}\n\n`;

    md += `## Editing DNA\n`;
    md += `- Default Motion: ${dna.editing.cameraMotion.default}\n`;
    md += `- Min Hold: ${dna.editing.holdDuration.minimum}s / Max Hold: ${dna.editing.holdDuration.maximum}s\n`;
    md += `- Default Transition: ${dna.editing.transitionStyle.default}\n\n`;

    md += `## Quality Thresholds\n`;
    md += `- Character Consistency: ${dna.quality.thresholds.characterConsistency}%\n`;
    md += `- Art Style Consistency: ${dna.quality.thresholds.artStyleConsistency}%\n`;
    md += `- Prompt Quality: ${dna.quality.thresholds.promptQuality}%\n`;
    md += `- Story Flow: ${dna.quality.thresholds.storyFlow}%\n`;

    return md;
  }
}
