import getTaskListWorkersBadgeLabel from '../get-task-list-workers-badge-label';

describe(getTaskListWorkersBadgeLabel.name, () => {
  it('returns Sticky for sticky variant', () => {
    expect(getTaskListWorkersBadgeLabel({ variant: 'sticky' })).toBe('Sticky');
  });

  it('pluralizes workers, decision handlers, and activity handlers', () => {
    expect(getTaskListWorkersBadgeLabel({ variant: 'workers', count: 0 })).toBe(
      '0 workers'
    );
    expect(getTaskListWorkersBadgeLabel({ variant: 'workers', count: 1 })).toBe(
      '1 worker'
    );
    expect(
      getTaskListWorkersBadgeLabel({ variant: 'decision', count: 1 })
    ).toBe('1 decision handler');
    expect(
      getTaskListWorkersBadgeLabel({ variant: 'activity', count: 4 })
    ).toBe('4 activity handlers');
  });
});
