import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { IpcChannels, PingResponse, IpcResponse } from '@studio/shared';

// Access the typed API exposed by preload
declare global {
  interface Window {
    electronAPI: {
      invoke: <T = any>(channel: string, payload: any) => Promise<IpcResponse<T>>;
      on: (channel: string, callback: (data: any) => void) => () => void;
    };
  }
}

const App = () => {
  const [pingResult, setPingResult] = useState<string>('Pinging main process...');

  useEffect(() => {
    async function testIpc() {
      try {
        const res = await window.electronAPI.invoke<PingResponse>(
          IpcChannels.SYSTEM.PING, 
          { message: 'Hello from React!' }
        );
        if (res.success && res.data) {
          setPingResult(res.data.reply);
        } else if (res.error) {
          setPingResult(`Error: ${res.error.message}`);
        }
      } catch (e: any) {
        setPingResult(`IPC Failure: ${e.message}`);
      }
    }
    
    // Slight delay to simulate load
    setTimeout(testIpc, 500);
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>AI Documentary Studio</h1>
      <p>Electron Process Architecture Initialized.</p>
      
      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>Typed IPC Test</h3>
        <p><strong>Status:</strong> {pingResult}</p>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
