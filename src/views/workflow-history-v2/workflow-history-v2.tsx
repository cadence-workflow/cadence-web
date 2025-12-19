import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { type VirtuosoHandle } from 'react-virtuoso';

import usePageFilters from '@/components/page-filters/hooks/use-page-filters';
import SectionLoadingIndicator from '@/components/section-loading-indicator/section-loading-indicator';
import useExpansionToggle from '@/hooks/use-expansion-toggle/use-expansion-toggle';
import useThrottledState from '@/hooks/use-throttled-state';
import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';
import decodeUrlParams from '@/utils/decode-url-params';
import sortBy from '@/utils/sort-by';

import { resetWorkflowActionConfig } from '../workflow-actions/config/workflow-actions.config';
import WorkflowActionsModal from '../workflow-actions/workflow-actions-modal/workflow-actions-modal';
import { WORKFLOW_HISTORY_PAGE_SIZE_CONFIG } from '../workflow-history/config/workflow-history-page-size.config';
import getSortableEventId from '../workflow-history/helpers/get-sortable-event-id';
import pendingActivitiesInfoToEvents from '../workflow-history/helpers/pending-activities-info-to-events';
import pendingDecisionInfoToEvent from '../workflow-history/helpers/pending-decision-info-to-event';
import useInitialSelectedEvent from '../workflow-history/hooks/use-initial-selected-event';
import useWorkflowHistoryFetcher from '../workflow-history/hooks/use-workflow-history-fetcher';
import useWorkflowHistoryGrouper from '../workflow-history/hooks/use-workflow-history-grouper';
import { WorkflowHistoryContext } from '../workflow-history/workflow-history-context-provider/workflow-history-context-provider';
import workflowPageQueryParamsConfig from '../workflow-page/config/workflow-page-query-params.config';
import { useSuspenseDescribeWorkflow } from '../workflow-page/hooks/use-describe-workflow';
import { type WorkflowPageTabContentParams } from '../workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import WORKFLOW_HISTORY_FETCH_EVENTS_THROTTLE_MS_CONFIG from './config/workflow-history-fetch-events-throttle-ms.config';
import workflowHistoryFiltersConfig from './config/workflow-history-filters.config';
import WORKFLOW_HISTORY_RENDER_FETCHED_EVENTS_THROTTLE_MS_CONFIG from './config/workflow-history-render-fetched-events-throttle-ms.config';
import WORKFLOW_HISTORY_SET_RANGE_THROTTLE_MS_CONFIG from './config/workflow-history-set-range-throttle-ms.config';
import WorkflowHistoryGroupedTable from './workflow-history-grouped-table/workflow-history-grouped-table';
import WorkflowHistoryHeader from './workflow-history-header/workflow-history-header';
import WorkflowHistoryUngroupedTable from './workflow-history-ungrouped-table/workflow-history-ungrouped-table';
import { styled } from './workflow-history-v2.styles';
import {
  type VisibleHistoryRanges,
  type Props,
} from './workflow-history-v2.types';

