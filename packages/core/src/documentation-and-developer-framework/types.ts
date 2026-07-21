export interface ADR {
  id: string;
  date: string;
  problem: string;
  alternativesConsidered: string[];
  finalDecision: string;
  rationale: string;
  consequences: string;
}

export interface ErrorDefinition {
  errorCode: string;
  description: string;
  possibleCauses: string[];
  recommendedSolutions: string[];
  relatedDocsUrl: string;
}

export interface DocVersion {
  version: string;
  author: string;
  creationDate: string;
  lastUpdated: string;
  appVersion: string;
  contentUrl: string;
}

export interface CodeExample {
  id: string;
  title: string;
  category: "Plugin" | "Timeline" | "Motion" | "QA" | "Export";
  codeSnippet: string;
  isVerified: boolean;
}

export interface OutputContract {
  documentation: string;
  api: string;
  architecture: string;
  knowledgeBase: string;
  status: string;
}
