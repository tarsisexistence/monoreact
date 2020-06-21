import { sum } from '../publicApi';

describe('test-config sum', () => {
  it('should return sum of 1 and 2', () => {
    expect(sum(1, 2)).toBe(3);
  });

  it('should fail when is not correct', () => {
    expect(sum(1, 2)).not.toBe(5);
  });
});
