import { BaseUniversalEntity } from "./schema-types";

/**
 * Universal UUID Factory & Universal Field Decorator (Vol 06 Part 03 - Section 5, Section 6).
 * Generates offline-safe, merge-friendly UUIDs and populates standard universal entity fields.
 */
export class UniversalUuidFactory {
  public generateUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  public decorateUniversalFields(createdBy = "StudioUser", metadata: Record<string, unknown> = {}): BaseUniversalEntity {
    const now = new Date();
    return {
      uuid: this.generateUuid(),
      createdAt: now,
      updatedAt: now,
      createdBy,
      modifiedBy: createdBy,
      version: 1,
      status: "Active",
      isDeleted: false,
      metadata,
    };
  }
}
