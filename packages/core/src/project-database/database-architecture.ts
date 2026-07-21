import { PDEntityType } from "./types";

export class PDDatabaseArchitecture {
  private layers: { layer: string; responsibility: string }[] = [
    { layer: "Application", responsibility: "Business logic and user-facing operations" },
    { layer: "Repository Layer", responsibility: "Data access abstraction and CRUD operations" },
    { layer: "ORM/Query Layer", responsibility: "Query building, relationships, and object mapping" },
    { layer: "Database Engine", responsibility: "Connection management, transactions, and query execution" },
    { layer: "Storage", responsibility: "Persistent data storage and retrieval" },
  ];

  getArchitecture(): { layer: string; responsibility: string }[] {
    return [...this.layers];
  }

  validateArchitecture(): boolean {
    return this.layers.length === 5;
  }

  getDataFlow(entityType: PDEntityType): string[] {
    return [
      `Application requests ${entityType}`,
      `Repository resolves ${entityType} data access`,
      `Query layer builds optimized query for ${entityType}`,
      `Engine executes query against ${entityType} storage`,
      `Storage returns ${entityType} data`,
    ];
  }
}
