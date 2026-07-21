import type { MasterEvent, MasterRenderPackage, RenderQuality, TimelineSnapshot, TimelineAnalytics, ProductionGraph, ExportProfile, RenderManifest } from "./types.js";
import { EventScheduler } from "./event-scheduler.js";
import { DependencyResolver } from "./dependency-resolver.js";
import { MasterRenderPackageBuilder } from "./render-package.js";
import { TimelineVersionControl } from "./version-control.js";
import { TimelineAnalyticsEngine } from "./analytics.js";
import { ProductionGraphBuilder } from "./production-graph.js";
import { ExportManager } from "./export-manager.js";

export class MasterTimelineEngine {
  private scheduler: EventScheduler;
  private dependencyResolver: DependencyResolver;
  private renderBuilder: MasterRenderPackageBuilder;
  private versionControl: TimelineVersionControl;
  private analytics: TimelineAnalyticsEngine;
  private productionGraph: ProductionGraphBuilder;
  private exportManager: ExportManager;
  private events: MasterEvent[] = [];

  constructor() {
    this.scheduler = new EventScheduler();
    this.dependencyResolver = new DependencyResolver();
    this.renderBuilder = new MasterRenderPackageBuilder();
    this.versionControl = new TimelineVersionControl();
    this.analytics = new TimelineAnalyticsEngine();
    this.productionGraph = new ProductionGraphBuilder();
    this.exportManager = new ExportManager();
  }

  load(events: MasterEvent[]): void {
    const cycle = this.dependencyResolver.findCycle(events);
    if (cycle.length > 0) {
      throw new Error(`Dependency cycle detected: ${cycle.join(" -> ")}`);
    }
    this.events = this.dependencyResolver.topoSort(events);
    this.scheduler.schedule(this.events);
    this.versionControl.snapshot(this.events, "initial_load");
  }

  getEvents(): MasterEvent[] {
    return [...this.events];
  }

  update(events: MasterEvent[], reason: string): void {
    this.events = this.dependencyResolver.topoSort(events);
    this.scheduler.schedule(this.events);
    this.versionControl.snapshot(this.events, reason);
  }

  buildRenderPackage(): MasterRenderPackage {
    return this.renderBuilder.build(this.events);
  }

  sealRender(renderPackage: MasterRenderPackage): MasterRenderPackage {
    return this.renderBuilder.seal(renderPackage);
  }

  setRenderQuality(renderPackage: MasterRenderPackage, quality: RenderQuality): MasterRenderPackage {
    return this.exportManager.setQuality(renderPackage, quality);
  }

  generateManifest(renderPackage: MasterRenderPackage, profile: ExportProfile): RenderManifest {
    return this.exportManager.generateManifest(renderPackage, profile);
  }

  snapshot(reason: string): TimelineSnapshot {
    return this.versionControl.snapshot(this.events, reason);
  }

  rollback(version: number): MasterEvent[] | null {
    const events = this.versionControl.rollback(version);
    if (events) {
      this.events = events;
      this.scheduler.schedule(this.events);
    }
    return events;
  }

  getAnalytics(): TimelineAnalytics {
    return this.analytics.analyze(this.events);
  }

  buildProductionGraph(): ProductionGraph {
    return this.productionGraph.build(this.events);
  }

  getCriticalPath(): string[] {
    return this.productionGraph.findCriticalPath(this.buildProductionGraph());
  }

  getVersionHistory(limit?: number): TimelineSnapshot[] {
    return this.versionControl.getHistory(limit);
  }

  compareVersions(v1: number, v2: number) {
    return this.versionControl.compare(v1, v2);
  }

  get currentVersion(): number {
    return this.versionControl.currentVersion;
  }

  getExportConfig(profile: ExportProfile) {
    return this.exportManager.getConfig(profile);
  }

  tick(delta: number): MasterEvent[] {
    return this.scheduler.tick(delta);
  }
}
