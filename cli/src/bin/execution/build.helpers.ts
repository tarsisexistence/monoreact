import { rollup } from 'rollup';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap, tap } from 'rxjs/operators';

import { createBuildConfig } from './configs/build.config';
import { cleanDistFolder$, logError, readPackageJson$, readTsconfigJson$ } from '../../shared/utils';
import { buildMessage } from '../../shared/messages';

const withDuration$ = <T>(input: Observable<T>): Observable<void> =>
  of(process.hrtime()).pipe(
    switchMap(time => input.pipe(mapTo(time))),
    map(process.hrtime),
    tap(duration => console.log(buildMessage.successful(duration))),
    mapTo(undefined)
  );

const getBuildConfig = (dir: string): Observable<ReturnType<typeof createBuildConfig>> =>
  of(dir).pipe(
    switchMap(dir =>
      forkJoin([readPackageJson$<CLI.Package.PackagePackageJSON>(dir), readTsconfigJson$(dir), cleanDistFolder$()])
    ),
    map(([packageJson, tsconfigJson]) =>
      createBuildConfig({
        tsconfigJson,
        packageJson,
        displayFilesize: true,
        runEslint: false,
        useClosure: false
      })
    )
  );

export const buildPackage = (dir: string) => {
  const build$ = getBuildConfig(dir).pipe(
    tap(config =>
      console.log(buildMessage.bundling({ source: config.input as string, module: config.output.file as string }))
    ),
    switchMap(config => from(rollup(config)).pipe(switchMap(bundle => from(bundle.write(config.output))))),
    catchError(error => {
      logError(error);
      process.exit(1);
    })
  );

  return withDuration$(build$);
};
