import getTaskListWorkersBadgeLabel from '../get-task-list-workers-badge-label';

describe(getTaskListWorkersBadgeLabel.name, () => {
  it('pluralizes workers', () => {
    expect(getTaskListWorkersBadgeLabel({ variant: 'workers', count: 0 })).toBe(
      '0 workers'
    );
    expect(
      getTaskListWorkersBadgeLabel({ variant: 'workers', count: 1 })
    ).toBe('1 worker');
  });
});
