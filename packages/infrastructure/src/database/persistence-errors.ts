/**
 * Persistence layer errors.
 * All storage exceptions are translated here before leaving the infrastructure boundary.
 */
export class PersistenceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PersistenceError";
  }
}

export class ConnectionError extends PersistenceError {
  constructor(cause: string) {
    super(`Database connection failed: ${cause}`);
    this.name = "ConnectionError";
  }
}

export class MigrationError extends PersistenceError {
  constructor(version: number, cause: string) {
    super(`Migration v${version} failed: ${cause}`);
    this.name = "MigrationError";
  }
}

export class ConstraintViolationError extends PersistenceError {
  constructor(entity: string, constraint: string) {
    super(`Constraint violation on '${entity}': ${constraint}`);
    this.name = "ConstraintViolationError";
  }
}

export class TransactionError extends PersistenceError {
  constructor(operation: string, cause: string) {
    super(`Transaction failed during '${operation}': ${cause}`);
    this.name = "TransactionError";
  }
}

export class RecordNotFoundError extends PersistenceError {
  constructor(entity: string, id: string) {
    super(`${entity} with id '${id}' was not found.`);
    this.name = "RecordNotFoundError";
  }
}
