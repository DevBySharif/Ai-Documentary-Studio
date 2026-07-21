import type {
  VisualLibrary,
  PromptLibrary,
  MotionLibrary,
  KnowledgeBase,
  PromptTemplate,
  MotionPreset,
} from "./types.js";

export function createEmptyVisualLibrary(): VisualLibrary {
  return {
    characters: [],
    objects: [],
    backgrounds: [],
    environments: [],
    symbols: {},
    cameras: [],
  };
}

export function createEmptyPromptLibrary(): PromptLibrary {
  return { templates: [] };
}

export function createEmptyMotionLibrary(): MotionLibrary {
  return { presets: [] };
}

export function createEmptyKnowledgeBase(): KnowledgeBase {
  return { domains: [] };
}

export class LibraryManager {
  addCharacter(library: VisualLibrary, character: VisualLibrary["characters"][number]): void {
    library.characters.push(character);
  }

  addObject(library: VisualLibrary, object: VisualLibrary["objects"][number]): void {
    library.objects.push(object);
  }

  addBackground(library: VisualLibrary, bg: VisualLibrary["backgrounds"][number]): void {
    library.backgrounds.push(bg);
  }

  addSymbol(library: VisualLibrary, key: string, symbol: VisualLibrary["symbols"][string]): void {
    library.symbols[key] = symbol;
  }

  addPromptTemplate(library: PromptLibrary, template: PromptTemplate): void {
    library.templates.push(template);
  }

  addMotionPreset(library: MotionLibrary, preset: MotionPreset): void {
    library.presets.push(preset);
  }

  getTemplatesByCategory(library: PromptLibrary, category: string): PromptTemplate[] {
    return library.templates.filter((t) => t.category === category);
  }

  getPresetsByFunction(library: MotionLibrary, narrativeFunction: string): MotionPreset[] {
    return library.presets.filter((p) => p.narrativeFunction === narrativeFunction);
  }

  findSymbol(library: VisualLibrary, concept: string): string | undefined {
    return library.symbols[concept]?.promptTemplate;
  }
}
