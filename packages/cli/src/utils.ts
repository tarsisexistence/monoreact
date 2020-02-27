import fs from 'fs-extra';
import path from 'path';
import camelCase from 'camelcase';

// Remove the package name scope if it exists
export const removeScope = (name: string) => name.replace(/^@.*\//, '');

// UMD-safe package name
export const safeVariableName = (name: string) =>
  camelCase(
    removeScope(name)
      .toLowerCase()
      .replace(/((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, '')
  );

export const safePackageName = (name: string) =>
  name
    .toLowerCase()
    .replace(/(^@.*\/)|((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, '');

export const resolveApp = (relativePath: string) =>
  path.resolve(fs.realpathSync(process.cwd()), relativePath);

export function findByPattern(
  startPath: string,
  filter: string
): string | undefined {
  if (fs.existsSync(startPath)) {
    const files = fs.readdirSync(startPath);
    for (let i = 0; i < files.length; i++) {
      const filename = path.join(startPath, files[i]);
      const isNodeModule = filename.includes('node_modules');

      if (!isNodeModule && filename.indexOf(filter) >= 0) {
        return filename;
      }
    }
  }

  return;
}
