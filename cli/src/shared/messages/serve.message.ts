import { error, info, success, underline } from '../utils';
import packageJson from '../../../package.json';

export const serveMessage = {
  introduce: () => underline(`${packageJson.name} v${packageJson.version}`),

  watching: () => `
Watching for changes...`,

  compiling: () => `
${info('Compiling modules...')}`,

  failed: () => error(`Failed compilation`),

  compiled: (isFirstChange: boolean) =>
    success(`${isFirstChange ? 'Compiled' : 'Recompiled'} successfully.`),

  bundles: ({ source, module }: { source: string; module: string }) =>
    info(`Bundles ${source} → ${module}`),

  bundled: ({
    isFirstChange,
    duration,
    module
  }: {
    isFirstChange: boolean;
    duration: number;
    module: string;
  }) => {
    const [s, ms] = (duration / 1000).toString().split('.');
    return success(
      `${isFirstChange ? 'Created' : 'Updated'} ${module} in ${s}.${ms.slice(
        0,
        3
      )}s.`
    );
  }
} as const;
