export class SecureExports {
  sanitizeExportPackage(projectData: any): any {
    console.log("Sanitizing project export...");
    
    // Deep clone to avoid mutating active project
    const sanitized = JSON.parse(JSON.stringify(projectData));

    // Strip secrets
    if (sanitized.apiKeys) delete sanitized.apiKeys;
    if (sanitized.secrets) delete sanitized.secrets;
    if (sanitized.localTokens) delete sanitized.localTokens;

    // Strip caches
    if (sanitized.cache) delete sanitized.cache;

    return sanitized;
  }
}
