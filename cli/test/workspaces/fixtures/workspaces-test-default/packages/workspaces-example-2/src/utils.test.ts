import { concat } from './utils';

describe('workspaces-test-default concat', () => {
  it('should concat two chars a and b', () => {
    expect(concat('1', '2')).toBe('12');
  });

  it('should fail when type is not correct', () => {
    expect(concat('1', '2')).not.toBe(12);
  });
});