export default function WorkflowHistoryV2({ params }: Props) {
  const decodedParams = decodeUrlParams<WorkflowPageTabContentParams>(params);

  const { workflowTab, ...historyQueryParams } = decodedParams;
  const wfHistoryRequestArgs = {
    ...historyQueryParams,
    pageSize: WORKFLOW_HISTORY_PAGE_SIZE_CONFIG,
    waitForNewEvent: true,
  };

  const {
    activeFiltersCount: _unusedActiveFiltersCount,
    queryParams,
    setQueryParams,
    ...pageFiltersRest
  } = usePageFilters({
    pageQueryParamsConfig: workflowPageQueryParamsConfig,
    pageFiltersConfig: workflowHistoryFiltersConfig,
  });

  const activeFiltersCount = useMemo(
    () =>
      (queryParams.historyEventStatuses?.length ?? 0) +
      (queryParams.historyEventTypes?.length ?? 0),
    [queryParams.historyEventStatuses, queryParams.historyEventTypes]
  );

  const { data: wfExecutionDescription } = useSuspenseDescribeWorkflow({
    ...params,
  });
  const { workflowExecutionInfo } = wfExecutionDescription;

  const {
    eventGroups,
    updateEvents: updateGrouperEvents,
    updatePendingEvents: updateGrouperPendingEvents,
  } = useWorkflowHistoryGrouper();

  const isWorkflowRunning =
    !workflowExecutionInfo?.closeStatus ||
    workflowExecutionInfo.closeStatus ===
      'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID';

  const { historyQuery, startLoadingHistory } = useWorkflowHistoryFetcher(
    {
      domain: wfHistoryRequestArgs.domain,
      cluster: wfHistoryRequestArgs.cluster,
      workflowId: wfHistoryRequestArgs.workflowId,
      runId: wfHistoryRequestArgs.runId,
      pageSize: wfHistoryRequestArgs.pageSize,
      waitForNewEvent: wfHistoryRequestArgs.waitForNewEvent,
    },
    {
      onEventsChange: updateGrouperEvents,
      renderThrottleMs:
        WORKFLOW_HISTORY_RENDER_FETCHED_EVENTS_THROTTLE_MS_CONFIG,
      fetchThrottleMs: isWorkflowRunning
        ? WORKFLOW_HISTORY_FETCH_EVENTS_THROTTLE_MS_CONFIG
        : undefined,
    }
  );

  const {
    data: result,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isPending,
    error,
    isFetchNextPageError,
  } = historyQuery;

  const allEventIds = useMemo(
    () =>
      (result?.pages || [])
        .flat(1)
        .map(({ history }) => history?.events || [])
        .flat(1)
        .map(({ eventId }) => eventId),
    [result]
  );

  useEffect(() => {
    const pendingStartActivities = pendingActivitiesInfoToEvents(
      wfExecutionDescription.pendingActivities
    );
    const pendingStartDecision = wfExecutionDescription.pendingDecision
      ? pendingDecisionInfoToEvent(wfExecutionDescription.pendingDecision)
      : null;

    updateGrouperPendingEvents({
      pendingStartActivities,
      pendingStartDecision,
    });
  }, [wfExecutionDescription, updateGrouperPendingEvents]);

  const filteredEventGroupsById = useMemo(
    () =>
      sortBy(
        Object.entries(eventGroups),
        ([_, { firstEventId }]) => getSortableEventId(firstEventId),
        'ASC'
      ).filter(([_, g]) =>
        workflowHistoryFiltersConfig.every((f) =>
          f.filterFunc(g, {
            historyEventTypes: queryParams.historyEventTypes,
            historyEventStatuses: queryParams.historyEventStatuses,
          })
        )
      ),
    [
      eventGroups,
      queryParams.historyEventTypes,
      queryParams.historyEventStatuses,
    ]
  );

  const { ungroupedViewUserPreference, setUngroupedViewUserPreference } =
    useContext(WorkflowHistoryContext);

  const isUngroupedHistoryViewEnabled = useMemo(() => {
    if (queryParams.ungroupedHistoryViewEnabled !== undefined)
      return queryParams.ungroupedHistoryViewEnabled;

    return ungroupedViewUserPreference ?? false;
  }, [queryParams.ungroupedHistoryViewEnabled, ungroupedViewUserPreference]);

  const onClickGroupModeToggle = useCallback(() => {
    setUngroupedViewUserPreference(!isUngroupedHistoryViewEnabled);

    setQueryParams({
      ungroupedHistoryViewEnabled: isUngroupedHistoryViewEnabled
        ? 'false'
        : 'true',
    });

    // TODO: set timeline list visible range depending on what was visible before,
    // once the grouped and ungrouped tables have been fully implemented.

    // History V1 code below for reference

    // setTimelineListVisibleRange(() => ({
    //   startIndex: -1,
    //   endIndex: -1,
    //   compactStartIndex: -1,
    //   compactEndIndex: -1,
    //   ungroupedStartIndex: -1,
    //   ungroupedEndIndex: -1,
    // }));
  }, [
    isUngroupedHistoryViewEnabled,
    setQueryParams,
    setUngroupedViewUserPreference,
  ]);

  const [_, setVisibleGroupsRange] = useThrottledState<VisibleHistoryRanges>(
    {
      groupedStartIndex: -1,
      groupedEndIndex: -1,
      ungroupedStartIndex: -1,
      ungroupedEndIndex: -1,
    },
    WORKFLOW_HISTORY_SET_RANGE_THROTTLE_MS_CONFIG,
    {
      leading: false,
      trailing: true,
    }
  );

  const selectedEventIdWithinGroup = useMemo(
    () =>
      queryParams.historySelectedEventId?.startsWith('summary_')
        ? queryParams.historySelectedEventId.replace(/^summary_/, '')
        : queryParams.historySelectedEventId,
    [queryParams.historySelectedEventId]
  );

  const {
    initialEventFound,
    initialEventGroupIndex,
    shouldSearchForInitialEvent,
  } = useInitialSelectedEvent({
    selectedEventId: selectedEventIdWithinGroup,
    eventGroups,
    filteredEventGroupsEntries: filteredEventGroupsById,
  });

  const isLastPageEmpty =
    result?.pages?.[result?.pages?.length - 1]?.history?.events.length === 0;

  useEffect(() => {
    startLoadingHistory();
  }, [startLoadingHistory]);

  const reachedEndOfAvailableHistory =
    (!hasNextPage && !isPending) ||
    (hasNextPage && isLastPageEmpty && !isFetchNextPageError);

  const contentIsLoading =
    isLoading ||
    (shouldSearchForInitialEvent &&
      !initialEventFound &&
      !reachedEndOfAvailableHistory);

  const groupedTableVirtuosoRef = useRef<VirtuosoHandle>(null);
  const ungroupedTableVirtuosoRef = useRef<VirtuosoHandle>(null);

  const workflowCloseTimeMs = workflowExecutionInfo?.closeTime
    ? parseGrpcTimestamp(workflowExecutionInfo?.closeTime)
    : null;

  const [resetToDecisionEventId, setResetToDecisionEventId] = useState<
    string | undefined
  >(undefined);

  const { getIsItemExpanded, toggleIsItemExpanded } = useExpansionToggle({
    items: allEventIds,
    initialState: selectedEventIdWithinGroup
      ? {
          [selectedEventIdWithinGroup]: true,
        }
      : {},
  });

  if (contentIsLoading) {
    return <SectionLoadingIndicator />;
  }

  return (
    <styled.Container>
      <WorkflowHistoryHeader
        isUngroupedHistoryViewEnabled={isUngroupedHistoryViewEnabled}
        onClickGroupModeToggle={onClickGroupModeToggle}
        wfHistoryRequestArgs={wfHistoryRequestArgs}
        pageFiltersProps={{
          activeFiltersCount,
          queryParams,
          setQueryParams,
          ...pageFiltersRest,
        }}
      />
      <styled.ContentSection>
        {isUngroupedHistoryViewEnabled ? (
          <WorkflowHistoryUngroupedTable
            eventGroupsById={filteredEventGroupsById}
            virtuosoRef={ungroupedTableVirtuosoRef}
            setVisibleRange={({ startIndex, endIndex }) =>
              setVisibleGroupsRange((prevRange) => ({
                ...prevRange,
                ungroupedStartIndex: startIndex,
                ungroupedEndIndex: endIndex,
              }))
            }
            decodedPageUrlParams={decodedParams}
            selectedEventId={selectedEventIdWithinGroup}
            resetToDecisionEventId={setResetToDecisionEventId}
            getIsEventExpanded={getIsItemExpanded}
            toggleIsEventExpanded={toggleIsItemExpanded}
            error={error}
            hasMoreEvents={hasNextPage}
            fetchMoreEvents={startLoadingHistory}
            isFetchingMoreEvents={isFetchingNextPage}
          />
        ) : (
          <WorkflowHistoryGroupedTable
            eventGroupsById={filteredEventGroupsById}
            virtuosoRef={groupedTableVirtuosoRef}
            initialStartIndex={initialEventGroupIndex}
            setVisibleRange={({ startIndex, endIndex }) =>
              setVisibleGroupsRange((prevRange) => ({
                ...prevRange,
                groupedStartIndex: startIndex,
                groupedEndIndex: endIndex,
              }))
            }
            decodedPageUrlParams={decodedParams}
            reachedEndOfAvailableHistory={reachedEndOfAvailableHistory}
            workflowCloseStatus={workflowExecutionInfo?.closeStatus}
            workflowIsArchived={workflowExecutionInfo?.isArchived || false}
            workflowCloseTimeMs={workflowCloseTimeMs}
            selectedEventId={queryParams.historySelectedEventId}
            resetToDecisionEventId={setResetToDecisionEventId}
            getIsEventExpanded={getIsItemExpanded}
            toggleIsEventExpanded={toggleIsItemExpanded}
            error={error}
            hasMoreEvents={hasNextPage}
            fetchMoreEvents={startLoadingHistory}
            isFetchingMoreEvents={isFetchingNextPage}
          />
        )}
      </styled.ContentSection>
      {resetToDecisionEventId && (
        <WorkflowActionsModal
          {...decodedParams}
          initialFormValues={{
            decisionFinishEventId: resetToDecisionEventId,
          }}
          action={resetWorkflowActionConfig}
          onClose={() => {
            setResetToDecisionEventId(undefined);
          }}
        />
      )}
    </styled.Container>
  );
}
