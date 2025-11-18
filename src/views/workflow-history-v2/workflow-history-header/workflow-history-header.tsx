import React, { useEffect, useState } from 'react';

import { SegmentedControl, Segment } from 'baseui/segmented-control';
import { HeadingXSmall } from 'baseui/typography';
import { useInView } from 'react-intersection-observer';

import PageFiltersToggle from '@/components/page-filters/page-filters-toggle/page-filters-toggle';
import PageSection from '@/components/page-section/page-section';
import WorkflowHistoryExportJsonButton from '@/views/workflow-history/workflow-history-export-json-button/workflow-history-export-json-button';

import { overrides, styled } from './workflow-history-header.styles';
import { type Props } from './workflow-history-header.types';

export default function WorkflowHistoryHeader({
  isUngroupedHistoryViewEnabled,
  onClickGroupModeToggle,
  wfHistoryRequestArgs,
  pageFiltersProps,
  isStickyEnabled = true,
}: Props) {
  const [areFiltersShown, setAreFiltersShown] = useState(false);

  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    if (!isStickyEnabled && isSticky) setIsSticky(false);
  }, [isStickyEnabled, isSticky]);

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
            <HeadingXSmall>Workflow history</HeadingXSmall>
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
              <PageFiltersToggle
                // TODO: add popover here for new filters
                activeFiltersCount={activeFiltersCount}
                onClick={() => setAreFiltersShown((v) => !v)}
                isActive={areFiltersShown}
              />
            </styled.Actions>
          </styled.Header>
        </PageSection>
      </styled.Container>
    </>
  );
}
