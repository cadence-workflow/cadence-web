import React, { useState } from 'react';

import { Button } from 'baseui/button';
import { HeadingXSmall } from 'baseui/typography';
import {
  MdOutlineViewStream,
  MdOutlineViewAgenda,
  MdSchedule,
} from 'react-icons/md';

import PageFiltersFields from '@/components/page-filters/page-filters-fields/page-filters-fields';
import PageFiltersToggle from '@/components/page-filters/page-filters-toggle/page-filters-toggle';
import PageSection from '@/components/page-section/page-section';

import workflowHistoryFiltersConfig from '../config/workflow-history-filters.config';
import WorkflowHistoryExpandAllEventsButton from '../workflow-history-expand-all-events-button/workflow-history-expand-all-events-button';
import WorkflowHistoryExportJsonButton from '../workflow-history-export-json-button/workflow-history-export-json-button';
import WorkflowHistoryTimelineChart from '../workflow-history-timeline-chart/workflow-history-timeline-chart';

import { styled, overrides } from './workflow-history-header.styles';
import { type Props } from './workflow-history-header.types';

export default function WorkflowHistoryHeader({
  isExpandAllEvents,
  toggleIsExpandAllEvents,
  isUngroupedHistoryViewEnabled,
  onClickGroupModeToggle,
  wfHistoryRequestArgs,
  pageFiltersProps,
  timelineChartProps,
}: Props) {
  const [areFiltersShown, setAreFiltersShown] = useState(true);
  const [isTimelineChartShown, setIsTimelineChartShown] = useState(false);

  const {
    activeFiltersCount,
    queryParams,
    setQueryParams,
    ...pageFiltersRest
  } = pageFiltersProps;

  return (
    <styled.Container>
      <PageSection>
        <styled.Header>
          <HeadingXSmall>Workflow history</HeadingXSmall>
          <styled.Actions>
            <WorkflowHistoryExpandAllEventsButton
              isExpandAllEvents={isExpandAllEvents}
              toggleIsExpandAllEvents={toggleIsExpandAllEvents}
            />
            <Button
              $size="compact"
              kind="secondary"
              onClick={onClickGroupModeToggle}
              startEnhancer={
                isUngroupedHistoryViewEnabled ? (
                  <MdOutlineViewStream size={16} />
                ) : (
                  <MdOutlineViewAgenda size={16} />
                )
              }
              overrides={overrides.toggleButton}
            >
              {isUngroupedHistoryViewEnabled ? 'Group' : 'Ungroup'}
            </Button>
            <WorkflowHistoryExportJsonButton {...wfHistoryRequestArgs} />
            <PageFiltersToggle
              activeFiltersCount={activeFiltersCount}
              onClick={() => setAreFiltersShown((v) => !v)}
              isActive={areFiltersShown}
            />
            <Button
              $size="compact"
              kind={isTimelineChartShown ? 'primary' : 'secondary'}
              onClick={() => setIsTimelineChartShown((v) => !v)}
              startEnhancer={<MdSchedule size={16} />}
              overrides={overrides.toggleButton}
            >
              Timeline
            </Button>
          </styled.Actions>
        </styled.Header>
        {areFiltersShown && (
          <PageFiltersFields
            pageFiltersConfig={workflowHistoryFiltersConfig}
            queryParams={queryParams}
            setQueryParams={setQueryParams}
            {...pageFiltersRest}
          />
        )}
        {typeof window !== 'undefined' && isTimelineChartShown && (
          <WorkflowHistoryTimelineChart {...timelineChartProps} />
        )}
      </PageSection>
    </styled.Container>
  );
}
