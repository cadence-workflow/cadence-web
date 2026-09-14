import formatBatchActionProgressPercent from '../format-batch-action-progress-percent';

describe('formatBatchActionProgressPercent', () => {
  it.each([
    [0, 200, '0%'],
    [1, 200, '0.5%'],
    [125, 200, '62.5%'],
    [199, 200, '99.5%'],
    [200, 200, '100%'],
  ])('formats %s of %s as %s', (completed, total, expected) => {
    expect(formatBatchActionProgressPercent(completed, total)).toBe(expected);
  });

  it('shows a threshold when non-zero progress rounds to zero', () => {
    expect(formatBatchActionProgressPercent(1, 12472988)).toBe('<0.01%');
  });

  it('caps progress at 100%', () => {
    expect(formatBatchActionProgressPercent(201, 200)).toBe('100%');
  });
});
