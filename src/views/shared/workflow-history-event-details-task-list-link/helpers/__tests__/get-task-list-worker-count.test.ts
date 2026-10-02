import getTaskListWorkerCount from '../get-task-list-worker-count';

const workers = [
  {
    hasActivityHandler: true,
    hasDecisionHandler: false,
    identity: 'a',
    ratePerSecond: 1,
  },
  {
    hasActivityHandler: false,
    hasDecisionHandler: true,
    identity: 'd',
    ratePerSecond: 1,
  },
  {
    hasActivityHandler: true,
    hasDecisionHandler: true,
    identity: 'both',
    ratePerSecond: 1,
  },
];

describe(getTaskListWorkerCount.name, () => {
  it('counts all workers by default', () => {
    expect(getTaskListWorkerCount(workers, 'workers')).toBe(3);
  });

  it('counts decision and activity handlers separately', () => {
    expect(getTaskListWorkerCount(workers, 'decision')).toBe(2);
    expect(getTaskListWorkerCount(workers, 'activity')).toBe(2);
  });
});
