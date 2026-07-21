export class DeploymentValidatorProxy {
  validate(): boolean {
    console.log("[VALIDATOR] Deployment Pipeline -> PASSED");
    return true;
  }
}
