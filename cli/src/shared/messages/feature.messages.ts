import { error, info, inverse, success } from '../utils';
import { featureSetup } from '../../setup/add';

export class FeatureMessages {
  // eslint-disable-next-line no-empty-function
  constructor(private featureName: string) {}

  exists = () =>
    error(`
    It seems like you already have this feature.
        `);

  invalidTemplate = () => {
    const highlightedFeatureName = inverse(` ${this.featureName} `);
    return error(`
    Invalid feature template.
    Unfortunately, cli doesn't provide ${highlightedFeatureName} feature template.
    
    Available feature templates: [${Object.keys(featureSetup).join(', ')}]
        `);
  };

  generating = () => `Generating ${info(this.featureName)} feature...`;

  successful = () => `Added ${success(this.featureName)} feature template`;

  failed = () =>
    `Failed to generate ${error(this.featureName)} feature template`;
}
