import { safePackageName } from './generate.helpers';

describe('[bins.generate]', () => {
  describe('safePackageName', () => {
    it('should return empty string when string is empty', () => {
      expect(safePackageName('')).toBe('');
    });

    it('should return the same valid name', () => {
      expect(safePackageName('lodash')).toBe('lodash');
    });

    it('should return the same name with "-" delimiter', () => {
      expect(safePackageName('lodash-es')).toBe('lodash-es');
    });

    it('should cut off namespace', () => {
      expect(safePackageName('@angular/core')).toBe('core');
    });

    it('should cut off all "/" delimiters', () => {
      expect(safePackageName('@angular/core/index')).toBe('index');
    });
  });
});
