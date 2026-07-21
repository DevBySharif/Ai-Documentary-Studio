import { AutoDocumentationGenerator } from './auto-documentation-generator';
import { SearchableKnowledgeBase } from './searchable-knowledge-base';
import { VersionedDocumentation } from './versioned-documentation';
import { InteractiveDeveloperPortal } from './interactive-developer-portal';
import { ArchitectureDecisionRecords } from './architecture-decision-records';
import { CodeExampleLibrary } from './code-example-library';
import { ErrorKnowledgeBase } from './error-knowledge-base';
import { ChangeImpactMap } from './change-impact-map';
import { DocumentationQualityChecker } from './documentation-quality-checker';
import { AIDocumentationAssistant } from './ai-documentation-assistant';
import { OutputContractBuilder } from './output-contract';

export class DocumentationDeveloperFramework {
  public readonly autoGenerator: AutoDocumentationGenerator;
  public readonly knowledgeBase: SearchableKnowledgeBase;
  public readonly versionControl: VersionedDocumentation;
  
  public readonly devPortal: InteractiveDeveloperPortal;
  public readonly adr: ArchitectureDecisionRecords;
  public readonly examples: CodeExampleLibrary;
  public readonly errors: ErrorKnowledgeBase;
  public readonly impactMap: ChangeImpactMap;
  public readonly qualityChecker: DocumentationQualityChecker;
  public readonly aiAssistant: AIDocumentationAssistant;
  public readonly contractBuilder: OutputContractBuilder;

  constructor() {
    this.autoGenerator = new AutoDocumentationGenerator();
    this.knowledgeBase = new SearchableKnowledgeBase();
    this.versionControl = new VersionedDocumentation();
    
    this.devPortal = new InteractiveDeveloperPortal();
    this.adr = new ArchitectureDecisionRecords();
    this.examples = new CodeExampleLibrary();
    this.errors = new ErrorKnowledgeBase();
    this.impactMap = new ChangeImpactMap();
    this.qualityChecker = new DocumentationQualityChecker();
    this.aiAssistant = new AIDocumentationAssistant(this.knowledgeBase);
    this.contractBuilder = new OutputContractBuilder();
  }
}
