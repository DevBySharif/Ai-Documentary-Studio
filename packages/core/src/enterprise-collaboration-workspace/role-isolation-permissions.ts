import { ProductionRoleType } from "./collaboration-types";

/**
 * Production Role Isolation & Permission Profile Evaluator (Vol 08 Part 01 - Section 6, Section 12).
 * Enforces least-privilege principles across 9 production roles (`Producer`, `Director`, `Researcher`, `ScriptWriter`, `StoryboardArtist`, `AiOperator`, `Reviewer`, `Narrator`, `Admin`).
 */
export class RoleIsolationPermissions {
  private allowedActionsByRole: Record<ProductionRoleType, string[]> = {
    Administrator: ["*"],
    Producer: ["ManageMembers", "EditProject", "ApproveScript", "ExportProject", "ViewBilling"],
    Director: ["EditScript", "ApproveStoryboard", "DirectVoice", "ExportProject"],
    Researcher: ["AddResearch", "EditResearch", "ViewProject"],
    ScriptWriter: ["EditScript", "ViewResearch", "ViewProject"],
    StoryboardArtist: ["CreateStoryboard", "ViewScript", "ViewProject"],
    AiOperator: ["GeneratePrompts", "GenerateImages", "SynthesizeVoice"],
    Reviewer: ["ReviewContent", "ApproveStoryboard", "AddComments"],
    Narrator: ["UploadVoice", "ViewScript"],
  };

  public canPerformRoleAction(role: ProductionRoleType, action: string): boolean {
    const actions = this.allowedActionsByRole[role] || [];
    return actions.includes("*") || actions.includes(action);
  }
}
