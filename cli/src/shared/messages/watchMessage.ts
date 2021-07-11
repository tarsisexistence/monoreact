import { color } from '../utils';
import packageJson from '../../../package.json';

export const watchMessage = {
  introduce: () => color.underline(`${packageJson.name} v${packageJson.version}`),

  watching: () => `
Watching for changes...`,

  compiling: () => `
${color.info('Compiling modules...')}`,

  failed: () => color.error(`Failed compilation`),

  compiled: (isFirstChange: boolean) => color.success(`${isFirstChange ? 'Compiled' : 'Recompiled'} successfully.`),

  bundles: ({ source, module }: { source: string; module: string }) => color.info(`Bundles ${source} → ${module}`),

  bundled: ({ isFirstChange, duration, module }: { isFirstChange: boolean; duration: number; module: string }) => {
    const [s, ms] = (duration / 1000).toString().split('.');
    return color.success(`${isFirstChange ? 'Created' : 'Updated'} ${module} in ${s}.${ms.slice(0, 3)}s.`);
  }
} as const;
