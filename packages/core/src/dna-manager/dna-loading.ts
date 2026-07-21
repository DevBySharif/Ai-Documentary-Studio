export class DNALoading {
  load(dnaId: string): boolean {
    return true;
  }

  validateBeforeProduction(dnaId: string): boolean {
    return true;
  }

  isReady(dnaId: string): boolean {
    return this.load(dnaId) && this.validateBeforeProduction(dnaId);
  }
}
