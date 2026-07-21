import { DependencyInjectionContainer } from './dependency-injection';
import { EventBus } from './event-bus';
import { Logger } from './logger';

export class SystemArchitectureFoundation {
  public readonly di: DependencyInjectionContainer;
  public readonly events: EventBus;
  public readonly logger: Logger;

  constructor() {
    this.di = new DependencyInjectionContainer();
    this.events = new EventBus();
    this.logger = new Logger();

    // Register foundational dependencies
    this.di.register('ILogger', this.logger);
    this.di.register('IEventBus', this.events);
  }

  bootstrap(): void {
    this.logger.info("System", "System Architecture Foundation bootstrapped successfully.");
  }
}
