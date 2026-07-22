import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './renderer/app/app';

declare global {
  interface Window {
    electron: {
      invoke: <T = any>(channel: string, payload?: any) => Promise<any>;
      send: (channel: string, payload?: any) => void;
      on: (channel: string, callback: (data: any) => void) => () => void;
      ipc: {
        invoke: <T = any>(channel: string, payload?: any) => Promise<T>;
        send: (channel: string, payload?: any) => void;
        on: (channel: string, callback: (...args: any[]) => void) => () => void;
      };
    };
    electronAPI: Window['electron'];
    api: Window['electron'];
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
