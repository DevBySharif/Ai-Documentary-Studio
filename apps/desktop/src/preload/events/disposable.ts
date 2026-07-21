/**
 * Represents a disposable resource, typically an event subscription.
 */
export interface Disposable {
  dispose(): void;
}
