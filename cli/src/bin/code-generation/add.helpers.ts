import { Select } from 'enquirer';

import { info } from '../../shared/utils';
import { featureSetup } from '../../setup/add';

export const validateFeatureOption = (
  featureName: string,
  options: string[],
  onInvalid = () => {}
): Promise<CLI.Setup.AddOptionType> => {
  if (featureName in featureSetup) {
    return Promise.resolve(featureName as keyof typeof featureSetup);
  }

  onInvalid();

  const featureNamePrompt = new Select({
    message: 'Choose a feature',
    choices: options.map(option => ({
      name: option,
      message: info(option)
    }))
  });
  return featureNamePrompt.run();
};
