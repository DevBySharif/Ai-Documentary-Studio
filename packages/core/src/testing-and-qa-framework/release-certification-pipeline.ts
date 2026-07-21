import { TestRunner } from './test-runner';
import { SecurityTesting } from './security-testing';

export class ReleaseCertificationPipeline {
  constructor(
    private testRunner: TestRunner,
    private securityTesting: SecurityTesting
  ) {}

  async certifyBuild(): Promise<boolean> {
    console.log("Starting Release Certification Pipeline...");

    const unit = await this.testRunner.runUnitTests("all");
    const e2e = await this.testRunner.runE2ETests();
    const secSandbox = this.securityTesting.validateSandbox();
    const secCrypto = this.securityTesting.validateEncryption();

    if (unit.failed > 0 || e2e.failed > 0 || !secSandbox.isValid || !secCrypto.isValid) {
      console.error("Release Certification FAILED.");
      return false;
    }

    console.log("Release Certification PASSED.");
    return true;
  }
}
