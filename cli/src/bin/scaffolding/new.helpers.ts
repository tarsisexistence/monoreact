import fs from 'fs-extra';
import path from 'path';
import { Input } from 'enquirer';

// TODO: replace with newMessage
import { generateMessage } from '../../shared/messages';

export const getSafeProjectName = async (
  projectName: string,
  onFailedPath: (name: string) => void
): Promise<string> => {
  const isExist = fs.existsSync(path.resolve(process.cwd(), projectName));

  if (!isExist) {
    return projectName;
  }

  onFailedPath(projectName);

  const projectNamePrompt = new Input({
    message: generateMessage.exists(projectName),
    initial: generateMessage.copy(projectName),
    result: (v: string) => v.trim()
  });
  const newProjectName = await projectNamePrompt.run();

  return getSafeProjectName(newProjectName, onFailedPath);
};
