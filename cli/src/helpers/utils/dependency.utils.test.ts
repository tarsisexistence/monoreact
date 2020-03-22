import { defineDependencyFlag } from './dependency.utils';

describe('[CLI.Utils] Dependency', () => {
  describe('defineDependencyFlag', () => {
    test('should return default empty string without args', () => {
      expect(defineDependencyFlag()).toBe('');
    });

    test('should return default empty string with empty string args', () => {
      expect(defineDependencyFlag('', '')).toBe('');
    });

    test('should return default empty string with undefined args', () => {
      expect(defineDependencyFlag(undefined, undefined)).toBe('');
    });

    test('should return --dev with dev=true arg and without D', () => {
      expect(defineDependencyFlag(true)).toBe('--dev');
    });

    test('should return --dev with dev=`string` arg and without D', () => {
      expect(defineDependencyFlag('someString')).toBe('--dev');
    });

    test('should return -D with D=true arg and with negative dev', () => {
      expect(defineDependencyFlag(undefined, true)).toBe('-D');
    });

    test('should return -D with dev=true and D=true args', () => {
      expect(defineDependencyFlag(true, true)).toBe('--dev');
    });

    test('should return -D with dev=`string` and D=`string` args', () => {
      expect(defineDependencyFlag('someString', 'someString')).toBe('--dev');
    });
  });
});
