import React, { useEffect, useState } from 'react';

import { Button } from 'baseui/button';
import { Filter } from 'baseui/icon';
import { StatefulPopover } from 'baseui/popover';
import { SegmentedControl, Segment } from 'baseui/segmented-control';
import { MdSchedule } from 'react-icons/md';
import { useInView } from 'react-intersection-observer';

import PageSection from '@/components/page-section/page-section';
import WorkflowHistoryExportJsonButton from '@/views/workflow-history/workflow-history-export-json-button/workflow-history-export-json-button';
import WorkflowHistoryFiltersMenu from '@/views/workflow-history-v2/workflow-history-filters-menu/workflow-history-filters-menu';

import WorkflowHistorySwitchToV1Button from '../workflow-history-switch-to-v1-button/workflow-history-switch-to-v1-button';
import WorkflowHistoryTimeline from '../workflow-history-timeline/workflow-history-timeline';

import { overrides, styled } from './workflow-history-header.styles';
import { type Props } from './workflow-history-header.types';

export default function WorkflowHistoryHeader({
  isUngroupedHistoryViewEnabled,
  onClickGroupModeToggle,
  wfHistoryRequestArgs,
  pageFiltersProps,
  isStickyEnabled = true,
  eventGroupsEntries,
  workflowStartTimeMs,
  workflowCloseTimeMs,
  selectedEventId,
  onClickShowInTable,
  decodedPageUrlParams,
}: Props) {
  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    if (!isStickyEnabled && isSticky) setIsSticky(false);
  }, [isStickyEnabled, isSticky]);

  const [isTimelineShown, setIsTimelineShown] = useState(false);

  const { ref: sentinelRef } = useInView({
    threshold: 1,
    onChange: (inView) => {
      setIsSticky(!inView);
    },
    skip: !isStickyEnabled,
  });

  const { activeFiltersCount } = pageFiltersProps;

  return (
    <>
      {isStickyEnabled && (
        <styled.Sentinel ref={sentinelRef} data-testid="sentinel" />
      )}
      <styled.Container
        $isSticky={isSticky}
        $isStickyEnabled={isStickyEnabled}
        data-testid="workflow-history-header-wrapper"
        data-is-sticky={isSticky}
      >
        <PageSection>
          <styled.Header>
            <styled.Heading>
              Workflow history
              <WorkflowHistorySwitchToV1Button />
            </styled.Heading>
            <styled.Actions>
              <WorkflowHistoryExportJsonButton {...wfHistoryRequestArgs} />
              <SegmentedControl
                activeKey={
                  isUngroupedHistoryViewEnabled ? 'ungrouped' : 'grouped'
                }
                onChange={() => onClickGroupModeToggle()}
                overrides={overrides.groupToggle}
              >
                <Segment
                  key="grouped"
                  label="Grouped"
                  overrides={overrides.groupToggleSegment}
                />
                <Segment
                  key="ungrouped"
                  label="Ungrouped"
                  overrides={overrides.groupToggleSegment}
                />
              </SegmentedControl>
              <StatefulPopover
                placement="bottomRight"
                overrides={overrides.popover}
                content={() => (
                  <WorkflowHistoryFiltersMenu
                    activeFiltersCount={activeFiltersCount}
                    queryParams={pageFiltersProps.queryParams}
                    setQueryParams={pageFiltersProps.setQueryParams}
                    resetAllFilters={pageFiltersProps.resetAllFilters}
                  />
                )}
                returnFocus
                autoFocus
              >
                <Button
                  size="compact"
                  kind="secondary"
                  startEnhancer={<Filter size={16} />}
                  overrides={overrides.filtersButton}
                >
                  {activeFiltersCount === 0
                    ? 'Filters'
                    : `Filters (${activeFiltersCount})`}
                </Button>
              </StatefulPopover>
              {workflowStartTimeMs && (
                <styled.TimelineButtonContainer>
                  <Button
                    size="compact"
                    kind={isTimelineShown ? 'primary' : 'secondary'}
                    startEnhancer={<MdSchedule size={16} />}
                    overrides={overrides.filtersButton}
                    onClick={() => setIsTimelineShown((v) => !v)}
                  >
                    Timeline
                  </Button>
                </styled.TimelineButtonContainer>
              )}
            </styled.Actions>
          </styled.Header>
          {isTimelineShown && workflowStartTimeMs && (
            <styled.TimelineContainer>
              <WorkflowHistoryTimeline
                eventGroupsEntries={eventGroupsEntries}
                workflowStartTimeMs={workflowStartTimeMs}
                workflowCloseTimeMs={workflowCloseTimeMs}
                selectedEventId={selectedEventId}
                onClickShowInTable={onClickShowInTable}
                decodedPageUrlParams={decodedPageUrlParams}
              />
            </styled.TimelineContainer>
          )}
        </PageSection>
      </styled.Container>
    </>
  );
}
