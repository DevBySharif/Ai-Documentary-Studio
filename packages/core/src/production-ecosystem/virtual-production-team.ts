export type SpecialistRole =
  | "Researcher"
  | "ScriptWriter"
  | "DocumentaryDirector"
  | "StoryboardArtist"
  | "VoiceDirector"
  | "VisualPlanner"
  | "Editor"
  | "Reviewer"
  | "QualityAnalyst";

export interface VirtualTeamMember {
  readonly role: SpecialistRole;
  readonly displayName: string;
  readonly primaryDomain: string;
}

/**
 * Virtual Production Team Coordinator (Vol 04 Part 01 - Section 3).
 * AI behaves as a virtual team of specialists collaborating with the user.
 */
export class VirtualProductionTeam {
  private members = new Map<SpecialistRole, VirtualTeamMember>();

  constructor() {
    this.initTeam();
  }

  private initTeam(): void {
    const team: VirtualTeamMember[] = [
      { role: "Researcher", displayName: "Lead Researcher AI", primaryDomain: "ResearchIntelligence" },
      { role: "ScriptWriter", displayName: "Master Scriptwriter AI", primaryDomain: "WritingIntelligence" },
      { role: "DocumentaryDirector", displayName: "Documentary Director AI", primaryDomain: "WritingIntelligence" },
      { role: "StoryboardArtist", displayName: "Storyboard Artist AI", primaryDomain: "VisualIntelligence" },
      { role: "VoiceDirector", displayName: "Voice Director AI", primaryDomain: "AudioIntelligence" },
      { role: "VisualPlanner", displayName: "Visual Planner AI", primaryDomain: "VisualIntelligence" },
      { role: "Editor", displayName: "Lead NLE Editor AI", primaryDomain: "EditingIntelligence" },
      { role: "Reviewer", displayName: "Content Reviewer AI", primaryDomain: "ReviewIntelligence" },
      { role: "QualityAnalyst", displayName: "Quality & Fact Analyst AI", primaryDomain: "ReviewIntelligence" },
    ];

    team.forEach((m) => this.members.set(m.role, m));
  }

  public getMember(role: SpecialistRole): VirtualTeamMember | undefined {
    return this.members.get(role);
  }

  public listTeam(): ReadonlyArray<VirtualTeamMember> {
    return Array.from(this.members.values());
  }
}
