import fs from 'fs-extra';
import path from 'path';
import { Select } from 'enquirer';

import { color, noop } from '../../shared/utils';
import { featureSetup } from './setup/add';

export const validateFeatureOption = (
  featureName: string,
  options: string[],
  onInvalid = noop
): Promise<CLI.Setup.AddOptionType> => {
  if (featureName in featureSetup) {
    return Promise.resolve(featureName as keyof typeof featureSetup);
  }

  onInvalid();

  const featureNamePrompt = new Select({
    message: 'Choose a feature',
    choices: options.map(option => ({
      name: option,
      message: color.info(option)
    }))
  });
  return featureNamePrompt.run();
};

export const copyFeatureTemplate = (packageDir: string, option: CLI.Setup.AddOptionType): Promise<void> =>
  fs.copy(
    path.resolve(__dirname, `../../../../templates/add/${option}`),
    path.resolve(packageDir, featureSetup[option].path),
    { overwrite: false, errorOnExist: true }
  );

export const addFeatureScriptsToPackageJson = ({
  dir,
  packageJson,
  option
}: {
  dir: string;
  packageJson: CLI.Package.PackagePackageJSON;
  option: CLI.Setup.AddOptionType;
}): Promise<void> =>
  fs.outputJSON(
    dir,
    {
      ...packageJson,
      scripts: {
        ...packageJson.scripts,
        ...featureSetup[option].scripts
      }
    },
    { spaces: 2 }
  );
