/* eslint-disable sonarjs/no-duplicate-string */
import { getNextPackageSetupPath, getPackagesFromDeclaration, includePackageIntoDeclaration } from './workspace.utils';

describe('[utils.workspace]', () => {
  describe('getPackagesFromDeclaration', () => {
    test('should return empty array when there is no workspaces property', () => {
      expect(getPackagesFromDeclaration(undefined)).toEqual([]);
    });

    test('should return empty array when there is no packages inside workspaces config', () => {
      expect(getPackagesFromDeclaration({ packages: undefined } as any)).toEqual([]);
    });

    test('should return empty array when workspaces property is empty array', () => {
      expect(getPackagesFromDeclaration([])).toEqual([]);
    });

    test('should return empty array when workspaces packages property is empty array', () => {
      expect(getPackagesFromDeclaration({ packages: [] })).toEqual([]);
    });

    test('should return packages when workspaces property has them', () => {
      expect(getPackagesFromDeclaration(['a', 'b'])).toEqual(['a', 'b']);
    });

    test('should return packages when workspaces packages property has them', () => {
      expect(getPackagesFromDeclaration({ packages: ['a', 'b'] })).toEqual(['a', 'b']);
    });
  });

  describe('getNextPackageSetupPath', () => {
    test('should return default path with input of empty packages', () => {
      expect(getNextPackageSetupPath([])).toBe('packages');
    });

    test('should return path segment of the first package in list', () => {
      expect(getNextPackageSetupPath(['/a', 'b', 'c/', '/d/'])).toBe('');
    });

    test('should return path segments of the first package in list', () => {
      expect(getNextPackageSetupPath(['/workspaces/private/a', 'long/b', 'whatever/c/', 'folder/d/'])).toBe(
        'workspaces/private'
      );
    });

    test('should return the same path regardless of slashes', () => {
      const result = 'workspaces/private';
      expect(getNextPackageSetupPath(['/workspaces/private/a'])).toBe(result);
      expect(getNextPackageSetupPath(['workspaces/private/a'])).toBe(result);
      expect(getNextPackageSetupPath(['workspaces/private/a/'])).toBe(result);
      expect(getNextPackageSetupPath(['/workspaces/private/a/'])).toBe(result);
    });

    test('should return path when there is one wildcard', () => {
      expect(getNextPackageSetupPath(['workspaces/*'])).toBe('workspaces');
    });

    test('should return path when there is only one wildcard', () => {
      expect(getNextPackageSetupPath(['a', 'workspaces/*', 'b'])).toBe('workspaces');
    });

    test('should return path of the first wildcard match', () => {
      expect(getNextPackageSetupPath(['a', 'otherPackages/*', 'c', 'workspaces/*', 'b'])).toBe('otherPackages');
    });
  });

  describe('includePackageIntoDeclaration', () => {
    test('should return the same input when it covers wildcard with empty "" path', () => {
      expect(
        includePackageIntoDeclaration({
          packages: ['*'],
          packageName: 'components',
          setupPath: ''
        })
      ).toEqual(['*']);
    });

    test('should return the same input when it covers wildcard with dot "." path', () => {
      expect(
        includePackageIntoDeclaration({
          packages: ['*'],
          packageName: 'components',
          setupPath: '.'
        })
      ).toEqual(['*']);
    });

    test('should add the package as new declaration', () => {
      expect(
        includePackageIntoDeclaration({
          packages: ['*', 'packages/*'],
          packageName: 'components',
          setupPath: 'workspaces'
        })
      ).toEqual(['*', 'packages/*', 'workspaces/components']);
    });

    test('should add the package as new declaration with "/" before setupPath', () => {
      expect(
        includePackageIntoDeclaration({
          packages: ['*', 'packages/*'],
          packageName: 'components',
          setupPath: '/workspaces'
        })
      ).toEqual(['*', 'packages/*', 'workspaces/components']);
    });

    test('should add the package as new declaration with "./" before setupPath', () => {
      expect(
        includePackageIntoDeclaration({
          packages: ['*', 'packages/*'],
          packageName: 'components',
          setupPath: './workspaces'
        })
      ).toEqual(['*', 'packages/*', 'workspaces/components']);
    });

    test('should add the package as new declaration with "/" after setupPath', () => {
      expect(
        includePackageIntoDeclaration({
          packages: ['*', 'packages/*'],
          packageName: 'components',
          setupPath: 'workspaces/'
        })
      ).toEqual(['*', 'packages/*', 'workspaces/components']);
    });

    test('should add the package as new declaration with "/" before and after setupPath', () => {
      expect(
        includePackageIntoDeclaration({
          packages: ['*', 'packages/*'],
          packageName: 'components',
          setupPath: '/workspaces/'
        })
      ).toEqual(['*', 'packages/*', 'workspaces/components']);
    });
  });
});
