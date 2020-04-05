import fs from 'fs-extra';
import path from 'path';

export const cleanDistFolder = async () => {
  const cwd = process.cwd();
  const distPath = path.resolve(cwd, 'dist');
  await fs.remove(distPath);
};
