import { ArtifactBuilder } from './builder';
import { UpdateManager } from './updater';
import { MigrationManager } from './migration';
import { UpdatePolicyEngine, PolicyContext } from './policy';
import { ReleaseChannel } from './models';
import pino from 'pino';

const logger = pino({ name: 'release-engine' });

export class ReleaseEngineFacade {
  public builder: ArtifactBuilder;
  public updater: UpdateManager;
  public migration: MigrationManager;
  public policy: UpdatePolicyEngine;

  constructor(context: PolicyContext) {
    this.builder = new ArtifactBuilder();
    this.updater = new UpdateManager();
    this.migration = new MigrationManager();
    this.policy = new UpdatePolicyEngine(context);
  }

  /**
   * High-level workflow for executing a verified update.
   */
  async executeUpdateFlow(): Promise<void> {
    const channel = this.policy.resolveTargetChannel();
    logger.info({ channel }, 'Initiating update workflow on resolved channel');

    const manifest = await this.updater.checkForUpdates();
    if (!manifest) {
      logger.info('System is up to date.');
      return;
    }

    if (manifest.requiresMigration) {
      await this.migration.prepareForUpgrade();
    }

    await this.updater.downloadUpdate(manifest);
    await this.updater.installUpdate();
  }
}
