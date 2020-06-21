import { concat, sum } from './publicApi';

describe('test-default type-input', () => {
  it('should concat nums', () => {
    expect(concat(1, 2)).toBe('12');
  });

  it('should sum nums', () => {
    expect(sum('1', '2')).toBe(3);
  });
});
