import { CollectionDescriptor, SmartFolderRule, AssetItem } from "./asset-ui-types";

/**
 * Collections & Smart Folders Manager (Vol 05 Part 07 - Section 5, Section 6).
 * Manages manual asset collections and rule-based smart folders (Unused, Approved, Missing Metadata, etc.).
 */
export class CollectionsSmartFoldersManager {
  private collections: CollectionDescriptor[] = [
    { collectionId: "col_1", name: "Industrial Revolution Maps", description: "19th century cartography assets", assetIds: ["ast_1"] },
  ];

  private smartFolders: SmartFolderRule[] = [
    { folderId: "sf_1", name: "Approved Images", ruleType: "ApprovedImages", filterQuery: "isApproved:true AND assetType:Image" },
    { folderId: "sf_2", name: "Unused Assets", ruleType: "Unused", filterQuery: "usageCount:0" },
  ];

  public getCollections(): ReadonlyArray<CollectionDescriptor> {
    return this.collections;
  }

  public getSmartFolders(): ReadonlyArray<SmartFolderRule> {
    return this.smartFolders;
  }

  public evaluateSmartFolder(rule: SmartFolderRule, allAssets: ReadonlyArray<AssetItem>): ReadonlyArray<AssetItem> {
    if (rule.ruleType === "ApprovedImages") {
      return allAssets.filter((a) => a.isApproved && a.assetType === "Image");
    }
    if (rule.ruleType === "Unused") {
      return allAssets.filter((a) => a.usageCount === 0);
    }
    return allAssets;
  }
}
