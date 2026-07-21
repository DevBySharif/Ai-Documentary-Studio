import { BootstrapManager } from "./bootstrap/bootstrap";

// Electron imports mock (since we are not actually running in a node environment here, 
// but we want to simulate the entry point as described in the blueprint)
declare const app: {
  whenReady(): Promise<void>;
  on(event: string, callback: () => void): void;
  quit(): void;
};
declare const process: {
  platform: string;
};

const bootstrapManager = new BootstrapManager();

app.whenReady().then(async () => {
  await bootstrapManager.bootstrap();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
