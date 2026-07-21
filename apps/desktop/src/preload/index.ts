import { exposeBridge } from "./bridge/context-bridge";

// Expose the public API securely
exposeBridge();

console.log("[Preload] Secure Context Bridge 'window.ads' initialized.");
