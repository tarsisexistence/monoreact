import fs from 'fs-extra';
import path from 'path';
import { defer, from, Observable, of } from 'rxjs';

import { PACKAGE_JSON, TSCONFIG_JSON } from '../constants/package.const';
import { TsconfigJSON } from '../../typings/tsconfig';
import { mapTo, switchMap } from 'rxjs/operators';

export const readTsconfigJson = (dir: string): Promise<TsconfigJSON> => fs.readJSON(path.resolve(dir, TSCONFIG_JSON));

export const readPackageJson = <T = CLI.Package.BasePackageJSON>(dir: string): Promise<T> =>
  fs.readJSON(path.resolve(dir, PACKAGE_JSON));

export const readTsconfigJson$ = (dir: string): Observable<TsconfigJSON> =>
  defer(() => from(fs.readJSON(path.resolve(dir, TSCONFIG_JSON))));

export const readPackageJson$ = <T = CLI.Package.BasePackageJSON>(dir: string): Observable<T> =>
  defer(() => from(fs.readJSON(path.resolve(dir, PACKAGE_JSON))));

export const cleanDistFolder = async (): Promise<void> => {
  const distPath = path.resolve(process.cwd(), 'dist');
  await fs.remove(distPath);
};

export const cleanDistFolder$ = (): Observable<void> =>
  defer(() =>
    of(path.resolve(process.cwd(), 'dist')).pipe(
      switchMap(distPath => from(fs.remove(distPath))),
      mapTo(undefined)
    )
  );
