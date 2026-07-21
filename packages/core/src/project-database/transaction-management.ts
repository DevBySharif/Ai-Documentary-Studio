import { PDTransactionResult } from "./types";
import { PDUniqueIdentifiers } from "./unique-identifiers";

export class PDTransactionManagement {
  private transactions = new Map<string, { operations: (() => void)[]; description: string }>();
  private uids = new PDUniqueIdentifiers();

  beginTransaction(): string {
    const id = this.uids.generateUUID();
    this.transactions.set(id, { operations: [], description: "" });
    return id;
  }

  commit(transactionId: string): PDTransactionResult {
    const txn = this.transactions.get(transactionId);
    if (!txn) {
      return { success: false, affectedRecords: 0, error: "Transaction not found", rollback: false };
    }
    try {
      for (const op of txn.operations) {
        op();
      }
      this.transactions.delete(transactionId);
      return { success: true, affectedRecords: txn.operations.length, error: undefined, rollback: false };
    } catch (err) {
      return {
        success: false,
        affectedRecords: 0,
        error: err instanceof Error ? err.message : String(err),
        rollback: false,
      };
    }
  }

  rollback(transactionId: string): PDTransactionResult {
    const txn = this.transactions.get(transactionId);
    if (!txn) {
      return { success: false, affectedRecords: 0, error: "Transaction not found", rollback: false };
    }
    this.transactions.delete(transactionId);
    return { success: true, affectedRecords: 0, error: undefined, rollback: true };
  }

  executeAtomic(operations: (() => void)[], description: string): PDTransactionResult {
    const txnId = this.beginTransaction();
    const txn = this.transactions.get(txnId)!;
    txn.operations.push(...operations);
    txn.description = description;
    return this.commit(txnId);
  }
}
