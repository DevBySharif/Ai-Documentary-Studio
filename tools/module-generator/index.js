const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: pnpm create:module <module-name>");
  process.exit(1);
}

const moduleName = args[0];
const rootDir = path.resolve(__dirname, '../../modules', moduleName);

if (fs.existsSync(rootDir)) {
  console.error(`Module '${moduleName}' already exists.`);
  process.exit(1);
}

const folders = [
  'application/commands',
  'application/queries',
  'application/use-cases',
  'domain/entities',
  'domain/events',
  'domain/services',
  'infrastructure/database',
  'presentation/components',
  'contracts',
  'repositories',
  'tests/unit'
];

folders.forEach(folder => {
  fs.mkdirSync(path.join(rootDir, folder), { recursive: true });
});

fs.writeFileSync(path.join(rootDir, 'index.ts'), `// Export public API for ${moduleName} module here\n`);

const readmeContent = `# ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} Module

## Purpose
[Describe the core responsibility of this module]

## Public APIs
[List interfaces and services exposed]

## Dependencies
- None yet

## Events Published
- None yet
`;

fs.writeFileSync(path.join(rootDir, 'README.md'), readmeContent);

console.log(`Successfully generated module '${moduleName}' in modules/${moduleName}`);
