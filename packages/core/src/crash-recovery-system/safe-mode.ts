export class SafeMode {
  private safeModeEnabled: boolean = false;

  public enableSafeMode(): void {
    this.safeModeEnabled = true;
    console.log("Starting in SAFE MODE.");
    // Disable plugins
    // Disable GPU acceleration
    // Disable experimental features
    // Disable background jobs
  }

  public isSafeModeEnabled(): boolean {
    return this.safeModeEnabled;
  }

  public disableSafeMode(): void {
    this.safeModeEnabled = false;
  }

  public checkCrashLoop(crashCount: number): boolean {
    // If we crashed more than 3 times in quick succession
    if (crashCount >= 3) {
      this.enableSafeMode();
      return true;
    }
    return false;
  }
}
