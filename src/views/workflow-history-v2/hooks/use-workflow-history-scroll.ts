import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { type VirtuosoHandle } from 'react-virtuoso';

import { type UngroupedEventInfo } from '../workflow-history-ungrouped-table/workflow-history-ungrouped-table.types';
import { type EventGroupEntry } from '../workflow-history-v2.types';

/**
 * Hook that manages scroll behavior for the workflow history view.
 *
 * Provides refs and scroll handlers for three virtualized lists:
 * - Grouped events table
 * - Ungrouped events table
 * - Header timeline
 *
 * Features:
 * - `scrollToTableEvent(eventId)` - Scrolls the active table to a specific event
 * - `scrollToTimelineEventGroup(groupId)` - Scrolls the timeline to a specific event group
 * - `handleTableScrollUp/Down` - Scrolls the active table to top/bottom
 * - Automatically clears scroll targets after 2 seconds to allow re-scrolling to the same target
 *
 * @returns Virtuoso refs for each list, current scroll targets, and scroll handler functions
 */
export default function useWorkflowHistoryScroll({
  filteredEventGroupsEntries,
  ungroupedEventsInfo,
  isUngroupedHistoryViewEnabled,
}: {
  filteredEventGroupsEntries: Array<EventGroupEntry>;
  ungroupedEventsInfo: Array<UngroupedEventInfo>;
  isUngroupedHistoryViewEnabled: boolean;
}) {
  const groupedTableVirtuosoRef = useRef<VirtuosoHandle>(null);
  const ungroupedTableVirtuosoRef = useRef<VirtuosoHandle>(null);
  const activeTableRef = useMemo(
    () =>
      isUngroupedHistoryViewEnabled
        ? ungroupedTableVirtuosoRef
        : groupedTableVirtuosoRef,
    [isUngroupedHistoryViewEnabled]
  );
  const timelineVirtuosoRef = useRef<VirtuosoHandle>(null);

  // Table scroll handler implementation
  const [tableScrollTargetEventId, setTableScrollTargetEventId] = useState<
    string | undefined
  >(undefined);

  const tableScrollTargetEventIndex = useMemo(() => {
    if (!tableScrollTargetEventId) return undefined;

    return isUngroupedHistoryViewEnabled
      ? ungroupedEventsInfo.findIndex((e) => e.id === tableScrollTargetEventId)
      : filteredEventGroupsEntries.findIndex(([_, group]) =>
          group.events.some((e) => e.eventId === tableScrollTargetEventId)
        );
  }, [
    tableScrollTargetEventId,
    isUngroupedHistoryViewEnabled,
    ungroupedEventsInfo,
    filteredEventGroupsEntries,
  ]);

  useEffect(() => {
    if (!activeTableRef.current) return;

    if (
      tableScrollTargetEventIndex !== undefined &&
      tableScrollTargetEventIndex !== -1
    ) {
      activeTableRef.current.scrollToIndex({
        index: tableScrollTargetEventIndex,
        behavior: 'auto',
        align: 'center',
      });
    }

    const timeoutId = setTimeout(
      () => setTableScrollTargetEventId(undefined),
      2000
    );

    return () => clearTimeout(timeoutId);
  }, [tableScrollTargetEventIndex, activeTableRef]);

  const scrollToTableEvent = useCallback((eventId: string) => {
    setTableScrollTargetEventId(eventId);
  }, []);

  // Timeline scroll handler implementation
  const [
    timelineScrollTargetEventGroupId,
    setTimelineScrollTargetEventGroupId,
  ] = useState<string | undefined>(undefined);

  const timelineScrollTargetEventGroupIndex = useMemo(() => {
    if (!timelineScrollTargetEventGroupId) return undefined;

    return filteredEventGroupsEntries.findIndex(
      ([groupId]) => groupId === timelineScrollTargetEventGroupId
    );
  }, [timelineScrollTargetEventGroupId, filteredEventGroupsEntries]);

  useEffect(() => {
    if (!timelineVirtuosoRef.current) return;

    if (
      timelineScrollTargetEventGroupIndex !== undefined &&
      timelineScrollTargetEventGroupIndex !== -1
    ) {
      timelineVirtuosoRef.current.scrollToIndex({
        index: timelineScrollTargetEventGroupIndex,
        behavior: 'auto',
        align: 'start',
      });
    }

    const timeoutId = setTimeout(
      () => setTimelineScrollTargetEventGroupId(undefined),
      2000
    );

    return () => clearTimeout(timeoutId);
  }, [timelineScrollTargetEventGroupIndex]);

  const scrollToTimelineEventGroup = useCallback((eventGroupId: string) => {
    setTimelineScrollTargetEventGroupId(eventGroupId);
  }, []);

  // Directional scrollers
  const handleTableScrollUp = useCallback(() => {
    if (!activeTableRef.current) return;

    activeTableRef.current.scrollToIndex({
      index: 0,
      // Position the start item as low as possible
      align: 'end',
    });
  }, [activeTableRef]);

  const handleTableScrollDown = useCallback(() => {
    if (!activeTableRef.current) return;

    activeTableRef.current.scrollToIndex({
      index: 'LAST',
      // Position the end item as high as possible
      align: 'start',
    });
  }, [activeTableRef]);

  return {
    groupedTableVirtuosoRef,
    ungroupedTableVirtuosoRef,
    timelineVirtuosoRef,
    tableScrollTargetEventId,
    timelineScrollTargetEventGroupId,
    scrollToTableEvent,
    scrollToTimelineEventGroup,
    handleTableScrollUp,
    handleTableScrollDown,
  };
}
