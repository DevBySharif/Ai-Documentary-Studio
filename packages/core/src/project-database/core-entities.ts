import { PDEntityType, PDEntityRecord } from "./types";
import { PDUniqueIdentifiers } from "./unique-identifiers";

export class PDCoreEntities {
  private records = new Map<string, PDEntityRecord>();
  private registeredTypes = new Set<PDEntityType>();
  private uids = new PDUniqueIdentifiers();

  registerEntity(type: PDEntityType): void {
    this.registeredTypes.add(type);
  }

  isRegistered(type: PDEntityType): boolean {
    return this.registeredTypes.has(type);
  }

  getAllEntityTypes(): PDEntityType[] {
    return Array.from(this.registeredTypes);
  }

  createRecord(type: PDEntityType, data: Record<string, unknown>): PDEntityRecord {
    const id = this.uids.generateUUID();
    const now = new Date();
    const record: PDEntityRecord = {
      id,
      type,
      projectId: (data.projectId as string) || "",
      createdDate: now,
      updatedDate: now,
      version: 1,
      data,
      isDeleted: false,
    };
    this.records.set(id, record);
    this.uids.registerRecord(id, type);
    return record;
  }

  getRecord(id: string): PDEntityRecord | undefined {
    return this.records.get(id);
  }

  updateRecord(id: string, data: Partial<Record<string, unknown>>): void {
    const record = this.records.get(id);
    if (!record) {
      throw new Error(`Record ${id} not found`);
    }
    record.data = { ...record.data, ...data };
    record.updatedDate = new Date();
    record.version++;
  }

  deleteRecord(id: string): void {
    const record = this.records.get(id);
    if (!record) {
      throw new Error(`Record ${id} not found`);
    }
    record.isDeleted = true;
    record.updatedDate = new Date();
    record.version++;
  }
}
