'use client';
import React from 'react';

import { Badge } from 'baseui/badge';

import useStyletronClasses from '@/hooks/use-styletron-classes';

import WorkflowHistoryEventStatusBadge from '../workflow-history-event-status-badge/workflow-history-event-status-badge';
import WorkflowHistoryEventsCard from '../workflow-history-events-card/workflow-history-events-card';
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
  timeLabel,
  events,
  isLastEvent,
  eventsMetadata,
  hasMissingEvents,
  decodedPageUrlParams,
  badges,
  resetToDecisionEventId,
  getIsEventExpanded,
  onEventToggle,
  onReset,
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
          statusReady={!hasMissingEvents}
          size="medium"
        />
        <div className={cls.eventLabelAndSecondaryDetails}>
          <div className={cls.eventsLabel}>{label}</div>
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
          showEventPlaceholder={hasMissingEvents}
          decodedPageUrlParams={decodedPageUrlParams}
          getIsEventExpanded={getIsEventExpanded}
          onEventToggle={onEventToggle}
        />
      </div>
    </div>
  );
}
