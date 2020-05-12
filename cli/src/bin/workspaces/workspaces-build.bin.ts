import { Sade } from 'sade';
import execa from 'execa';
import { cpus } from 'os';
import pLimit from 'p-limit';

import {
  findWorkspaceRootDir,
  getWorkspacesInfo,
  makeDependencyChunks,
  readWorkspacePackages,
  error
} from '../../shared/utils';

export function workspacesBuildBinCommand(prog: Sade): void {
  prog
    .command('workspaces build')
    .describe('Build each workspace')
    .example('workspaces build')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('wb')
    .option('o, only', 'Build only specific workspaces')
    .option('e, exclude', 'Exclude specific workspaces')
    .option('s, self', 'Apply build for the host workspace')

    .example('workspaces build --self')
    .action(async ({ self }: CLI.Options.Workspaces) => {
      const stdio = [process.stdin, process.stdout, process.stderr];
      const jobs = Math.max(1, cpus().length / 2);
      const limit = pLimit(jobs);

      const packagesInfo = await getWorkspacesInfo();
      const packagesLocationMap = Object.fromEntries(
        packagesInfo.map(({ name, location }) => [name, location])
      );
      const packageJsons = await readWorkspacePackages(packagesInfo);
      const { chunks, unprocessed } = makeDependencyChunks(packageJsons);

      for (const chunk of chunks) {
        await Promise.all(
          chunk.map(async name =>
            limit(async () => {
              console.log(`Entering ${name}`);
              await execa('yarn', ['build'], {
                cwd: packagesLocationMap[name]
              });
              console.log(`Finished ${name}`);
            })
          )
        );
      }

      if (unprocessed.length > 0) {
        console.log(
          error(`Potentially circular dependency
      Please check the following packages attentively:
      ${unprocessed.map(
        ([name, dependencies]) =>
          `   ${name}  =>  ${dependencies?.join(', ') ?? ''}`
      ).join(`
      `)}
      `)
        );
      }

      if (self) {
        console.log(`
Entering host
`);
        const rootDir = await findWorkspaceRootDir();
        await execa('yarn', ['build'], { stdio, cwd: rootDir });
      }
    });
}
