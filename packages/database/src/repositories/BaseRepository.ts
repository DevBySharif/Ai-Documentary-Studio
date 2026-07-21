import { db } from '../client';
import { eq } from 'drizzle-orm';
import { SQLiteTable } from 'drizzle-orm/sqlite-core';
import { Repository } from '@studio/core';

/**
 * Base abstract repository enforcing DDD principles and Soft Deletes.
 */
export abstract class BaseRepository<T, TSchema extends SQLiteTable> implements Repository<T> {
  protected constructor(
    protected readonly table: TSchema,
    protected readonly idColumn: any
  ) {}

  abstract exists(id: string): Promise<boolean>;
  abstract save(aggregate: T): Promise<void>;
  abstract findById(id: string): Promise<T | null>;

  /**
   * Enforces soft delete by updating deletedAt timestamp instead of a hard SQL DELETE.
   */
  async delete(id: string): Promise<void> {
    await db.update(this.table)
      .set({ deletedAt: new Date() } as any)
      .where(eq(this.idColumn, id));
  }
}
