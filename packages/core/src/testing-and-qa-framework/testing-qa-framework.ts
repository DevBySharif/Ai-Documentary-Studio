import { TestRunner } from './test-runner';
import { AIValidationEngine } from './validation-engine';
import { ImageQualityTesting } from './image-quality-testing';
import { VoiceQualityTesting } from './voice-quality-testing';
import { TimelineValidation } from './timeline-validation';
import { RenderValidation } from './render-validation';
import { SecurityTesting } from './security-testing';
import { TestReports } from './test-reports';
import { GoldenMasterTesting } from './golden-master-testing';
import { AIEvaluationBenchmarkSuite } from './ai-evaluation-benchmark-suite';
import { VisualDifferenceEngine } from './visual-difference-engine';
import { ReleaseCertificationPipeline } from './release-certification-pipeline';
import { ContinuousQualityMonitor } from './continuous-quality-monitor';
import { SelfTestMode } from './self-test-mode';
import { OutputContractBuilder } from './output-contract';

export class TestingQAFramework {
  public readonly testRunner: TestRunner;
  public readonly validationEngine: AIValidationEngine;
  public readonly imageQuality: ImageQualityTesting;
  public readonly voiceQuality: VoiceQualityTesting;
  public readonly timelineValidation: TimelineValidation;
  public readonly renderValidation: RenderValidation;
  public readonly securityTesting: SecurityTesting;
  public readonly reports: TestReports;
  
  public readonly goldenMaster: GoldenMasterTesting;
  public readonly benchmarkSuite: AIEvaluationBenchmarkSuite;
  public readonly visualDiff: VisualDifferenceEngine;
  public readonly certificationPipeline: ReleaseCertificationPipeline;
  public readonly qualityMonitor: ContinuousQualityMonitor;
  public readonly selfTest: SelfTestMode;
  public readonly contractBuilder: OutputContractBuilder;

  constructor() {
    this.testRunner = new TestRunner();
    this.validationEngine = new AIValidationEngine();
    this.imageQuality = new ImageQualityTesting();
    this.voiceQuality = new VoiceQualityTesting();
    this.timelineValidation = new TimelineValidation();
    this.renderValidation = new RenderValidation();
    this.securityTesting = new SecurityTesting();
    this.reports = new TestReports();

    this.goldenMaster = new GoldenMasterTesting();
    this.benchmarkSuite = new AIEvaluationBenchmarkSuite();
    this.visualDiff = new VisualDifferenceEngine();
    this.certificationPipeline = new ReleaseCertificationPipeline(this.testRunner, this.securityTesting);
    this.qualityMonitor = new ContinuousQualityMonitor();
    this.selfTest = new SelfTestMode();
    this.contractBuilder = new OutputContractBuilder();
  }
}
