import { TelemetryCollector } from './telemetry-collector';
import { CostAnalytics } from './cost-analytics';
import { AIUsageAnalytics, ImageAnalytics, VoiceAnalytics, RenderAnalytics, StorageAnalytics } from './domain-analytics';
import { HardwareMonitoring } from './hardware-monitoring';
import { AlertSystem } from './alert-system';
import { ProductionKPITracker } from './production-kpis';
import { PredictiveAnalyticsEngine } from './predictive-analytics-engine';
import { IntelligentRecommendationEngine } from './intelligent-recommendation-engine';
import { QualityScorecard } from './quality-scorecard';
import { OperationalHealthIndex } from './operational-health-index';
import { AnomalyDetectionEngine } from './anomaly-detection-engine';
import { ProductionBenchmarkCenter } from './production-benchmark-center';
import { CustomAnalyticsDashboards } from './custom-analytics-dashboards';
import { RealTimeDashboard } from './real-time-dashboard';
import { OutputContractBuilder } from './output-contract';

export class MonitoringAnalyticsSystem {
  public readonly telemetry: TelemetryCollector;
  public readonly costAnalytics: CostAnalytics;
  public readonly alertSystem: AlertSystem;
  public readonly hardwareMonitoring: HardwareMonitoring;
  
  public readonly aiAnalytics: AIUsageAnalytics;
  public readonly imageAnalytics: ImageAnalytics;
  public readonly voiceAnalytics: VoiceAnalytics;
  public readonly renderAnalytics: RenderAnalytics;
  public readonly storageAnalytics: StorageAnalytics;

  public readonly kpiTracker: ProductionKPITracker;
  public readonly predictiveEngine: PredictiveAnalyticsEngine;
  public readonly recommendationEngine: IntelligentRecommendationEngine;
  public readonly qualityScorecard: QualityScorecard;
  public readonly healthIndex: OperationalHealthIndex;
  public readonly anomalyDetector: AnomalyDetectionEngine;
  public readonly benchmarkCenter: ProductionBenchmarkCenter;
  public readonly customDashboards: CustomAnalyticsDashboards;
  public readonly realTimeDashboard: RealTimeDashboard;
  public readonly contractBuilder: OutputContractBuilder;

  constructor() {
    this.telemetry = new TelemetryCollector();
    this.costAnalytics = new CostAnalytics();
    this.alertSystem = new AlertSystem();
    
    this.hardwareMonitoring = new HardwareMonitoring(this.telemetry, this.alertSystem);
    
    this.aiAnalytics = new AIUsageAnalytics();
    this.imageAnalytics = new ImageAnalytics();
    this.voiceAnalytics = new VoiceAnalytics();
    this.renderAnalytics = new RenderAnalytics();
    this.storageAnalytics = new StorageAnalytics();

    this.kpiTracker = new ProductionKPITracker();
    this.predictiveEngine = new PredictiveAnalyticsEngine();
    this.recommendationEngine = new IntelligentRecommendationEngine();
    this.qualityScorecard = new QualityScorecard();
    
    this.healthIndex = new OperationalHealthIndex(this.alertSystem);
    this.anomalyDetector = new AnomalyDetectionEngine(this.alertSystem);
    this.benchmarkCenter = new ProductionBenchmarkCenter();
    this.customDashboards = new CustomAnalyticsDashboards();
    
    this.realTimeDashboard = new RealTimeDashboard(this.telemetry, this.costAnalytics, this.alertSystem);
    this.contractBuilder = new OutputContractBuilder();
  }

  start(): void {
    this.telemetry.startPolling();
    console.log("Monitoring & Analytics System started.");
  }

  stop(): void {
    this.telemetry.stopPolling();
  }
}
