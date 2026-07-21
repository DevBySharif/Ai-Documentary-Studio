export class PLPluginAPI {
  private projectAPI = new Map<string, Record<string, unknown>>();
  private sceneAPI = new Map<string, Record<string, unknown>>();
  private timelineAPI = new Map<string, Record<string, unknown>>();
  private assetsAPI = new Map<string, Record<string, unknown>>();
  private renderingAPI = new Map<string, Record<string, unknown>>();
  private providersAPI = new Map<string, Record<string, unknown>>();

  exposeProjectAPI(pluginId: string): Record<string, unknown> {
    let api = this.projectAPI.get(pluginId);
    if (!api) {
      api = {
        getProjectMeta: () => { },
        setProjectMeta: () => { },
        getProjectId: () => pluginId,
      };
      this.projectAPI.set(pluginId, api);
    }
    return api;
  }

  exposeSceneAPI(pluginId: string): Record<string, unknown> {
    let api = this.sceneAPI.get(pluginId);
    if (!api) {
      api = {
        listScenes: () => [],
        getScene: (id: string) => null,
        addScene: () => { },
        removeScene: () => { },
      };
      this.sceneAPI.set(pluginId, api);
    }
    return api;
  }

  exposeTimelineAPI(pluginId: string): Record<string, unknown> {
    let api = this.timelineAPI.get(pluginId);
    if (!api) {
      api = {
        getCurrentTime: () => 0,
        setCurrentTime: (t: number) => { },
        getDuration: () => 0,
        play: () => { },
        pause: () => { },
      };
      this.timelineAPI.set(pluginId, api);
    }
    return api;
  }

  exposeAssetsAPI(pluginId: string): Record<string, unknown> {
    let api = this.assetsAPI.get(pluginId);
    if (!api) {
      api = {
        importAsset: (path: string) => path,
        listAssets: () => [],
        getAsset: (id: string) => null,
        deleteAsset: () => false,
      };
      this.assetsAPI.set(pluginId, api);
    }
    return api;
  }

  exposeRenderingAPI(pluginId: string): Record<string, unknown> {
    let api = this.renderingAPI.get(pluginId);
    if (!api) {
      api = {
        renderFrame: () => { },
        getRenderProgress: () => 0,
        cancelRender: () => { },
      };
      this.renderingAPI.set(pluginId, api);
    }
    return api;
  }

  exposeProvidersAPI(pluginId: string): Record<string, unknown> {
    let api = this.providersAPI.get(pluginId);
    if (!api) {
      api = {
        listProviders: () => [],
        getProvider: (name: string) => null,
        configureProvider: () => { },
      };
      this.providersAPI.set(pluginId, api);
    }
    return api;
  }
}
