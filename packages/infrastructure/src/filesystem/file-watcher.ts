import { DomainEvent } from "../../../domain/src/events/domain-event";

export interface FileChangePayload {
  readonly filePath: string;
  readonly changeType: "added" | "modified" | "deleted" | "renamed";
  readonly renamedFrom?: string;
}

export type FileChangeEvent = DomainEvent<FileChangePayload>;

type FileChangeCallback = (event: FileChangeEvent) => void;

/**
 * File watcher contract.
 * Emits domain events on filesystem changes rather than directly mutating state.
 */
export interface FileWatcher {
  watch(directory: string): void;
  unwatch(directory: string): void;
  onFileChange(callback: FileChangeCallback): () => void;
  dispose(): void;
}

/**
 * No-op file watcher for environments where native watching is unavailable.
 */
export class NullFileWatcher implements FileWatcher {
  public watch(_directory: string): void {}
  public unwatch(_directory: string): void {}
  public onFileChange(_callback: FileChangeCallback): () => void {
    return () => {};
  }
  public dispose(): void {}
}
