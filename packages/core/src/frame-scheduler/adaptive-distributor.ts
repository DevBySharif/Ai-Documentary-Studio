import type { FSWorkloadUnit } from "./types.js";

export class FSAdaptiveFrameDistributor {
  private units: FSWorkloadUnit[] = [];

  analyzeFrames(frames: number[], sceneMap: Map<number, string>, complexityMap: Map<number, number>, gpuIntensive: Set<number>): FSWorkloadUnit[] {
    this.units = [];
    const sceneGroups = new Map<string, number[]>();

    for (const f of frames) {
      const scene = sceneMap.get(f) ?? "unknown";
      if (!sceneGroups.has(scene)) sceneGroups.set(scene, []);
      sceneGroups.get(scene)!.push(f);
    }

    for (const [scene, sceneFrames] of sceneGroups) {
      const avgComplexity = sceneFrames.reduce((s, f) => s + (complexityMap.get(f) ?? 0.5), 0) / sceneFrames.length;
      const hasGPU = sceneFrames.some((f) => gpuIntensive.has(f));

      this.units.push({
        frames: sceneFrames,
        gpuIntensive: hasGPU,
        scene,
        complexity: avgComplexity,
        estimatedTime: sceneFrames.length * (hasGPU ? 3 : 1) * (avgComplexity + 0.5)
      });
    }

    this.units.sort((a, b) => b.estimatedTime - a.estimatedTime);
    return this.getUnits();
  }

  getUnits(): FSWorkloadUnit[] {
    return this.units.map((u) => ({ ...u }));
  }

  getGPUIntensiveUnits(): FSWorkloadUnit[] {
    return this.units.filter((u) => u.gpuIntensive);
  }

  getCacheFriendlyUnits(): FSWorkloadUnit[] {
    return this.units.filter((u) => u.scene !== "unknown" && u.complexity < 0.6);
  }

  balanceLoad(units: FSWorkloadUnit[]): FSWorkloadUnit[][] {
    const sorted = [...units].sort((a, b) => b.estimatedTime - a.estimatedTime);
    const left: FSWorkloadUnit[] = [];
    const right: FSWorkloadUnit[] = [];
    let leftTime = 0;
    let rightTime = 0;

    for (const u of sorted) {
      if (leftTime <= rightTime) {
        left.push(u);
        leftTime += u.estimatedTime;
      } else {
        right.push(u);
        rightTime += u.estimatedTime;
      }
    }

    return [left, right];
  }

  clear(): void {
    this.units = [];
  }
}
