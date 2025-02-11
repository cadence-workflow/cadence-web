import { renderHook } from '@/test-utils/rtl';

import { completedDecisionTaskEvents } from '../../__fixtures__/workflow-history-decision-events';
import useInitialSelectedEvent from '../use-initial-selected-event';

jest.mock('../../helpers/get-history-event-group-id');

describe('useInitialSelectedEvent', () => {
  const events = [...completedDecisionTaskEvents];
  const filteredEventGroupsEntries: [string, any][] = [
    ['group1', completedDecisionTaskEvents],
  ];

  it('should return shouldSearchForInitialEvent as true when initialEventId is defined', () => {
    const { result } = renderHook(() =>
      useInitialSelectedEvent({
        selectedEventId: '2',
        events,
        filteredEventGroupsEntries,
      })
    );

    expect(result.current.shouldSearchForInitialEvent).toBe(true);
  });

  it('should return shouldSearchForInitialEvent as false when initialEventId is undefined', () => {
    const { result } = renderHook(() =>
      useInitialSelectedEvent({
        selectedEventId: undefined,
        events,
        filteredEventGroupsEntries,
      })
    );

    expect(result.current.shouldSearchForInitialEvent).toBe(false);
  });

  it('should return initialEventGroupIndex as undefined when initialEventId is defined & group is not found', () => {
    const { result } = renderHook(() =>
      useInitialSelectedEvent({
        selectedEventId: '500',
        events,
        filteredEventGroupsEntries: [],
      })
    );

    expect(result.current.initialEventGroupIndex).toBe(undefined);
  });

  it('should return initialEventFound as false when initialEventId is defined & event is not found', () => {
    const { result } = renderHook(() =>
      useInitialSelectedEvent({
        selectedEventId: '500',
        events,
        filteredEventGroupsEntries,
      })
    );

    expect(result.current.initialEventFound).toBe(false);
  });
});
