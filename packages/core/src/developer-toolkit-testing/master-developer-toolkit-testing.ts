import { SdkCliTemplateGenerator } from "./sdk-cli-template-generator";
import { LocalDevRuntimeMockServices } from "./local-dev-runtime-mock-services";
import { ExtensionTestingContinuousCi } from "./extension-testing-continuous-ci";
import { ExtensionDebuggerDiagnosticsDocs } from "./extension-debugger-diagnostics-docs";
import { ProjectTemplateType } from "./developer-toolkit-types";

/**
 * Master Developer Toolkit Engine (Main Vol 10 Part 07).
 * Core entry point for 6-layer developer toolchain (`Developer → SDK CLI → Local Runtime → Testing Framework → Debugger → Marketplace Publishing`).
 */
export class MasterDeveloperToolkitTesting {
  public readonly cliGenerator = new SdkCliTemplateGenerator();
  public readonly localRuntime = new LocalDevRuntimeMockServices();
  public readonly testingFramework = new ExtensionTestingContinuousCi();
  public readonly debuggerDiagnostics = new ExtensionDebuggerDiagnosticsDocs();

  public createAndTestExtension(
    templateType: ProjectTemplateType,
    extensionName: string
  ): {
    scaffold: ReturnType<SdkCliTemplateGenerator["scaffoldProjectTemplate"]>;
    runtime: ReturnType<LocalDevRuntimeMockServices["startLocalDevRuntime"]>;
    testResults: ReturnType<ExtensionTestingContinuousCi["runTestCategory"]>;
  } {
    const scaffold = this.cliGenerator.scaffoldProjectTemplate(templateType, extensionName);
    const runtime = this.localRuntime.startLocalDevRuntime();
    const testResults = this.testingFramework.runTestCategory("UnitTests");

    return {
      scaffold,
      runtime,
      testResults,
    };
  }
}
