export type SourceType =
  | "Website"
  | "PDF"
  | "Book"
  | "AcademicPaper"
  | "Note"
  | "Image"
  | "Video"
  | "Interview"
  | "GovernmentReport"
  | "ArchivedPage";

export type FactConfidenceLevel = "High" | "Medium" | "Low" | "Unverified" | "Conflicting";

export type ResearchApprovalStage =
  | "Collected"
  | "Reviewed"
  | "Verified"
  | "Approved"
  | "Archived";

export interface ResearchSourceItem {
  readonly sourceId: string;
  readonly title: string;
  readonly sourceType: SourceType;
  readonly urlOrPath: string;
  readonly confidence: FactConfidenceLevel;
  readonly approvalStage: ResearchApprovalStage;
  readonly isPinned: boolean;
  readonly lastUpdatedAt: Date;
}

export interface ResearchNoteItem {
  readonly noteId: string;
  readonly title: string;
  readonly contentText: string;
  readonly sourceIdReference?: string;
  readonly highlights: ReadonlyArray<string>;
  readonly createdAt: Date;
}

export interface EvidenceItem {
  readonly evidenceId: string;
  readonly claimText: string;
  readonly sourceId: string;
  readonly excerpt: string;
  readonly confidence: FactConfidenceLevel;
  readonly isVerified: boolean;
}

export interface EntityDescriptor {
  readonly entityId: string;
  readonly name: string;
  readonly category: "Person" | "Organization" | "Place" | "Event" | "Date" | "Concept" | "Document";
  readonly description: string;
  readonly confidenceScore: number;
  readonly relatedSourceIds: ReadonlyArray<string>;
}

export interface KnowledgeGraphNode {
  readonly nodeId: string;
  readonly label: string;
  readonly type: EntityDescriptor["category"];
  readonly connectedNodeIds: ReadonlyArray<string>;
}
