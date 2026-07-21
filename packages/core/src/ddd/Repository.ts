/**
 * Base generic interface for Repositories.
 * Abstracts persistence mechanisms from the Domain layer.
 */
export interface Repository<T> {
  exists(id: string): Promise<boolean>;
  save(aggregate: T): Promise<void>;
  findById(id: string): Promise<T | null>;
  delete(id: string): Promise<void>;
}
