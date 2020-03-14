import { progress } from './shared/data';

describe('example', () => {
  test('should have same data reference', () => {
    expect(progress).toBe(progress);
  });
});
