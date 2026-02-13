import { act, renderHook, waitFor } from '@/test-utils/rtl';

import {
  mockActivityEventGroup,
  mockDecisionEventGroup,
  mockTimerEventGroup,
} from '@/views/workflow-history/__fixtures__/workflow-history-event-groups';
import { type HistoryEventsGroup } from '@/views/workflow-history/workflow-history.types';

import compareUngroupedEvents from '../../workflow-history-ungrouped-table/helpers/compare-ungrouped-events';
import { type UngroupedEventInfo } from '../../workflow-history-ungrouped-table/workflow-history-ungrouped-table.types';
import { type EventGroupEntry } from '../../workflow-history-v2.types';
import useWorkflowHistoryScroll from '../use-workflow-history-scroll';

describe(useWorkflowHistoryScroll.name, () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return refs and handlers', () => {
    const { result } = setup({});

    expect(result.current.groupedTableVirtuosoRef).toBeDefined();
    expect(result.current.ungroupedTableVirtuosoRef).toBeDefined();
    expect(result.current.tableScrollTargetEventId).toBeUndefined();
    expect(result.current.scrollToTableEvent).toBeInstanceOf(Function);
    expect(result.current.handleTableScrollUp).toBeInstanceOf(Function);
    expect(result.current.handleTableScrollDown).toBeInstanceOf(Function);
  });

  it('should set tableScrollTargetEventId when scrollToTableEvent is called', () => {
    const { result } = setup({});

    act(() => {
      result.current.scrollToTableEvent('event-123');
    });

    expect(result.current.tableScrollTargetEventId).toBe('event-123');
  });

  it('should clear tableScrollTargetEventId after 2 seconds', async () => {
    const { result } = setup({});

    act(() => {
      result.current.scrollToTableEvent('event-123');
    });

    expect(result.current.tableScrollTargetEventId).toBe('event-123');

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(result.current.tableScrollTargetEventId).toBeUndefined();
    });
  });

  it('should clear the previous timeout when scrollToTableEvent is called again', async () => {
    const filteredEventGroupsEntries: Array<EventGroupEntry> = [
      ['decision-1', mockDecisionEventGroup], // index 0, contains event '2'
      ['activity-1', mockActivityEventGroup], // index 1, contains event '7'
    ];

    const { result } = setup({
      filteredEventGroupsEntries,
      isUngroupedHistoryViewEnabled: false,
    });

    // 0s
    act(() => {
      result.current.scrollToTableEvent('2');
    });

    expect(result.current.tableScrollTargetEventId).toBe('2');

    // 1.5s
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(result.current.tableScrollTargetEventId).toBe('2');

    act(() => {
      result.current.scrollToTableEvent('7');
    });

    expect(result.current.tableScrollTargetEventId).toBe('7');

    // 2s
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current.tableScrollTargetEventId).toBe('7');

    // 3.5s
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    await waitFor(() => {
      expect(result.current.tableScrollTargetEventId).toBeUndefined();
    });
  });

  it('should find correct index in grouped view when event exists', () => {
    const filteredEventGroupsEntries: Array<EventGroupEntry> = [
      ['decision-1', mockDecisionEventGroup],
      ['activity-1', mockActivityEventGroup],
      ['timer-1', mockTimerEventGroup],
    ];

    const { result, mockGroupedScrollToIndex } = setup({
      filteredEventGroupsEntries,
      isUngroupedHistoryViewEnabled: false,
    });

    act(() => {
      // event '10' is in mockActivityEventGroup, which is at index 1
      result.current.scrollToTableEvent('10');
    });

    expect(mockGroupedScrollToIndex).toHaveBeenCalledWith({
      index: 1,
      behavior: 'auto',
      align: 'center',
    });
  });

  it('should find correct index in ungrouped view when event exists', () => {
    const ungroupedEventsInfo = createUngroupedEventsInfo([
      ['decision-1', mockDecisionEventGroup],
      ['activity-1', mockActivityEventGroup],
    ]);

    const { result, mockUngroupedScrollToIndex } = setup({
      ungroupedEventsInfo,
      isUngroupedHistoryViewEnabled: true,
    });

    // Find the index of event '10' in sorted ungrouped events
    const targetEventIndex = ungroupedEventsInfo.findIndex(
      (e) => e.id === '10'
    );

    act(() => {
      result.current.scrollToTableEvent('10');
    });

    expect(mockUngroupedScrollToIndex).toHaveBeenCalledWith({
      index: targetEventIndex,
      behavior: 'auto',
      align: 'center',
    });
  });

  it('should not scroll when target event is not found in grouped view', () => {
    const filteredEventGroupsEntries: Array<EventGroupEntry> = [
      ['activity-1', mockActivityEventGroup],
    ];

    const { result, mockGroupedScrollToIndex } = setup({
      filteredEventGroupsEntries,
      isUngroupedHistoryViewEnabled: false,
    });

    act(() => {
      result.current.scrollToTableEvent('non-existent-event');
    });

    // scrollToIndex should not be called because the index would be -1
    expect(mockGroupedScrollToIndex).not.toHaveBeenCalled();
  });

  it('should not scroll when target event is not found in ungrouped view', () => {
    const ungroupedEventsInfo = createUngroupedEventsInfo([
      ['activity-1', mockActivityEventGroup],
    ]);

    const { result, mockUngroupedScrollToIndex } = setup({
      ungroupedEventsInfo,
      isUngroupedHistoryViewEnabled: true,
    });

    act(() => {
      result.current.scrollToTableEvent('non-existent-event');
    });

    expect(mockUngroupedScrollToIndex).not.toHaveBeenCalled();
  });

  it('should call scrollToIndex with index 0 and align end when handleTableScrollUp is called for grouped view', () => {
    const { result, mockGroupedScrollToIndex } = setup({
      isUngroupedHistoryViewEnabled: false,
    });

    act(() => {
      result.current.handleTableScrollUp();
    });

    expect(mockGroupedScrollToIndex).toHaveBeenCalledWith({
      index: 0,
      align: 'end',
    });
  });

  it('should call scrollToIndex with index 0 and align end when handleTableScrollUp is called for ungrouped view', () => {
    const { result, mockUngroupedScrollToIndex } = setup({
      isUngroupedHistoryViewEnabled: true,
    });

    act(() => {
      result.current.handleTableScrollUp();
    });

    expect(mockUngroupedScrollToIndex).toHaveBeenCalledWith({
      index: 0,
      align: 'end',
    });
  });

  it('should call scrollToIndex with LAST and align start when handleTableScrollDown is called for grouped view', () => {
    const { result, mockGroupedScrollToIndex } = setup({
      isUngroupedHistoryViewEnabled: false,
    });

    act(() => {
      result.current.handleTableScrollDown();
    });

    expect(mockGroupedScrollToIndex).toHaveBeenCalledWith({
      index: 'LAST',
      align: 'start',
    });
  });

  it('should call scrollToIndex with LAST and align start when handleTableScrollDown is called for ungrouped view', () => {
    const { result, mockUngroupedScrollToIndex } = setup({
      isUngroupedHistoryViewEnabled: true,
    });

    act(() => {
      result.current.handleTableScrollDown();
    });

    expect(mockUngroupedScrollToIndex).toHaveBeenCalledWith({
      index: 'LAST',
      align: 'start',
    });
  });

  it('should use grouped ref when isUngroupedHistoryViewEnabled is false', () => {
    const filteredEventGroupsEntries: Array<EventGroupEntry> = [
      ['activity-1', mockActivityEventGroup],
    ];

    const { result, mockGroupedScrollToIndex, mockUngroupedScrollToIndex } =
      setup({
        filteredEventGroupsEntries,
        isUngroupedHistoryViewEnabled: false,
      });

    act(() => {
      // event '7' is in mockActivityEventGroup
      result.current.scrollToTableEvent('7');
    });

    expect(mockGroupedScrollToIndex).toHaveBeenCalled();
    expect(mockUngroupedScrollToIndex).not.toHaveBeenCalled();
  });

  it('should use ungrouped ref when isUngroupedHistoryViewEnabled is true', () => {
    const ungroupedEventsInfo = createUngroupedEventsInfo([
      ['activity-1', mockActivityEventGroup],
    ]);

    const { result, mockGroupedScrollToIndex, mockUngroupedScrollToIndex } =
      setup({
        ungroupedEventsInfo,
        isUngroupedHistoryViewEnabled: true,
      });

    act(() => {
      // event '7' is in mockActivityEventGroup
      result.current.scrollToTableEvent('7');
    });

    expect(mockUngroupedScrollToIndex).toHaveBeenCalled();
    expect(mockGroupedScrollToIndex).not.toHaveBeenCalled();
  });

  it('should set timelineScrollTargetEventGroupId when scrollToTimelineEventGroup is called', () => {
    const { result } = setup({});

    act(() => {
      result.current.scrollToTimelineEventGroup('group-123');
    });

    expect(result.current.timelineScrollTargetEventGroupId).toBe('group-123');
  });

  it('should clear timelineScrollTargetEventGroupId after 2 seconds', async () => {
    const { result } = setup({});

    act(() => {
      result.current.scrollToTimelineEventGroup('group-123');
    });

    expect(result.current.timelineScrollTargetEventGroupId).toBe('group-123');

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(result.current.timelineScrollTargetEventGroupId).toBeUndefined();
    });
  });

  it('should scroll timeline to correct index when event group exists', () => {
    const filteredEventGroupsEntries: Array<EventGroupEntry> = [
      ['decision-1', mockDecisionEventGroup],
      ['activity-1', mockActivityEventGroup],
      ['timer-1', mockTimerEventGroup],
    ];

    const { result, mockTimelineScrollToIndex } = setup({
      filteredEventGroupsEntries,
    });

    act(() => {
      result.current.scrollToTimelineEventGroup('activity-1');
    });

    expect(mockTimelineScrollToIndex).toHaveBeenCalledWith({
      index: 1,
      behavior: 'auto',
      align: 'start',
    });
  });

  it('should not scroll timeline when event group is not found', () => {
    const filteredEventGroupsEntries: Array<EventGroupEntry> = [
      ['activity-1', mockActivityEventGroup],
    ];

    const { result, mockTimelineScrollToIndex } = setup({
      filteredEventGroupsEntries,
    });

    act(() => {
      result.current.scrollToTimelineEventGroup('non-existent-group');
    });

    expect(mockTimelineScrollToIndex).not.toHaveBeenCalled();
  });
});

