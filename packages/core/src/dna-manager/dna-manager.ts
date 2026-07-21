import type { DNASection, DNAVersion, DNAValidationResult, DNAPerformanceMetrics, DNAEvolutionSuggestion, DNAOutputContract } from "./types.js";
import { DNAStructure } from "./dna-structure.js";
import { DNALoading } from "./dna-loading.js";
import { DNAVersioning } from "./dna-versioning.js";
import { DNAInheritanceEngine } from "./dna-inheritance.js";
import { DNAValidation } from "./dna-validation.js";
import { DNAEditor } from "./dna-editor.js";
import { DNAAICreator } from "./dna-ai-creator.js";
import { DNAImportExport } from "./dna-import-export.js";
import { DNAMigration } from "./dna-migration.js";
import { DNALocking } from "./dna-locking.js";
import { DNALibrary } from "./dna-library.js";
import { DNADiffViewer } from "./dna-diff-viewer.js";
import { DNATestMode } from "./dna-test-mode.js";
import { DNAActiveSwitching } from "./dna-active-switching.js";
import { DNAKnowledgeBase } from "./dna-knowledge-base.js";
import { DNAPerformanceAnalyzer } from "./dna-performance-analyzer.js";
import { DNAMarketplaceReady } from "./dna-marketplace-ready.js";
import { DNAAIEvolution } from "./dna-ai-evolution.js";
import { DNAOutputContractBuilder } from "./output-contract.js";

export class DNAChannelDNAManager {
  readonly structure: DNAStructure;
  readonly loading: DNALoading;
  readonly versioning: DNAVersioning;
  readonly inheritance: DNAInheritanceEngine;
  readonly validation: DNAValidation;
  readonly editor: DNAEditor;
  readonly aiCreator: DNAAICreator;
  readonly importExport: DNAImportExport;
  readonly migration: DNAMigration;
  readonly locking: DNALocking;
  readonly library: DNALibrary;
  readonly diff: DNADiffViewer;
  readonly testMode: DNATestMode;
  readonly switching: DNAActiveSwitching;
  readonly knowledgeBase: DNAKnowledgeBase;
  readonly performance: DNAPerformanceAnalyzer;
  readonly marketplace: DNAMarketplaceReady;
  readonly evolution: DNAAIEvolution;
  readonly outputContract: DNAOutputContractBuilder;

  constructor() {
    this.structure = new DNAStructure();
    this.loading = new DNALoading();
    this.versioning = new DNAVersioning();
    this.inheritance = new DNAInheritanceEngine();
    this.validation = new DNAValidation();
    this.editor = new DNAEditor();
    this.aiCreator = new DNAAICreator();
    this.importExport = new DNAImportExport();
    this.migration = new DNAMigration();
    this.locking = new DNALocking();
    this.library = new DNALibrary();
    this.diff = new DNADiffViewer();
    this.testMode = new DNATestMode();
    this.switching = new DNAActiveSwitching();
    this.knowledgeBase = new DNAKnowledgeBase();
    this.performance = new DNAPerformanceAnalyzer();
    this.marketplace = new DNAMarketplaceReady();
    this.evolution = new DNAAIEvolution();
    this.outputContract = new DNAOutputContractBuilder();
  }
}
