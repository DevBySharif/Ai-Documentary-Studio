const DEFAULT_SHORTCUTS: Record<string, string> = {
  'new-project': 'Ctrl+N',
  'open-project': 'Ctrl+O',
  'save': 'Ctrl+S',
  'save-as': 'Ctrl+Shift+S',
  'undo': 'Ctrl+Z',
  'redo': 'Ctrl+Y',
  'cut': 'Ctrl+X',
  'copy': 'Ctrl+C',
  'paste': 'Ctrl+V',
  'delete': 'Del',
  'select-all': 'Ctrl+A',
  'render': 'Ctrl+R',
  'export': 'Ctrl+E',
  'preview': 'Ctrl+P',
  'toggle-sidebar': 'Ctrl+B',
  'toggle-timeline': 'Ctrl+T',
  'fullscreen': 'F11',
  'search': 'Ctrl+F',
  'settings': 'Ctrl+,',
  'help': 'F1',
};

export class ASKeyboardShortcuts {
  private shortcuts: Map<string, string>;

  constructor() {
    this.shortcuts = new Map(Object.entries(DEFAULT_SHORTCUTS));
  }

  setShortcut(action: string, keys: string): void {
    if (!action || !keys) return;
    this.shortcuts.set(action, keys);
  }

  getShortcut(action: string): string | undefined {
    return this.shortcuts.get(action);
  }

  getAllShortcuts(): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [action, keys] of this.shortcuts) {
      result[action] = keys;
    }
    return result;
  }

  importShortcuts(data: Record<string, string>): void {
    for (const [action, keys] of Object.entries(data)) {
      this.shortcuts.set(action, keys);
    }
  }

  exportShortcuts(): string {
    return JSON.stringify(this.getAllShortcuts(), null, 2);
  }

  resetToDefaults(): void {
    this.shortcuts.clear();
    for (const [action, keys] of Object.entries(DEFAULT_SHORTCUTS)) {
      this.shortcuts.set(action, keys);
    }
  }

  resetAction(action: string): void {
    if (action in DEFAULT_SHORTCUTS) {
      this.shortcuts.set(action, DEFAULT_SHORTCUTS[action]);
    }
  }
}
