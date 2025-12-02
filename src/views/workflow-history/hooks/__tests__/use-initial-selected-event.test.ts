import { renderHook } from '@/test-utils/rtl';

import {
  mockActivityEventGroup,
  mockDecisionEventGroup,
  mockTimerEventGroup,
  mockSingleEventGroup,
} from '../../__fixtures__/workflow-history-event-groups';
import { type HistoryEventsGroup } from '../../workflow-history.types';
import useInitialSelectedEvent from '../use-initial-selected-event';

describe('useInitialSelectedEvent', () => {
  // Create a more realistic set of event groups with multiple types
  const mockEventGroups: Record<string, HistoryEventsGroup> = {
    '1': mockSingleEventGroup,
    '2': mockDecisionEventGroup,
    '5': mockActivityEventGroup,
    '10': mockTimerEventGroup,
    '11': mockDecisionEventGroup,
    '12': mockActivityEventGroup,
  };

  it('should return shouldSearchForInitialEvent as true when selectedEventId is defined', () => {
    // Filtered entries contain only a subset of all event groups
    const filteredEventGroupsEntries: [string, HistoryEventsGroup][] = [
      ['2', mockEventGroups['2']],
      ['5', mockEventGroups['5']],
    ];

    const { result } = renderHook(() =>
      useInitialSelectedEvent({
        selectedEventId: '2',
        eventGroups: mockEventGroups,
        filteredEventGroupsEntries,
      })
    );

    expect(result.current.shouldSearchForInitialEvent).toBe(true);
  });

  it('should return shouldSearchForInitialEvent as false when selectedEventId is undefined', () => {
    const filteredEventGroupsEntries: [string, HistoryEventsGroup][] = [
      ['1', mockEventGroups['1']],
      ['2', mockEventGroups['2']],
      ['5', mockEventGroups['5']],
    ];

    const { result } = renderHook(() =>
      useInitialSelectedEvent({
        selectedEventId: undefined,
        eventGroups: mockEventGroups,
        filteredEventGroupsEntries,
      })
    );

    expect(result.current.shouldSearchForInitialEvent).toBe(false);
  });

  it('should return initialEventGroupIndex when event is found in a group and group key matches event ID', () => {
    // Filtered entries contain only a subset - event '2' is at index 1
    const filteredEventGroupsEntries: [string, HistoryEventsGroup][] = [
      ['1', mockEventGroups['1']],
      ['2', mockEventGroups['2']],
      ['5', mockEventGroups['5']],
    ];

    const { result } = renderHook(() =>
      useInitialSelectedEvent({
        selectedEventId: '2',
        eventGroups: mockEventGroups,
        filteredEventGroupsEntries,
      })
    );

    expect(result.current.initialEventGroupIndex).toBe(1);
    expect(result.current.initialEventFound).toBe(true);
  });

  it('should return initialEventGroupIndex as undefined when selectedEventId is defined & event is not found in filtered entries', () => {
    // Group '2' exists in mockEventGroups but is filtered out from the visible list
    const filteredEventGroupsEntries: [string, HistoryEventsGroup][] = [
      ['1', mockEventGroups['1']],
      ['10', mockEventGroups['10']],
    ];

    const { result } = renderHook(() =>
      useInitialSelectedEvent({
        selectedEventId: '2',
        eventGroups: mockEventGroups,
        filteredEventGroupsEntries,
      })
    );

    expect(result.current.initialEventGroupIndex).toBe(undefined);
  });

  it('should find event when group key does not match event ID but group contains the event', () => {
    // Group key is '5' but contains event with ID '7' (activity events)
    // The hook should find the event in the group regardless of the group key not matching
    // Event '7' is in group '5' which is at index 1 in filtered entries
    const filteredEventGroupsEntries: [string, HistoryEventsGroup][] = [
      ['2', mockEventGroups['2']],
      ['5', mockEventGroups['5']],
    ];

    const { result } = renderHook(() =>
      useInitialSelectedEvent({
        selectedEventId: '7',
        eventGroups: mockEventGroups,
        filteredEventGroupsEntries,
      })
    );

    expect(result.current.initialEventFound).toBe(true);
    expect(result.current.initialEventGroupIndex).toBe(1);
  });

  it('should return initialEventFound as false when selectedEventId is defined & event is not found in groups', () => {
    // Event ID '500' doesn't exist in any group
    const filteredEventGroupsEntries: [string, HistoryEventsGroup][] = [
      ['1', mockEventGroups['1']],
      ['2', mockEventGroups['2']],
      ['5', mockEventGroups['5']],
      ['10', mockEventGroups['10']],
    ];

    const { result } = renderHook(() =>
      useInitialSelectedEvent({
        selectedEventId: '500',
        eventGroups: mockEventGroups,
        filteredEventGroupsEntries,
      })
    );

    expect(result.current.initialEventFound).toBe(false);
  });

  it('should return initialEventFound as false when eventGroups is empty', () => {
    // Edge case: no event groups available at all
    const { result } = renderHook(() =>
      useInitialSelectedEvent({
        selectedEventId: '2',
        eventGroups: {},
        filteredEventGroupsEntries: [],
      })
    );

    expect(result.current.initialEventFound).toBe(false);
    expect(result.current.initialEventGroupIndex).toBe(undefined);
  });

  it('should find event at correct index when multiple groups are filtered', () => {
    // Realistic scenario: many groups but only some are visible after filtering
    // Event '7' is in group '5' which should be at index 2 in the filtered list
    const filteredEventGroupsEntries: [string, HistoryEventsGroup][] = [
      ['1', mockEventGroups['1']],
      ['2', mockEventGroups['2']],
      ['5', mockEventGroups['5']],
    ];

    const { result } = renderHook(() =>
      useInitialSelectedEvent({
        selectedEventId: '7',
        eventGroups: mockEventGroups,
        filteredEventGroupsEntries,
      })
    );

    expect(result.current.initialEventFound).toBe(true);
    expect(result.current.initialEventGroupIndex).toBe(2);
  });

  it('should handle event at the end of filtered list', () => {
    // Event '16' is in group '10' which is at the last position in the filtered list
    const filteredEventGroupsEntries: [string, HistoryEventsGroup][] = [
      ['1', mockEventGroups['1']],
      ['2', mockEventGroups['2']],
      ['5', mockEventGroups['5']],
      ['10', mockEventGroups['10']],
    ];

    const { result } = renderHook(() =>
      useInitialSelectedEvent({
        selectedEventId: '16',
        eventGroups: mockEventGroups,
        filteredEventGroupsEntries,
      })
    );

    expect(result.current.initialEventFound).toBe(true);
    expect(result.current.initialEventGroupIndex).toBe(3);
  });

  // add test cases for filteredEventGroupsEntries being empty after filtering
  it.only('should return initialEventGroupIndex as undefined when filteredEventGroupsEntries no longer contains the event', () => {
    const initialFilteredEventGroupsEntries: [string, HistoryEventsGroup][] = [
      ['2', mockEventGroups['2']],
    ];

    // initial render with filteredEventGroupsEntries containing the event
    const { result, rerender } = renderHook(
      ({
        filteredEventGroupsEntries = initialFilteredEventGroupsEntries,
      }: {
        filteredEventGroupsEntries?: [string, HistoryEventsGroup][];
      } = {}) =>
        useInitialSelectedEvent({
          selectedEventId: '2',
          eventGroups: mockEventGroups,
          filteredEventGroupsEntries: filteredEventGroupsEntries,
        })
    );
    expect(result.current.initialEventFound).toBe(true);
    expect(result.current.initialEventGroupIndex).toBe(0);

    //rerender with empty filteredEventGroupsEntries no longer containing the event
    rerender({
      filteredEventGroupsEntries: [],
    });
    expect(result.current.initialEventGroupIndex).toBe(undefined);
    expect(result.current.initialEventFound).toBe(true);
  });
});
