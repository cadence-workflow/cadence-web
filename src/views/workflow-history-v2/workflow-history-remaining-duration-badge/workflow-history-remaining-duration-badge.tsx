import React, { useEffect, useState } from 'react';

import { Badge } from 'baseui/badge';

import getFormattedRemainingDuration from './helpers/get-formatted-remaining-duration';
import { overrides } from './workflow-history-remaining-duration-badge.styles';
import { type Props } from './workflow-history-remaining-duration-badge.types';

export default function WorkflowHistoryRemainingDurationBadge({
  startTime,
  expectedEndTime,
  prefix,
  workflowIsArchived,
  workflowCloseStatus,
  loadingMoreEvents,
}: Props) {
  const workflowEnded =
    workflowIsArchived ||
    workflowCloseStatus !== 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID';

  const shouldHide = loadingMoreEvents || workflowEnded;

  const [remainingDuration, setRemainingDuration] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (shouldHide) {
      setRemainingDuration(null);
      return;
    }

    const updateRemainingDuration = () => {
      setRemainingDuration(getFormattedRemainingDuration(expectedEndTime));
    };

    updateRemainingDuration();

    const interval = setInterval(updateRemainingDuration, 1000);

    return () => clearInterval(interval);
  }, [startTime, expectedEndTime, workflowIsArchived, shouldHide]);

  if (shouldHide || !remainingDuration) {
    return null;
  }

  return (
    <Badge
      overrides={overrides.badge}
      content={`${prefix} ${remainingDuration}`}
      shape="rectangle"
      color="accent"
      hierarchy="secondary"
    />
  );
}
