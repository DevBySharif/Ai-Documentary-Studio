import { UpdatePackage } from './types';

export class LTSChannelManager {
  private readonly isLTS: boolean = true;

  filterUpdatesForLTS(availableUpdates: UpdatePackage[]): UpdatePackage[] {
    if (!this.isLTS) return availableUpdates;
    
    // For LTS channels, we only accept Security updates, or updates explicitly marked for the LTS channel
    return availableUpdates.filter(pkg => 
      pkg.type === "Security" || 
      pkg.version.channel === "LTS"
    );
  }

  isUpdateSafeForLTS(pkg: UpdatePackage): boolean {
    // LTS rules: minimal breaking changes
    return pkg.type === "Security" || pkg.version.channel === "LTS";
  }
}
