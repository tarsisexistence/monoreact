import * as path from 'path';
import * as fs from 'fs-extra';

export const getRelativePath = (...paths: string[]): string => path.resolve(process.cwd(), ...paths);
export const getJsonByRelativePath = (...paths: string[]) => fs.readJSONSync(getRelativePath(...paths));
