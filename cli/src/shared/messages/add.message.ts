import { color } from '../utils';

export const addMessage = {
  exists: () =>
    color.error(`
    It seems like you already have this feature.
        `),

  invalidFeatureName: (featureName: string) => {
    const highlightedFeatureName = color.inverse(` ${featureName} `);
    return color.error(`
  Invalid feature name
  Unfortunately, re-space doesn't provide ${highlightedFeatureName} feature
        `);
  },

  adding: (featureName: string) => `Adding ${color.info(featureName)} feature...`,

  successful: (featureName: string) => `Added ${color.success(featureName)} feature template`,

  failed: (featureName: string) => `Failed to add ${color.error(featureName)} feature template`
} as const;
