'use client';
import React, { useMemo } from 'react';

import useStyletronClasses from '@/hooks/use-styletron-classes';
import formatPendingWorkflowHistoryEvent from '@/utils/data-formatters/format-pending-workflow-history-event';
import formatWorkflowHistoryEvent from '@/utils/data-formatters/format-workflow-history-event';

import WorkflowHistoryEventDetailsGroup from '../workflow-history-event-details-group/workflow-history-event-details-group';

import generateHistoryEventDetails from './helpers/generate-history-event-details';
import isPendingHistoryEvent from './helpers/is-pending-history-event';
import { cssStyles } from './workflow-history-event-details.styles';
import type { Props } from './workflow-history-event-details.types';

export default function WorkflowHistoryEventDetails({
  event,
  decodedPageUrlParams,
  negativeFields,
}: Props) {
  const { cls } = useStyletronClasses(cssStyles);

  const detailsEntries = useMemo(() => {
    const result = isPendingHistoryEvent(event)
      ? formatPendingWorkflowHistoryEvent(event)
      : formatWorkflowHistoryEvent(event);

    return result
      ? generateHistoryEventDetails({ details: result, negativeFields })
      : [];
  }, [event, negativeFields]);

  if (detailsEntries.length === 0)
    return <div className={cls.emptyDetails}>No Details</div>;

  return (
    <WorkflowHistoryEventDetailsGroup
      entries={detailsEntries}
      decodedPageUrlParams={decodedPageUrlParams}
    />
  );
}
