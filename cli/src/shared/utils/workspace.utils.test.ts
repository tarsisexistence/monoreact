/* eslint-disable sonarjs/no-duplicate-string */
import {
  getWorkspacePackageSetupPath,
  getWorkspacePackageDirs
} from './workspace.utils';

describe('[utils.workspace]', () => {
  describe('getWorkspacePackageDirs', () => {
    test('should return empty array when there is no workspaces property', () => {
      expect(getWorkspacePackageDirs(undefined)).toEqual([]);
    });

    test('should return empty array when there is no packages inside workspaces config', () => {
      expect(getWorkspacePackageDirs({ packages: undefined } as any)).toEqual(
        []
      );
    });

    test('should return empty array when workspaces property is empty array', () => {
      expect(getWorkspacePackageDirs([])).toEqual([]);
    });

    test('should return empty array when workspaces packages property is empty array', () => {
      expect(getWorkspacePackageDirs({ packages: [] })).toEqual([]);
    });

    test('should return packages when workspaces property has them', () => {
      expect(getWorkspacePackageDirs(['a', 'b'])).toEqual(['a', 'b']);
    });

    test('should return packages when workspaces packages property has them', () => {
      expect(getWorkspacePackageDirs({ packages: ['a', 'b'] })).toEqual([
        'a',
        'b'
      ]);
    });
  });

  describe('getWorkspacePackageSetupPath', () => {
    test('should return default path with input of empty packages', () => {
      expect(getWorkspacePackageSetupPath([])).toBe('packages');
    });

    test('should return path segment of the first package in list', () => {
      expect(getWorkspacePackageSetupPath(['/a', 'b', 'c/', '/d/'])).toBe('');
    });

    test('should return path segments of the first package in list', () => {
      expect(
        getWorkspacePackageSetupPath([
          '/workspaces/private/a',
          'long/b',
          'whatever/c/',
          'folder/d/'
        ])
      ).toBe('workspaces/private');
    });

    test('should return the same path regardless of slashes', () => {
      const result = 'workspaces/private';
      expect(getWorkspacePackageSetupPath(['/workspaces/private/a'])).toBe(
        result
      );
      expect(getWorkspacePackageSetupPath(['workspaces/private/a'])).toBe(
        result
      );
      expect(getWorkspacePackageSetupPath(['workspaces/private/a/'])).toBe(
        result
      );
      expect(getWorkspacePackageSetupPath(['/workspaces/private/a/'])).toBe(
        result
      );
    });

    test('should return path when there is one wildcard', () => {
      expect(getWorkspacePackageSetupPath(['workspaces/*'])).toBe('workspaces');
    });

    test('should return path when there is only one wildcard', () => {
      expect(getWorkspacePackageSetupPath(['a', 'workspaces/*', 'b'])).toBe(
        'workspaces'
      );
    });

    test('should return path of the first wildcard match', () => {
      expect(
        getWorkspacePackageSetupPath([
          'a',
          'otherPackages/*',
          'c',
          'workspaces/*',
          'b'
        ])
      ).toBe('otherPackages');
    });
  });
});