function setup({
  filteredEventGroupsEntries = [],
  ungroupedEventsInfo = [],
  isUngroupedHistoryViewEnabled = false,
}: {
  filteredEventGroupsEntries?: Array<EventGroupEntry>;
  ungroupedEventsInfo?: Array<UngroupedEventInfo>;
  isUngroupedHistoryViewEnabled?: boolean;
}) {
  const mockGroupedScrollToIndex = jest.fn();
  const mockUngroupedScrollToIndex = jest.fn();
  const mockTimelineScrollToIndex = jest.fn();

  const { result } = renderHook(() =>
    useWorkflowHistoryScroll({
      filteredEventGroupsEntries,
      ungroupedEventsInfo,
      isUngroupedHistoryViewEnabled,
    })
  );

  (result.current.groupedTableVirtuosoRef as any).current = {
    scrollToIndex: mockGroupedScrollToIndex,
  };
  (result.current.ungroupedTableVirtuosoRef as any).current = {
    scrollToIndex: mockUngroupedScrollToIndex,
  };
  (result.current.timelineVirtuosoRef as any).current = {
    scrollToIndex: mockTimelineScrollToIndex,
  };

  return {
    result,
    mockGroupedScrollToIndex,
    mockUngroupedScrollToIndex,
    mockTimelineScrollToIndex,
  };
}

function createUngroupedEventsInfo(
  eventGroupsById: Array<[string, HistoryEventsGroup]>
): Array<UngroupedEventInfo> {
  return eventGroupsById
    .map(([_, group]) => [
      ...group.events.map((event, index) => ({
        id: event.eventId ?? event.computedEventId,
        event,
        eventMetadata: group.eventsMetadata[index],
        eventGroup: group,
        label: group.label,
        shortLabel: group.shortLabel,
        canReset: group.resetToDecisionEventId === event.eventId,
      })),
    ])
    .flat(1)
    .sort(compareUngroupedEvents);
}
