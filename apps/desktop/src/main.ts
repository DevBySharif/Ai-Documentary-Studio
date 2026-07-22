import 'reflect-metadata'; // Required for tsyringe
import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { ServiceRegistry } from './main/core/ServiceRegistry.js';
import { HealthMonitor } from './main/core/HealthMonitor.js';
import { registerIpcHandlers } from './main/ipc/router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
const healthMonitor = new HealthMonitor();

function initializeServices() {
  ServiceRegistry.initialize();
  registerIpcHandlers();
  healthMonitor.start();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.webContents.openDevTools();

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    const indexPath = path.resolve(__dirname, '../../../index.html');
    mainWindow.loadFile(indexPath);
  }
}

app.whenReady().then(() => {
  initializeServices();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  healthMonitor.stop();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
