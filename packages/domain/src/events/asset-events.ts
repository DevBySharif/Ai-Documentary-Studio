import { DomainEvent } from "./domain-event";

export interface AssetImportedPayload {
  readonly assetId: string;
  readonly projectId: string;
  readonly filePath: string;
  readonly mimeType: string;
  readonly hash: string;
  readonly deduplicated: boolean;
}

export interface AssetIndexedPayload {
  readonly assetId: string;
  readonly projectId: string;
  readonly thumbnailPath?: string;
}

export interface AssetMissingPayload {
  readonly assetId: string;
  readonly lastKnownPath: string;
}

export type AssetImportedEvent = DomainEvent<AssetImportedPayload>;
export type AssetIndexedEvent = DomainEvent<AssetIndexedPayload>;
export type AssetMissingEvent = DomainEvent<AssetMissingPayload>;
