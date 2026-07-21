import { ASOutputContract, ASSettingsLevel } from './types';

export class ASOutputContractBuilder {
  private contract: Partial<ASOutputContract>;

  constructor() {
    this.contract = {};
  }

  withSettings(settings: Record<string, unknown>): this {
    this.contract.settings = { ...settings };
    return this;
  }

  withWorkspace(id: string, name: string, path: string): this {
    this.contract.workspace = { id, name, path };
    return this;
  }

  withTheme(theme: 'dark' | 'light' | 'system'): this {
    this.contract.theme = theme;
    return this;
  }

  withAIProvider(provider: string): this {
    if (!this.contract.providers) this.contract.providers = {};
    this.contract.providers.ai = provider;
    return this;
  }

  withImageProvider(provider: string): this {
    if (!this.contract.providers) this.contract.providers = {};
    this.contract.providers.image = provider;
    return this;
  }

  withVoiceProvider(provider: string): this {
    if (!this.contract.providers) this.contract.providers = {};
    this.contract.providers.voice = provider;
    return this;
  }

  withRenderProvider(provider: string): this {
    if (!this.contract.providers) this.contract.providers = {};
    this.contract.providers.render = provider;
    return this;
  }

  withStatus(status: 'valid' | 'invalid' | 'partial'): this {
    this.contract.status = status;
    return this;
  }

  build(): ASOutputContract {
    if (!this.contract.settings) this.contract.settings = {};
    if (!this.contract.workspace) {
      this.contract.workspace = { id: '', name: '', path: '' };
    }
    if (!this.contract.theme) this.contract.theme = 'system';
    if (!this.contract.providers) this.contract.providers = {};
    if (!this.contract.status) this.contract.status = 'valid';

    return {
      settings: this.contract.settings,
      workspace: this.contract.workspace,
      theme: this.contract.theme,
      providers: this.contract.providers,
      status: this.contract.status,
    } as ASOutputContract;
  }

  fromJSON(json: string): this {
    try {
      const parsed = JSON.parse(json);
      if (parsed.settings) this.contract.settings = parsed.settings;
      if (parsed.workspace) this.contract.workspace = parsed.workspace;
      if (parsed.theme) this.contract.theme = parsed.theme;
      if (parsed.providers) this.contract.providers = parsed.providers;
      if (parsed.status) this.contract.status = parsed.status;
    } catch {
      // ignore invalid JSON
    }
    return this;
  }
}
