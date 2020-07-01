import { PACKAGE_JSON } from '../constants/package.const';

export class NotFoundHostError extends Error {
  public isNotFoundHostError = true;

  constructor() {
    super(`
    
    Can't find workspace
    Make sure you run the script inside the project
      `);
    this.name = 'Not Found Workspace Error';
  }
}

export class NotFoundPackageError extends Error {
  public isNotFoundPackageError = true;

  constructor() {
    super(`
    
    Can't find workspace package
    Make sure you run the script inside the package
        
    The workspace ${PACKAGE_JSON} should have:
        workspace: true;
        private: false;
      `);
    this.name = 'Not Found Workspace Error';
  }
}
