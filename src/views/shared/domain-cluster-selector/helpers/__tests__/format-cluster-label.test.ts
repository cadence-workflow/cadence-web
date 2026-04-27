import formatClusterLabel from '../format-cluster-label';

describe('formatClusterLabel', () => {
  it('adds parenthetical replication', () => {
    expect(formatClusterLabel('x', 'y')).toBe('x (y)');
  });
  it('omits parentheses when there is no replication label', () => {
    expect(formatClusterLabel('x', undefined)).toBe('x');
  });
});
