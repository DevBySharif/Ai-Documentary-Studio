import 'reflect-metadata'; // Required for tsyringe
import { app, BrowserWindow } from 'electron';
import path from 'path';
import { ServiceRegistry } from './main/core/ServiceRegistry';
import { HealthMonitor } from './main/core/HealthMonitor';
import { registerIpcHandlers } from './main/ipc/router';

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

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../index.html'));
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
