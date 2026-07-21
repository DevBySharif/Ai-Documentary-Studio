import { projectApi, ProjectApi } from "../api/project.api";

// Mock for electron contextBridge
declare const contextBridge: {
  exposeInMainWorld(apiKey: string, api: any): void;
};

export interface AdsPreloadApi {
  project: ProjectApi;
  // Other domains like timeline, render, assets, ai would go here
}

export const adsApi: AdsPreloadApi = {
  project: projectApi,
};

export function exposeBridge() {
  contextBridge.exposeInMainWorld("ads", adsApi);
}
