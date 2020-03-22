/* eslint-disable sonarjs/no-duplicate-string */
import { findPackageSetupPath, findWorkspacePackages } from './package.utils';

describe('[CLI] Package Utils', () => {
  describe('findWorkspacePackages', () => {
    test('should return empty array when there is no workspaces property', () => {
      expect(findWorkspacePackages(undefined)).toEqual([]);
    });

    test('should return empty array when there is no packages inside workspaces config', () => {
      expect(findWorkspacePackages({ packages: undefined } as any)).toEqual([]);
    });

    test('should return empty array when workspaces property is empty array', () => {
      expect(findWorkspacePackages([])).toEqual([]);
    });

    test('should return empty array when workspaces packages property is empty array', () => {
      expect(findWorkspacePackages({ packages: [] })).toEqual([]);
    });

    test('should return packages when workspaces property has them', () => {
      expect(findWorkspacePackages(['a', 'b'])).toEqual(['a', 'b']);
    });

    test('should return packages when workspaces packages property has them', () => {
      expect(findWorkspacePackages({ packages: ['a', 'b'] })).toEqual([
        'a',
        'b'
      ]);
    });
  });

  describe('findPackageSetupPath', () => {
    test('should return empty path with empty input', () => {
      expect(findPackageSetupPath([])).toBe('/');
    });

    test('should return empty path with input of separate packages', () => {
      expect(findPackageSetupPath(['/a', 'b', 'c/', '/d/'])).toBe('/');
    });

    test('should return path when there is one wildcard', () => {
      expect(findPackageSetupPath(['packages/*'])).toBe('packages/');
    });

    test('should return path when there is only one wildcard', () => {
      expect(findPackageSetupPath(['a', 'packages/*', 'b'])).toBe('packages/');
    });

    test('should return path of the last wildcard', () => {
      expect(
        findPackageSetupPath(['a', 'otherPackages/*', 'c', 'packages/*', 'b'])
      ).toBe('packages/');
    });
  });
});
