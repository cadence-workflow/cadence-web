import { act, renderHook, waitFor } from '@/test-utils/rtl';

import { type HistoryEventsGroup } from '@/views/workflow-history/workflow-history.types';

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

  it('should find correct index in grouped view when event exists', () => {
    const filteredEventGroupsEntries = createMockGroupedEntries([
      { groupId: 'group-1', eventIds: ['event-1', 'event-2'] },
      { groupId: 'group-2', eventIds: ['event-3', 'event-4'] },
      { groupId: 'group-3', eventIds: ['event-5'] },
    ]);

    const { result, mockGroupedScrollToIndex } = setup({
      filteredEventGroupsEntries,
      isUngroupedHistoryViewEnabled: false,
    });

    act(() => {
      result.current.scrollToTableEvent('event-4');
    });

    // event-4 is in group-2, which is at index 1
    expect(mockGroupedScrollToIndex).toHaveBeenCalledWith({
      index: 1,
      behavior: 'auto',
      align: 'center',
    });
  });

  it('should find correct index in ungrouped view when event exists', () => {
    const ungroupedEventsInfo = createMockUngroupedEvents([
      'event-1',
      'event-2',
      'event-3',
    ]);

    const { result, mockUngroupedScrollToIndex } = setup({
      ungroupedEventsInfo,
      isUngroupedHistoryViewEnabled: true,
    });

    act(() => {
      result.current.scrollToTableEvent('event-3');
    });

    // event-3 is at index 2
    expect(mockUngroupedScrollToIndex).toHaveBeenCalledWith({
      index: 2,
      behavior: 'auto',
      align: 'center',
    });
  });

  it('should not scroll when target event is not found in grouped view', () => {
    const filteredEventGroupsEntries = createMockGroupedEntries([
      { groupId: 'group-1', eventIds: ['event-1', 'event-2'] },
    ]);

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
    const ungroupedEventsInfo = createMockUngroupedEvents(['event-1']);

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
    const filteredEventGroupsEntries = createMockGroupedEntries([
      { groupId: 'group-1', eventIds: ['event-1'] },
    ]);

    const { result, mockGroupedScrollToIndex, mockUngroupedScrollToIndex } =
      setup({
        filteredEventGroupsEntries,
        isUngroupedHistoryViewEnabled: false,
      });

    act(() => {
      result.current.scrollToTableEvent('event-1');
    });

    expect(mockGroupedScrollToIndex).toHaveBeenCalled();
    expect(mockUngroupedScrollToIndex).not.toHaveBeenCalled();
  });

  it('should use ungrouped ref when isUngroupedHistoryViewEnabled is true', () => {
    const ungroupedEventsInfo = createMockUngroupedEvents(['event-1']);

    const { result, mockGroupedScrollToIndex, mockUngroupedScrollToIndex } =
      setup({
        ungroupedEventsInfo,
        isUngroupedHistoryViewEnabled: true,
      });

    act(() => {
      result.current.scrollToTableEvent('event-1');
    });

    expect(mockUngroupedScrollToIndex).toHaveBeenCalled();
    expect(mockGroupedScrollToIndex).not.toHaveBeenCalled();
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

  const { result } = renderHook(() =>
    useWorkflowHistoryScroll({
      filteredEventGroupsEntries,
      ungroupedEventsInfo,
      isUngroupedHistoryViewEnabled,
    })
  );

  // Set up mocks for both refs
  (result.current.groupedTableVirtuosoRef as any).current = {
    scrollToIndex: mockGroupedScrollToIndex,
  };
  (result.current.ungroupedTableVirtuosoRef as any).current = {
    scrollToIndex: mockUngroupedScrollToIndex,
  };

  return { result, mockGroupedScrollToIndex, mockUngroupedScrollToIndex };
}

function createMockGroupedEntries(
  groups: Array<{ groupId: string; eventIds: string[] }>
): Array<EventGroupEntry> {
  return groups.map(({ groupId, eventIds }) => [
    groupId,
    {
      groupType: 'Activity',
      label: groupId,
      status: 'COMPLETED',
      hasMissingEvents: false,
      eventsMetadata: [],
      events: eventIds.map((eventId) => ({
        eventId,
        eventType: 'ActivityTaskScheduled',
        timestamp: new Date().toISOString(),
      })),
      timelineEvents: [],
    } as unknown as HistoryEventsGroup,
  ]);
}

function createMockUngroupedEvents(
  eventIds: string[]
): Array<UngroupedEventInfo> {
  return eventIds.map((id) => ({
    id,
    event: {
      eventId: id,
      eventType: 'ActivityTaskScheduled',
      timestamp: new Date().toISOString(),
    },
    eventMetadata: {
      label: `Event ${id}`,
    },
    eventGroup: {
      groupType: 'Activity',
      label: id,
      status: 'COMPLETED',
      hasMissingEvents: false,
      eventsMetadata: [],
      events: [],
      timelineEvents: [],
    },
    label: `Event ${id}`,
  })) as unknown as Array<UngroupedEventInfo>;
}
