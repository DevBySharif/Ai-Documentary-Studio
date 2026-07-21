import { ApprovalCenterQaTracker } from "./approval-center-qa-tracker";
import { ExportPresetRenderQueue } from "./export-preset-render-queue";
import { DeliveryPackageWatermarkEngine } from "./delivery-package-watermark-engine";
import { FinalValidationPreflight } from "./final-validation-preflight";

/**
 * Master Review Center & Export Workspace UI Engine (Main Vol 05 Part 12).
 * Orchestrates final quality hub layout: Left Review Categories -> Center Review Dashboard -> Right Export Settings/Inspector -> Bottom Render Queue/Logs/History.
 */
export class MasterReviewExportUI {
  public readonly approvalCenter = new ApprovalCenterQaTracker();
  public readonly renderQueueManager = new ExportPresetRenderQueue();
  public readonly deliveryEngine = new DeliveryPackageWatermarkEngine();
  public readonly preflightValidator = new FinalValidationPreflight();

  public executeFinalDeliveryWorkflow(
    projectId: string,
    presetType: Parameters<ExportPresetRenderQueue["enqueueRenderJob"]>[1]
  ): { preflightValid: boolean; jobId: string; deliveryPackageId: string } {
    const validation = this.preflightValidator.runFinalPreflightValidation();
    const job = this.renderQueueManager.enqueueRenderJob(`Master Render - ${projectId}`, presetType, `d:/Youtube/Ai Documentary Studio/exports/${projectId}_master.mov`);
    const delPkg = this.deliveryEngine.generateDeliveryPackage(projectId);

    return {
      preflightValid: validation.isValid,
      jobId: job.jobId,
      deliveryPackageId: delPkg.packageId,
    };
  }
}
