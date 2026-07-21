import { PLPluginArchitecture } from './plugin-architecture';
import { PLPluginLifecycle } from './plugin-lifecycle';
import { PLPluginManifestManager } from './plugin-manifest';
import { PLPluginSandbox } from './plugin-sandbox';
import { PLPluginAPI } from './plugin-api';
import { PLPermissionSystem } from './permission-system';
import { PLPluginDependencies } from './plugin-dependencies';
import { PLPluginVersioning } from './plugin-versioning';
import { PLHotReload } from './hot-reload';
import { PLPluginEventSystem } from './event-system';
import { PLPluginStorage } from './plugin-storage';
import { PLErrorIsolation } from './error-isolation';
import { PLOutputContractBuilder } from './output-contract';
import { PLOfficialPluginMarketplace } from './official-plugin-marketplace';
import { PLDigitalSignatureVerification } from './digital-signature-verification';
import { PLPluginPerformanceMonitor } from './plugin-performance-monitor';
import { PLPluginSDK } from './plugin-sdk';
import { PLWorkflowAutomationPlugins } from './workflow-automation-plugins';
import { PLPluginCompatibilityTestSuite } from './plugin-compatibility-test-suite';

export class PLPluginSystem {
  public readonly architecture: PLPluginArchitecture;
  public readonly lifecycle: PLPluginLifecycle;
  public readonly manifestManager: PLPluginManifestManager;
  public readonly sandbox: PLPluginSandbox;
  public readonly api: PLPluginAPI;
  public readonly permissionSystem: PLPermissionSystem;
  public readonly dependencies: PLPluginDependencies;
  public readonly versioning: PLPluginVersioning;
  public readonly hotReload: PLHotReload;
  public readonly eventSystem: PLPluginEventSystem;
  public readonly storage: PLPluginStorage;
  public readonly errorIsolation: PLErrorIsolation;
  public readonly outputContractBuilder: PLOutputContractBuilder;
  public readonly marketplace: PLOfficialPluginMarketplace;
  public readonly signatureVerification: PLDigitalSignatureVerification;
  public readonly performanceMonitor: PLPluginPerformanceMonitor;
  public readonly sdk: PLPluginSDK;
  public readonly workflowAutomation: PLWorkflowAutomationPlugins;
  public readonly compatibilityTestSuite: PLPluginCompatibilityTestSuite;

  constructor() {
    this.architecture = new PLPluginArchitecture();
    this.lifecycle = new PLPluginLifecycle();
    this.manifestManager = new PLPluginManifestManager();
    this.sandbox = new PLPluginSandbox();
    this.api = new PLPluginAPI();
    this.permissionSystem = new PLPermissionSystem();
    this.dependencies = new PLPluginDependencies();
    this.versioning = new PLPluginVersioning();
    this.hotReload = new PLHotReload();
    this.eventSystem = new PLPluginEventSystem();
    this.storage = new PLPluginStorage();
    this.errorIsolation = new PLErrorIsolation();
    this.outputContractBuilder = new PLOutputContractBuilder();
    this.marketplace = new PLOfficialPluginMarketplace();
    this.signatureVerification = new PLDigitalSignatureVerification();
    this.performanceMonitor = new PLPluginPerformanceMonitor();
    this.sdk = new PLPluginSDK();
    this.workflowAutomation = new PLWorkflowAutomationPlugins();
    this.compatibilityTestSuite = new PLPluginCompatibilityTestSuite(
      this.manifestManager,
      this.lifecycle,
      this.permissionSystem,
      this.eventSystem,
      this.dependencies,
      this.performanceMonitor,
    );
  }
}
