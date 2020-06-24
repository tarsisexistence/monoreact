import path from 'path';
import fs from 'fs-extra';
import { Select } from 'enquirer';

import { preventFolderCollisions } from './scaffolding.helpers';
import { newMessage } from '../../shared/messages';
import { error, underline } from '../../shared/utils';

type decision = 'Yes' | 'No';

export const chooseDifferentPathConfirmation = (
  dir: string
): Promise<decision> => {
  const decisions: decision[] = ['Yes', 'No'];
  const decisionMap: Record<decision, string> = {
    Yes: newMessage.changeFolder(),
    No: newMessage.leaveCurrentFolder()
  };
  const select = new Select({
    message: error(`Would you like to choose a different path? 
  The specified path ${underline(`${dir}`)} is already taken.
`),
    choices: decisions.map((option: decision) => ({
      name: option,
      message: decisionMap[option]
    }))
  });
  return select.run();
};

export const resolveOptions = async ({
  name,
  dir
}: {
  name: string;
  dir: string;
}): Promise<{ projectName: string; projectDir: string }> => {
  const shouldChooseDifferentPath =
    fs.existsSync(dir) &&
    (await chooseDifferentPathConfirmation(dir)) === 'Yes';

  if (!shouldChooseDifferentPath) {
    // TODO: should we notify the user about which files have the conflict? fs.existsSync(dir) + fs.readdirSync(dir)
    return { projectDir: dir, projectName: name };
  }

  const projectName = await getProjectName(name);
  const projectDir = path.resolve(projectName);
  return { projectName, projectDir };
};

export const getProjectName = async (name: string): Promise<string> =>
  preventFolderCollisions({
    basePath: process.cwd(),
    name,
    onPromptInitial: newMessage.initial,
    onPromptMessage: (unsafeName: string) =>
      newMessage.existsPrompt(path.resolve(unsafeName))
  });

// TODO: path.resolve(process.cwd())
