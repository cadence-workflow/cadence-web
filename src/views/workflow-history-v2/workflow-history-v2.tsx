import { useCallback, useContext, useMemo } from 'react';

import usePageFilters from '@/components/page-filters/hooks/use-page-filters';
import decodeUrlParams from '@/utils/decode-url-params';

import workflowHistoryFiltersConfig from '../workflow-history/config/workflow-history-filters.config';
import { WORKFLOW_HISTORY_PAGE_SIZE_CONFIG } from '../workflow-history/config/workflow-history-page-size.config';
import { WorkflowHistoryContext } from '../workflow-history/workflow-history-context-provider/workflow-history-context-provider';
import workflowPageQueryParamsConfig from '../workflow-page/config/workflow-page-query-params.config';
import { type WorkflowPageTabContentParams } from '../workflow-page/workflow-page-tab-content/workflow-page-tab-content.types';

import WorkflowHistoryGroupedTable from './workflow-history-grouped-table/workflow-history-grouped-table';
import WorkflowHistoryHeader from './workflow-history-header/workflow-history-header';
import { styled } from './workflow-history-v2.styles';
import { type Props } from './workflow-history-v2.types';

export default function WorkflowHistoryV2({ params }: Props) {
  const decodedParams = decodeUrlParams<WorkflowPageTabContentParams>(params);

  const { workflowTab, ...historyQueryParams } = decodedParams;
  const wfHistoryRequestArgs = {
    ...historyQueryParams,
    pageSize: WORKFLOW_HISTORY_PAGE_SIZE_CONFIG,
    waitForNewEvent: true,
  };

  const {
    activeFiltersCount,
    queryParams,
    setQueryParams,
    ...pageFiltersRest
  } = usePageFilters({
    pageQueryParamsConfig: workflowPageQueryParamsConfig,
    pageFiltersConfig: workflowHistoryFiltersConfig,
  });

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
          <div>WIP: ungrouped table</div>
        ) : (
          <WorkflowHistoryGroupedTable />
        )}
      </styled.ContentSection>
    </styled.Container>
  );
}
