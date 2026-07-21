export abstract class DomainEvent {
  public readonly id: string;
  public readonly timestamp: Date;
  public readonly name: string;

  constructor(name: string) {
    this.id = crypto.randomUUID();
    this.timestamp = new Date();
    this.name = name;
  }
}
