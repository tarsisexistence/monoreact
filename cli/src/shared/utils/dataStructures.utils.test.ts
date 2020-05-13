import { convertStringArrayIntoMap } from './dataStructures.utils';

describe('[utils.dataStructures]', () => {
  describe('convertStringArrayIntoMap', () => {
    test('should return empty map with undefined', () => {
      expect(convertStringArrayIntoMap()).toEqual(new Map());
    });

    test('should return empty map with empty char', () => {
      expect(convertStringArrayIntoMap('')).toEqual(new Map());
    });

    test('should return empty map with empty string', () => {
      expect(convertStringArrayIntoMap('    ')).toEqual(new Map());
    });

    test('should return map when with one value which equals true', () => {
      const map = new Map();
      map.set('first', true);
      expect(convertStringArrayIntoMap('first')).toEqual(map);
    });

    test('should return map with empty chars on the sides', () => {
      expect(convertStringArrayIntoMap('  first   ')).toEqual(
        new Map([['first', true]])
      );
    });

    test('should return map with empty chars', () => {
      expect(convertStringArrayIntoMap('  first,  second   ')).toEqual(
        new Map([
          ['first', true],
          ['second', true]
        ])
      );
    });

    test('should return map with three array strings inside one string', () => {
      expect(convertStringArrayIntoMap('first,second,third')).toEqual(
        new Map([
          ['first', true],
          ['second', true],
          ['third', true]
        ])
      );
    });
  });
});
