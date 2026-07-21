import { contextBridge, ipcRenderer } from 'electron';
import { IpcChannel, IpcRequest, IpcResponse } from '@studio/shared';

// Define the shape of our API
export interface ElectronAPI {
  invoke: <T = any>(channel: IpcChannel, payload: any) => Promise<IpcResponse<T>>;
  on: (channel: IpcChannel, callback: (data: any) => void) => () => void;
}

const api: ElectronAPI = {
  invoke: async <T = any>(channel: IpcChannel, payload: any): Promise<IpcResponse<T>> => {
    const request: IpcRequest = {
      channel,
      payload,
      meta: { timestamp: Date.now() }
    };
    return await ipcRenderer.invoke(channel, request);
  },
  on: (channel: IpcChannel, callback: (data: any) => void) => {
    const subscription = (_event: Electron.IpcRendererEvent, data: any) => callback(data);
    ipcRenderer.on(channel, subscription);
    return () => ipcRenderer.removeListener(channel, subscription);
  }
};

contextBridge.exposeInMainWorld('electronAPI', api);
