'use client';
import React from 'react';

import { Badge } from 'baseui/badge';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import WorkflowHistoryEventStatusBadge from '../workflow-history-event-status-badge/workflow-history-event-status-badge';
import WorkflowHistoryEventsCard from '../workflow-history-events-card/workflow-history-events-card';
import WorkflowHistoryEventsDurationBadge from '../workflow-history-events-duration-badge/workflow-history-events-duration-badge';
import WorkflowHistoryGroupLabel from '../workflow-history-group-label/workflow-history-group-label';
import WorkflowHistoryTimelineResetButton from '../workflow-history-timeline-reset-button/workflow-history-timeline-reset-button';

import {
  cssStyles,
  overrides,
  styled,
} from './workflow-history-timeline-group.styles';
import { type Props } from './workflow-history-timeline-group.types';

export default function WorkflowHistoryTimelineGroup({
  status,
  label,
  shortLabel,
  timeLabel,
  startTimeMs,
  closeTimeMs,
  workflowCloseTimeMs,
  workflowCloseStatus,
  workflowIsArchived,
  events,
  isLastEvent,
  eventsMetadata,
  hasMissingEvents,
  showLoadingMoreEvents,
  decodedPageUrlParams,
  badges,
  resetToDecisionEventId,
  getIsEventExpanded,
  onEventToggle,
  onReset,
  selected,
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);
  const hasBadges = badges !== undefined && badges.length > 0;

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className={cls.groupContainer}>
      <div className={cls.eventHeader}>
        <WorkflowHistoryEventStatusBadge
          status={status}
          statusReady={!showLoadingMoreEvents}
          size="medium"
        />
        <div className={cls.eventLabelAndSecondaryDetails}>
          <div className={cls.eventsLabel}>
            <WorkflowHistoryGroupLabel label={label} shortLabel={shortLabel} />
          </div>
          <div className={cls.eventSecondaryDetails}>
            {hasBadges && (
              <>
                {badges.map((badge) => (
                  <Badge
                    key={badge.content}
                    overrides={overrides.headerBadge}
                    content={badge.content}
                    shape="rectangle"
                    color="primary"
                  />
                ))}
              </>
            )}
            {startTimeMs && (
              <WorkflowHistoryEventsDurationBadge
                startTime={startTimeMs}
                closeTime={closeTimeMs}
                eventsCount={events.length}
                loadingMoreEvents={showLoadingMoreEvents}
                hasMissingEvents={hasMissingEvents}
                workflowCloseTime={workflowCloseTimeMs}
                workflowIsArchived={workflowIsArchived}
                workflowCloseStatus={workflowCloseStatus}
              />
            )}
            <div suppressHydrationWarning className={cls.eventsTime}>
              {timeLabel}
            </div>
            {resetToDecisionEventId && (
              <WorkflowHistoryTimelineResetButton
                workflowId={decodedPageUrlParams.workflowId}
                runId={decodedPageUrlParams.runId}
                domain={decodedPageUrlParams.domain}
                cluster={decodedPageUrlParams.cluster}
                onReset={handleReset}
              />
            )}
          </div>
        </div>
      </div>
      <div className={cls.eventCardContainer}>
        <styled.VerticalDivider $hidden={isLastEvent} />
        <WorkflowHistoryEventsCard
          events={events}
          eventsMetadata={eventsMetadata}
          showEventPlaceholder={showLoadingMoreEvents}
          decodedPageUrlParams={decodedPageUrlParams}
          getIsEventExpanded={getIsEventExpanded}
          onEventToggle={onEventToggle}
          animateBorderOnEnter={selected}
        />
      </div>
    </div>
  );
}
