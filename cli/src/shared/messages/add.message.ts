import { error, info, inverse, success } from '../utils';

export const addMessage = {
  exists: () =>
    error(`
    It seems like you already have this feature.
        `),

  invalidFeatureName: (featureName: string) => {
    const highlightedFeatureName = inverse(` ${featureName} `);
    return error(`
  Invalid feature name
  Unfortunately, re-space doesn't provide ${highlightedFeatureName} feature
        `);
  },

  adding: (featureName: string) => `Adding ${info(featureName)} feature...`,

  successful: (featureName: string) =>
    `Added ${success(featureName)} feature template`,

  failed: (featureName: string) =>
    `Failed to add ${error(featureName)} feature template`
} as const;
