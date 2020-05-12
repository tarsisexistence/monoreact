import fs from 'fs-extra';
import path from 'path';

export const cleanDistFolder = async () => {
  const cwd = process.cwd();
  const distPath = path.resolve(cwd, 'dist');
  await fs.remove(distPath);
};

// Taken from Create React App, react-dev-utils/clearConsole
// @see https://github.com/facebook/create-react-app/blob/master/packages/react-dev-utils/clearConsole.js
export function clearConsole() {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
  );
}

export const space = () => process.stdout.write('\n');
