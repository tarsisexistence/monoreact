import { concat, sum } from './publicApi';

describe('test-default wrong', () => {
  it('should concat nums', () => {
    expect(concat('1', '2')).toBe('13');
  });

  it('should sum nums', () => {
    expect(sum(1, 2)).toBe(4);
  });
});
