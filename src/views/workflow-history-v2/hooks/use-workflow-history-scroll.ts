import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { type VirtuosoHandle } from 'react-virtuoso';

import { type UngroupedEventInfo } from '../workflow-history-ungrouped-table/workflow-history-ungrouped-table.types';
import { type EventGroupEntry } from '../workflow-history-v2.types';

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

  const [tableScrollTargetEventId, setTableScrollTargetEventId] = useState<
    string | undefined
  >(undefined);

  const scrollTargetEventIndex = useMemo(() => {
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
    const ref = isUngroupedHistoryViewEnabled
      ? ungroupedTableVirtuosoRef
      : groupedTableVirtuosoRef;

    if (!ref.current) return;

    if (scrollTargetEventIndex !== undefined && scrollTargetEventIndex !== -1) {
      ref.current.scrollToIndex({
        index: scrollTargetEventIndex,
        behavior: 'auto',
        align: 'center',
      });
    }

    const timeoutId = setTimeout(
      () => setTableScrollTargetEventId(undefined),
      2000
    );

    return () => clearTimeout(timeoutId);
  }, [scrollTargetEventIndex, isUngroupedHistoryViewEnabled]);

  const handleTableScrollUp = useCallback(() => {
    const ref = isUngroupedHistoryViewEnabled
      ? ungroupedTableVirtuosoRef
      : groupedTableVirtuosoRef;
    if (!ref.current) return;

    ref.current.scrollToIndex({
      index: 0,
      // Position the start item as low as possible
      align: 'end',
    });
  }, [isUngroupedHistoryViewEnabled]);

  const handleTableScrollDown = useCallback(() => {
    const ref = isUngroupedHistoryViewEnabled
      ? ungroupedTableVirtuosoRef
      : groupedTableVirtuosoRef;
    if (!ref.current) return;

    ref.current.scrollToIndex({
      index: 'LAST',
      // Position the end item as high as possible
      align: 'start',
    });
  }, [isUngroupedHistoryViewEnabled]);

  const scrollToTableEvent = useCallback((eventId: string) => {
    setTableScrollTargetEventId(eventId);
  }, []);

  return {
    groupedTableVirtuosoRef,
    ungroupedTableVirtuosoRef,
    tableScrollTargetEventId,
    scrollToTableEvent,
    handleTableScrollUp,
    handleTableScrollDown,
  };
}
