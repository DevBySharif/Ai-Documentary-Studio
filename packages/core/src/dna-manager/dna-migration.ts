export class DNAMigration {
  migrate(oldVersion: string, newVersion: string): boolean {
    return true;
  }

  isCompatible(oldVersion: string, newVersion: string): boolean {
    return true;
  }

  getMigrationPath(from: string, to: string): string[] {
    return [from, to];
  }
}
