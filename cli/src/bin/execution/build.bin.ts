import { Sade } from 'sade';

import { findPackageDirectory } from '../../shared/utils';
import { buildPackage } from './build.helpers';
import { bindCallback, from, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

export const buildBinCommand = (prog: Sade): void => {
  of(prog)
    .pipe(
      tap(prog => prog.command('build')),
      tap(prog => prog.describe('Build a package')),
      tap(prog => prog.alias('b')),
      tap(prog => prog.example('build')),
      switchMap(prog => bindCallback(prog.action.bind(prog))()),
      switchMap(() => from(findPackageDirectory())),
      switchMap(dir => buildPackage(dir))
    )
    .subscribe();
};
