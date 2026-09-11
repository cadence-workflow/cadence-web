import getBatchActionEtaDuration from '../get-batch-action-eta-duration';

const NOW = new Date('2026-09-09T10:00:30Z');

describe('getBatchActionEtaDuration', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(NOW);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it.each([
    ['COMPLETED' as const, 75, 125, NOW.getTime() - 30_000],
    ['RUNNING' as const, 0, 125, NOW.getTime() - 30_000],
    ['RUNNING' as const, 75, 0, NOW.getTime() - 30_000],
    ['RUNNING' as const, 75, 125, NOW.getTime() - 14_999],
  ])(
    'returns null for status %s, remaining %s, completed %s and start time %s',
    (status, remaining, completed, startTime) => {
      expect(
        getBatchActionEtaDuration({
          status,
          remaining,
          completed,
          startTime,
        })
      ).toBeNull();
    }
  );

  it('returns null without a start time', () => {
    expect(
      getBatchActionEtaDuration({
        status: 'RUNNING',
        remaining: 75,
        completed: 125,
      })
    ).toBeNull();
  });

  it('formats the ETA from the observed completion rate', () => {
    expect(
      getBatchActionEtaDuration({
        status: 'RUNNING',
        remaining: 75,
        completed: 125,
        startTime: NOW.getTime() - 30_000,
      })
    ).toBe('18s');
  });
});
