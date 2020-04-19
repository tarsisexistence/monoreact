import { PACKAGE_JSON } from '../helpers/constants/package.const';

export class WrongWorkspaceError extends Error {
  public isWrongWorkspace = true;

  constructor(message: string) {
    super(message);
    this.name = 'Wrong Workspace';
  }
}

export class NoPackageJsonError extends Error {
  public hasNoPackageJson = true;

  constructor(script: string) {
    super(`
    Can't find ${PACKAGE_JSON}.
    Make sure you run the script ${script} from the workspace root.
      `);
  }
}

export class NotFoundWorkspaceError extends Error {
  public isNotFoundWorkspaceError = true;

  constructor() {
    super(`
    
    Can't find a project
    Make sure you run the script inside the project
    
    The project ${PACKAGE_JSON} should have:
        workspace: true;
        private: false;
      `);
    this.name = 'Not Found Workspace Error';
  }
}
