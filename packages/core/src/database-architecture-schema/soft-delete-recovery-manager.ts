import { BaseUniversalEntity } from "./schema-types";

/**
 * Soft Delete & Recovery Manager (Vol 06 Part 03 - Section 20).
 * Ensures entities are never permanently removed during normal operation (`isDeleted = true`) allowing full recovery.
 */
export class SoftDeleteRecoveryManager {
  public softDelete<T extends BaseUniversalEntity>(entity: T, modifiedBy = "StudioUser"): T {
    return {
      ...entity,
      isDeleted: true,
      modifiedBy,
      updatedAt: new Date(),
      version: entity.version + 1,
    };
  }

  public recoverSoftDeleted<T extends BaseUniversalEntity>(entity: T, modifiedBy = "StudioUser"): T {
    return {
      ...entity,
      isDeleted: false,
      modifiedBy,
      updatedAt: new Date(),
      version: entity.version + 1,
    };
  }
}
