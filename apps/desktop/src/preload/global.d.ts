import { AdsPreloadApi } from "./bridge/context-bridge";

declare global {
  interface Window {
    readonly ads: AdsPreloadApi;
  }
}
