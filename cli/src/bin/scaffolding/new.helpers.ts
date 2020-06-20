import path from 'path';
import { getSafeName } from './scaffolding.helpers';
import { newMessage } from '../../shared/messages';

export const getProjectName = async ({
  dir,
  name,
  onFailure
}: {
  dir: string | undefined;
  name: string;
  onFailure: (message: string) => void;
}): Promise<string> =>
  dir !== undefined
    ? name
    : await getSafeName({
        basePath: process.cwd(),
        name,
        onPromptInitial: newMessage.initial,
        onPromptMessage: (unsafeName: string) => {
          const message = newMessage.existsPrompt(
            path.resolve(process.cwd(), unsafeName)
          );
          onFailure(message);
          return message;
        }
      });

export const getProjectDir = ({
  dir,
  name
}: {
  dir: string | undefined;
  name: string;
}): string => (dir !== undefined ? path.resolve(dir) : path.resolve(name));
