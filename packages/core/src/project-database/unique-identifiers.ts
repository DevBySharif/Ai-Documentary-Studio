import * as crypto from "crypto";
import { PDEntityType } from "./types";

export class PDUniqueIdentifiers {
  private records = new Map<string, { type: PDEntityType; created: Date }>();

  generateUUID(): string {
    return crypto.randomUUID();
  }

  registerRecord(id: string, type: PDEntityType): void {
    this.records.set(id, { type, created: new Date() });
  }

  getRecord(id: string): { type: PDEntityType; created: Date } | undefined {
    return this.records.get(id);
  }

  exists(id: string): boolean {
    return this.records.has(id);
  }

  validateUUID(id: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }
}
