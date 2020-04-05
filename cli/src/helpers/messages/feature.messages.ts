import { error, info, inverse, success } from '../utils/color.utils';
import { featureTemplates } from '../../setup/feature';
import { PACKAGE_JSON } from '../constants/package.const';

export class FeatureMessages {
  // eslint-disable-next-line no-empty-function
  constructor(public featureName: string) {}

  script = () => inverse(` add ${this.featureName} `);

  wrongWorkspace = () => `
    Make sure you run the script ${this.script()} from the package workspace.
    
    The workspace ${PACKAGE_JSON} should have:
        workspace: true;
          `;

  exists = () =>
    error(`
    It seems like you already have this feature.
        `);

  invalidTemplate = () => {
    const highlightedFeatureName = inverse(` ${this.featureName} `);
    return error(`
    Invalid feature template.
    Unfortunately, cli doesn't provide ${highlightedFeatureName} feature template.
    
    Available feature templates: [${Object.keys(featureTemplates).join(', ')}]
        `);
  };

  generating = () => `Generating ${info(this.featureName)} feature...`;

  successful = () => `Added ${success(this.featureName)} feature template`;

  failed = () =>
    `Failed to generate ${error(this.featureName)} feature template`;
}
