import { error, info, inverse, success } from './colors';
import { featureTemplates } from '../../templates/feature';
import { PACKAGE_JSON } from '../constants';

export class FeatureMessages {
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

  success = () => `Added ${success(this.featureName)} feature template`;

  failed = () =>
    `Failed to generate ${error(this.featureName)} feature template`;
}
