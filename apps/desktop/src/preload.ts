import { contextBridge, ipcRenderer } from 'electron';
import { IpcChannel, IpcRequest, IpcResponse } from '@studio/shared';

export interface ElectronAPI {
  invoke: <T = any>(channel: string, payload?: any) => Promise<IpcResponse<T>>;
  send: (channel: string, payload?: any) => void;
  on: (channel: string, callback: (data: any) => void) => () => void;
  ipc: {
    invoke: <T = any>(channel: string, payload?: any) => Promise<T>;
    send: (channel: string, payload?: any) => void;
    on: (channel: string, callback: (...args: any[]) => void) => () => void;
  };
}

const electronBridge: ElectronAPI = {
  invoke: async <T = any>(channel: string, payload?: any): Promise<IpcResponse<T>> => {
    const request: IpcRequest = {
      channel: channel as any,
      payload,
      meta: { timestamp: Date.now() }
    };
    return await ipcRenderer.invoke(channel, request);
  },
  send: (channel: string, payload?: any) => {
    ipcRenderer.send(channel, payload);
  },
  on: (channel: string, callback: (data: any) => void) => {
    const subscription = (_event: Electron.IpcRendererEvent, data: any) => callback(data);
    ipcRenderer.on(channel, subscription);
    return () => ipcRenderer.removeListener(channel, subscription);
  },
  ipc: {
    invoke: async <T = any>(channel: string, payload?: any): Promise<T> => {
      return await ipcRenderer.invoke(channel, payload);
    },
    send: (channel: string, payload?: any) => {
      ipcRenderer.send(channel, payload);
    },
    on: (channel: string, callback: (...args: any[]) => void) => {
      const subscription = (_event: any, ...args: any[]) => callback(...args);
      ipcRenderer.on(channel, subscription);
      return () => ipcRenderer.removeListener(channel, subscription);
    }
  }
};

contextBridge.exposeInMainWorld('electron', electronBridge);
contextBridge.exposeInMainWorld('electronAPI', electronBridge);
contextBridge.exposeInMainWorld('api', electronBridge);
