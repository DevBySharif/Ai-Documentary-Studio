import { container } from 'tsyringe';

export class ServiceRegistry {
  static initialize() {
    // Register backend services
    // container.registerSingleton('DatabaseService', DatabaseService);
    // container.registerSingleton('RenderService', RenderService);
  }

  static get<T>(token: string | symbol): T {
    return container.resolve<T>(token);
  }
}
