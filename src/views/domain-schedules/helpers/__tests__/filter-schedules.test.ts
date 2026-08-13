import { getMockScheduleListEntry } from '@/route-handlers/list-schedules/__fixtures__/mock-schedule-list-entries';

import filterSchedules from '../filter-schedules';

const runningOrder = getMockScheduleListEntry({
  scheduleId: 'order-running',
  workflowType: { name: 'OrderWorkflow' },
  state: { paused: false, pauseInfo: null },
});

const pausedPayment = getMockScheduleListEntry({
  scheduleId: 'payment-paused',
  workflowType: { name: 'PaymentWorkflow' },
  state: { paused: true, pauseInfo: null },
});

const runningPayment = getMockScheduleListEntry({
  scheduleId: 'payment-running',
  workflowType: { name: 'PaymentWorkflow' },
  state: { paused: false, pauseInfo: null },
});

const schedules = [runningOrder, pausedPayment, runningPayment];

describe('filterSchedules', () => {
  it('returns all schedules when there are no filters', () => {
    expect(filterSchedules({ schedules })).toEqual(schedules);
  });

  it('filters by schedule id (case insensitive, partial match)', () => {
    expect(filterSchedules({ schedules, search: 'ORDER' })).toEqual([
      runningOrder,
    ]);
  });

  it('filters by workflow type name (case insensitive, partial match)', () => {
    expect(filterSchedules({ schedules, search: 'payment' })).toEqual([
      pausedPayment,
      runningPayment,
    ]);
  });

  it('ignores empty/whitespace-only search', () => {
    expect(filterSchedules({ schedules, search: '   ' })).toEqual(schedules);
  });

  it('filters by paused status', () => {
    expect(filterSchedules({ schedules, status: 'PAUSED' })).toEqual([
      pausedPayment,
    ]);
  });

  it('filters by running status', () => {
    expect(filterSchedules({ schedules, status: 'RUNNING' })).toEqual([
      runningOrder,
      runningPayment,
    ]);
  });

  it('combines search and status filters', () => {
    expect(
      filterSchedules({
        schedules,
        search: 'payment',
        status: 'RUNNING',
      })
    ).toEqual([runningPayment]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterSchedules({ schedules, search: 'no-match' })).toEqual([]);
  });

  it('handles schedules with missing workflow type or state', () => {
    const partial = getMockScheduleListEntry({
      scheduleId: 'partial-schedule',
      workflowType: null,
      state: null,
    });

    expect(
      filterSchedules({ schedules: [partial], search: 'partial' })
    ).toEqual([partial]);
    expect(
      filterSchedules({ schedules: [partial], status: 'RUNNING' })
    ).toEqual([partial]);
    expect(filterSchedules({ schedules: [partial], status: 'PAUSED' })).toEqual(
      []
    );
  });
});
