/**
 * Base class for all Entities.
 * Entities have identity and mutable state, but equality is strictly by ID.
 */
export abstract class Entity<T> {
  public readonly id: string;
  public readonly props: T;

  protected constructor(id: string, props: T) {
    this.id = id;
    this.props = props;
  }

  public equals(object?: Entity<T>): boolean {
    if (object == null || object == undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!isEntity(object)) {
      return false;
    }

    return this.id === object.id;
  }
}

const isEntity = (v: any): v is Entity<any> => {
  return v instanceof Entity;
};
