export type ResearchMode = "Quick" | "Standard" | "Deep";

export type SourceCategory =
  | "AcademicPublication"
  | "Book"
  | "GovernmentSource"
  | "Museum"
  | "OfficialOrganization"
  | "HistoricalArchive"
  | "ReputableNews"
  | "PublicDataset";

export interface CredibilityProfile {
  readonly publisherReputationScore: number; // 0 to 1
  readonly authorExpertiseScore: number; // 0 to 1
  readonly isPrimarySource: boolean;
  readonly citationFrequency: number;
  readonly internalConsistencyScore: number; // 0 to 1
  readonly overallCredibilityScore: number; // 0 to 1
}

export interface ExtractedFact {
  readonly factId: string;
  readonly statement: string;
  readonly category: "Date" | "Location" | "Person" | "Organization" | "Event" | "Statistic" | "Quote";
  readonly confidence: number;
  readonly sourceUrl?: string;
  readonly isPinned: boolean;
}

export interface DetectedEntity {
  readonly entityId: string;
  readonly name: string;
  readonly type: "Person" | "Country" | "City" | "Organization" | "ScientificConcept" | "War" | "Discovery" | "Document";
  readonly description: string;
}
