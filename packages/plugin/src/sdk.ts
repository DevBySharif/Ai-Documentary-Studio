import { PermissionGateway } from './gateway';
import pino from 'pino';

const logger = pino({ name: 'plugin-sdk' });

/**
 * The Plugin SDK is the ONLY object passed into the Plugin Sandbox.
 * It wraps all internal application capabilities behind the PermissionGateway.
 */
export class PluginSDK {
  constructor(private gateway: PermissionGateway, private pluginId: string) {}

  getTimeline(): any {
    this.gateway.assert('ReadTimeline');
    logger.debug({ pluginId: this.pluginId }, 'Accessed Timeline API');
    // In a real system, we return a read-only clone or proxy of the timeline.
    return { id: 'mock-timeline-data' };
  }

  exportMedia(config: any): void {
    this.gateway.assert('ExportMedia');
    logger.debug({ pluginId: this.pluginId, config }, 'Triggered ExportMedia');
  }

  registerUIPanel(panelDef: any): void {
    this.gateway.assert('RegisterUIPanels');
    logger.debug({ pluginId: this.pluginId, panelDef }, 'Registered UI Panel');
  }

  log(message: string, context?: any): void {
    // Logging doesn't require strict permissions, but we isolate the logger
    logger.info({ pluginId: this.pluginId, ...context }, `[Plugin] ${message}`);
  }
}
