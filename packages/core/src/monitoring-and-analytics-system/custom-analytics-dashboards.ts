import { DashboardWidget } from './types';

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: DashboardWidget[];
}

export class CustomAnalyticsDashboards {
  private layouts: Map<string, DashboardLayout> = new Map();

  saveLayout(layout: DashboardLayout): void {
    this.layouts.set(layout.id, layout);
  }

  getLayout(id: string): DashboardLayout | undefined {
    return this.layouts.get(id);
  }

  getAllLayouts(): DashboardLayout[] {
    return Array.from(this.layouts.values());
  }
}
