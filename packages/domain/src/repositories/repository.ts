/**
 * Base generic repository contract for domain entities.
 */
export interface Repository<TEntity, TId> {
  getById(id: TId): Promise<TEntity | undefined>;
  findAll(): Promise<ReadonlyArray<TEntity>>;
  save(entity: TEntity): Promise<void>;
  delete(id: TId): Promise<void>;
  exists(id: TId): Promise<boolean>;
  count(): Promise<number>;
}
